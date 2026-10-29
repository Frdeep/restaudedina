// Official embeds are already present in HTML and load automatically, even
// without JavaScript. Enhance their narrow-screen layout and retry controls.
export function initSocialFeeds(){
 for(const widget of document.querySelectorAll('[data-social-key]')){
  const frames=[...widget.querySelectorAll('iframe')],retry=widget.querySelector('[data-social-retry]'),status=widget.querySelector('[data-social-status]');
  if(!frames.length)continue;
  const service=widget.dataset.social==='instagram'?'Instagram':'Facebook';
  for(const frame of frames){
   frame.addEventListener('error',()=>{status.textContent='Le lecteur '+service+' est indisponible. Utilisez le lien direct ou réessayez.';});
   const viewport=frame.closest('.social-frame-window');
   if(viewport&&window.ResizeObserver){let previousWidth=-1;const observer=new ResizeObserver(()=>{
    const width=viewport.getBoundingClientRect().width;if(width<=0||Math.abs(width-previousWidth)<.5)return;previousWidth=width;
    const layoutWidth=Math.max(326,width),scale=width/layoutWidth;
    frame.style.width=layoutWidth+'px';frame.style.transform=`scale(${scale})`;viewport.style.height=(660*scale)+'px';
   });observer.observe(viewport);}
  }
  if(retry){retry.hidden=false;retry.addEventListener('click',()=>{
   for(const frame of frames)frame.src=frame.getAttribute('src');
   status.textContent='Nouvel essai de chargement. Les liens vers '+service+' restent disponibles.';
  });}
 }
}
