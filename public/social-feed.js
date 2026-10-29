// Embeds are deliberately built from the supplied official permalinks. No scraping,
// fabricated posts, profile iframe, public access token or simulated live sync.
const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el;};
export function initSocialFeeds(socials){
 for(const service of ['instagram','facebook']){
  const button=document.querySelector(`[data-social-load="${service}"]`),slot=document.querySelector(`[data-social-slot="${service}"]`),retry=document.querySelector(`[data-social-retry="${service}"]`),status=document.querySelector(`[data-social-status="${service}"]`);
  if(!button||!slot)continue;
  const initial=[...slot.childNodes].map(n=>n.cloneNode(true));let loaded=false,timers=[],observers=[],generation=0;
  const name=service==='instagram'?'Instagram':'Facebook';
  function mount(url,title,permalink,cls='social-post-card'){
   const card=node('article',cls),frame=node('iframe'),fallback=node('a','social-post-link','Ouvrir sur '+name);
   fallback.href=permalink;fallback.target='_blank';fallback.rel='noopener noreferrer';
   frame.title=title;frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';frame.allow='encrypted-media; picture-in-picture';frame.src=url;
   const ticket=generation;
   // Cross-origin load events do not certify that a post was made visible by Meta.
   frame.addEventListener('error',()=>{if(ticket===generation){card.classList.add('embed-unavailable');status.textContent='Le lecteur est indisponible. Utilisez le lien vers '+name+' ou réessayez.';}});
   if(service==='instagram'){
    const viewport=node('div','social-frame-window');viewport.append(frame);card.append(viewport,fallback);slot.append(card);
    // Official embeds require a minimum layout width. Fit that layout into narrow
    // phones without clipping its right edge or disabling page zoom.
    if(window.ResizeObserver){let previousWidth=-1;const observer=new ResizeObserver(()=>{
     const width=viewport.getBoundingClientRect().width;if(width<=0||Math.abs(width-previousWidth)<.5)return;previousWidth=width;
     const layoutWidth=Math.max(326,width),scale=width/layoutWidth;
     frame.style.width=layoutWidth+'px';frame.style.transform=`scale(${scale})`;viewport.style.height=(660*scale)+'px';
    });observer.observe(viewport);observers.push(observer);}
   }else{card.append(frame,fallback);slot.append(card);}
  }
  function show(value){
   for(const timer of timers)clearTimeout(timer);timers=[];for(const observer of observers)observer.disconnect();observers=[];generation++;loaded=value;slot.replaceChildren();
   if(value){
    if(service==='instagram'){
     const posts=(socials.instagramPosts||[]).filter(url=>/^https:\/\/www\.instagram\.com\/(reel|p)\/[a-zA-Z0-9_-]+\/$/.test(url));
     posts.forEach((url,n)=>mount(url+'embed/','Publication Instagram '+(n+1)+' de La Cuisine de Dina',url));
     if(!posts.length)status.textContent='Aucune publication disponible. Ouvrez le profil Instagram.';
    }else{
     // Use the numeric Page URL rather than Facebook's localized /p/ share path.
     const url=new URL('https://www.facebook.com/plugins/page.php');
     url.searchParams.set('href','https://www.facebook.com/100060362415980/');url.searchParams.set('tabs','timeline');
     url.searchParams.set('width',String(Math.max(180,Math.min(500,Math.floor(slot.getBoundingClientRect().width)))));url.searchParams.set('height','650');
     url.searchParams.set('small_header','false');url.searchParams.set('adapt_container_width','true');url.searchParams.set('hide_cover','false');url.searchParams.set('show_facepile','false');
     mount(url.href,'Fil officiel Facebook de La Cuisine de Dina',socials.facebook,'facebook-timeline');
    }
    status.textContent='Lecteurs '+name+' activés. Si le contenu ne s’affiche pas, ouvrez les publications directement sur '+name+'.';
    timers.push(setTimeout(()=>{if(loaded)status.textContent='Le contenu dépend des autorisations de '+name+' et des protections de votre navigateur. Vous pouvez réessayer ou ouvrir les liens officiels.';},12000));
   }else{
    slot.append(...initial.map(n=>n.cloneNode(true)));status.textContent='Contenu externe masqué. Les liens officiels restent disponibles.';
   }
   button.textContent=value?'Masquer '+name:'Afficher '+name;button.setAttribute('aria-pressed',String(value));retry.hidden=!value;
   try{if(value)sessionStorage.setItem('dina.meta.'+service,'yes');else sessionStorage.removeItem('dina.meta.'+service);}catch{}
  }
  button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>show(!loaded));retry.addEventListener('click',()=>show(true));
  try{if(sessionStorage.getItem('dina.meta.'+service)==='yes')show(true);}catch{}
 }
}
