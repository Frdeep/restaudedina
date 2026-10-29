import {initSocialFeeds} from './social-feed.js';
import {CART_KEY,MAX_QUANTITY,sanitizeCart,cartTotal,addItem} from './cart-core.js';
const money=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n/100);
const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
const motion=()=>window.gsap&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const announce=text=>{const el=document.querySelector('#shop-announcement');if(el)el.textContent=text;};
const dialogTriggers=new WeakMap();
function openDialog(dialog,trigger,event){
 if(!dialog||typeof dialog.showModal!=='function')return false;
 dialogTriggers.set(dialog,trigger||document.activeElement);
 if(!dialog.open)dialog.showModal();
 if(motion()&&event?.detail>0)window.gsap.fromTo(dialog,{opacity:0,scale:.97},{opacity:1,scale:1,duration:.2,ease:'power2.out',clearProps:'all'});
 return true;
}
for(const dialog of document.querySelectorAll('dialog')){
 dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
 dialog.addEventListener('close',()=>{const trigger=dialogTriggers.get(dialog);if(trigger?.isConnected)trigger.focus({preventScroll:true});});
 dialog.querySelectorAll('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>dialog.close()));
}
document.querySelectorAll('[data-legal]').forEach(a=>a.addEventListener('click',e=>{
 if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
 const dialog=document.querySelector('#legal-'+a.dataset.legal);
 if(dialog&&typeof dialog.showModal==='function'){e.preventDefault();openDialog(dialog,a,e);}
}));
function visual(p){
 const wrap=make('div','product-visual'+(p.media.crop!=='none'?' is-crop crop-'+p.media.crop:''));
 const img=make('img');img.src=`./media/${p.media.file}-480.webp`;img.alt=p.media.label;img.width=480;img.height=p.media.file==='six-assiettes'?384:480;img.decoding='async';wrap.append(img);return wrap;
}
function initShop(C){
 const products=new Map(C.products.map(p=>[p.id,p]));
 let raw=null;try{raw=localStorage.getItem(CART_KEY);}catch{}
 let cart=sanitizeCart(raw,C);
 try{if(raw&&cart.lines.length===0)localStorage.removeItem(CART_KEY);}catch{}
 const cartDialog=document.querySelector('#cart-dialog');
 function persist(){cart.updatedAt=Date.now();try{if(cart.lines.length)localStorage.setItem(CART_KEY,JSON.stringify(cart));else localStorage.removeItem(CART_KEY);}catch{announce('Votre panier reste disponible sur cette page ; le navigateur ne permet pas de le conserver.');}render();}
 function offerUndo(removed,message){
  for(const slot of document.querySelectorAll('[data-cart-undo]')){
   slot.replaceChildren(make('span','',message));const undo=make('button','text-button','Annuler');undo.type='button';
   undo.addEventListener('click',()=>{let failed=0;for(const line of removed){try{cart=addItem(cart,C,line.productId,line.qty,line.choices);}catch{failed++;}}persist();const message=failed?'Certaines sélections n’ont pas pu être rétablies : quantité maximale atteinte.':'Sélection rétablie dans le panier.';document.querySelectorAll('[data-cart-undo]').forEach(n=>n.replaceChildren(...(failed?[make('span','',message)]:[])));announce(message);const scope=cartDialog?.open?cartDialog:document;scope.querySelector('.cart-line-name')?.focus({preventScroll:true});});slot.append(undo);
  }
 }
 function change(key,delta,source){
  const line=cart.lines.find(l=>l.key===key);if(!line)return;
  const removed=(delta==='remove'||(typeof delta==='number'&&line.qty+delta<=0))?[structuredClone(line)]:[];
  if(delta==='remove')cart.lines=cart.lines.filter(l=>l!==line);
  else {const qty=line.qty+delta;if(qty>MAX_QUANTITY){announce('Quantité maximale : 20 pour cette sélection.');return;}if(qty<=0)cart.lines=cart.lines.filter(l=>l!==line);else line.qty=qty;}
  const action=source?.dataset.cartAction,container=source?.closest('[data-cart-items]');persist();
  if(removed.length)offerUndo(removed,'Sélection retirée.');
  if(container){const target=[...container.querySelectorAll('button')].find(b=>b.dataset.lineKey===key&&b.dataset.cartAction===action&&!b.disabled)||[...container.querySelectorAll('button')].find(b=>b.dataset.lineKey===key&&!b.disabled);if(target)target.focus({preventScroll:true});else document.querySelector('[data-clear-cart]:not([hidden]),.cart-continue,.cart-empty-card a')?.focus({preventScroll:true});}
 }
 function render(){
  const count=cart.lines.reduce((n,l)=>n+l.qty,0);
  document.querySelectorAll('[data-cart-count]').forEach(el=>{el.textContent=String(count);});
  document.querySelectorAll('[data-open-cart]').forEach(el=>el.setAttribute('aria-label',`Ouvrir le panier, ${count} article${count===1?'':'s'}`));
  document.querySelectorAll('[data-cart-total]').forEach(el=>{el.textContent=money(cartTotal(cart,C));});
  document.querySelectorAll('[data-cart-empty]').forEach(el=>{el.hidden=count>0;});
  document.querySelectorAll('[data-clear-cart]').forEach(el=>{el.hidden=count===0;});
  document.querySelectorAll('[data-cart-items]').forEach(container=>{
   container.replaceChildren();
   for(const line of cart.lines){
    const p=products.get(line.productId),item=make('article','cart-line');item.dataset.lineKey=line.key;
    const picture=make('a','cart-line-picture');picture.href=p.url;picture.setAttribute('aria-label','Voir '+p.name);picture.append(visual(p));
    const content=make('div','cart-line-content'),title=make('a','cart-line-name',p.name);title.href=p.url;content.append(title);
    const options=[...line.choices.sides,...line.choices.sauces];if(options.length)content.append(make('p','cart-line-options',options.join(' · ')));
    content.append(make('p','cart-unit-price',money(p.priceCents)+' par sélection'));
    const quantity=make('div','cart-quantity');
    for(const [action,label,delta] of [['minus','Diminuer la quantité de '+p.name,-1],['plus','Augmenter la quantité de '+p.name,1]]){
     const b=make('button','quantity-button',action==='minus'?'−':'+');b.type='button';b.setAttribute('aria-label',label);b.dataset.lineKey=line.key;b.dataset.cartAction=action;b.disabled=action==='plus'&&line.qty>=MAX_QUANTITY;b.addEventListener('click',()=>change(line.key,delta,b));
     if(action==='plus')quantity.append(make('span','quantity-value',String(line.qty)));quantity.append(b);
    }
    const remove=make('button','text-button cart-remove','Retirer');remove.type='button';remove.setAttribute('aria-label','Retirer '+p.name);remove.dataset.lineKey=line.key;remove.dataset.cartAction='remove';remove.addEventListener('click',()=>change(line.key,'remove',remove));
    content.append(quantity,remove);item.append(picture,content,make('strong','cart-line-total',money(p.priceCents*line.qty)));container.append(item);
   }
  });
  const checkout=document.querySelector('[data-demo-checkout]'),accept=document.querySelector('#demo-accept');
  if(checkout)checkout.disabled=!count||!accept?.checked;
  const result=document.querySelector('#demo-result');if(result)result.hidden=true;
 }
 document.querySelectorAll('[data-enable-cart]').forEach(b=>{b.disabled=false;});
 document.querySelectorAll('[data-product-form]').forEach(form=>form.addEventListener('submit',e=>{
  e.preventDefault();const p=products.get(form.dataset.productForm);if(!p)return;
  const error=form.querySelector('[data-form-error]');error.hidden=true;
  if(!form.reportValidity())return;
  const data=new FormData(form),qty=Number(data.get('quantity'));
  const choices={sides:Array.from({length:p.sidesCount},(_,n)=>data.get('side-'+n)),sauces:Array.from({length:p.saucesCount},(_,n)=>data.get('sauce-'+n))};
  try{cart=addItem(cart,C,p.id,qty,choices);persist();announce(p.name+' ajouté au panier.');openDialog(cartDialog,form.querySelector('button[type=submit]'),e);if(motion()&&!form.querySelector('button[type=submit]').matches(':focus-visible'))window.gsap.fromTo('[data-cart-count]',{scale:1.16},{scale:1,duration:.16,ease:'power2.out',clearProps:'transform'});}
  catch(problem){error.textContent=problem.message;error.hidden=false;error.tabIndex=-1;error.focus();}
 }));
 document.querySelectorAll('[data-open-cart]').forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;if(cartDialog&&typeof cartDialog.showModal==='function'){e.preventDefault();render();openDialog(cartDialog,a,e);}}));
 document.querySelectorAll('[data-clear-cart]').forEach(b=>b.addEventListener('click',()=>{const removed=structuredClone(cart.lines);cart.lines=[];persist();offerUndo(removed,'Le panier a été vidé.');announce('Le panier a été vidé.');document.querySelector('.cart-empty-card a')?.focus();}));
 const accept=document.querySelector('#demo-accept'),checkout=document.querySelector('[data-demo-checkout]');
 accept?.addEventListener('change',()=>{if(checkout)checkout.disabled=!accept.checked||!cart.lines.length;});
 checkout?.addEventListener('click',()=>{
  const error=document.querySelector('#checkout-error'),result=document.querySelector('#demo-result');
  if(!cart.lines.length||!accept.checked){error.textContent='Ajoutez un plat et confirmez le mode démonstration pour continuer.';error.hidden=false;return;}
  error.hidden=true;result.hidden=false;result.tabIndex=-1;result.focus({preventScroll:true});result.scrollIntoView({block:'nearest',behavior:'auto'});
 });
 window.addEventListener('storage',e=>{if(e.key===CART_KEY||e.key===null){let value=null;try{value=localStorage.getItem(CART_KEY);}catch{}cart=sanitizeCart(value,C);render();}});
 render();
 const preview=document.querySelector('#dish-preview'),slot=preview?.querySelector('[data-preview-content]');
 let suppressPreviewFocus=false,source=null,lastActivation={id:'',time:0},hideTimer;
 function hidePreview(restore=false){if(!preview)return;preview.hidden=true;const previous=source;previous?.setAttribute('aria-expanded','false');source=null;if(restore&&previous){suppressPreviewFocus=true;previous.focus({preventScroll:true});suppressPreviewFocus=false;lastActivation={id:'',time:0};}}
 function showPreview(link,animate=false){
  const p=products.get(link?.dataset.productId);if(!preview||!slot||!p)return;
  clearTimeout(hideTimer);if(source===link&&!preview.hidden)return;const changed=source!==link;source?.setAttribute('aria-expanded','false');source=link;link.setAttribute('aria-controls','dish-preview');link.setAttribute('aria-expanded','true');
  if(changed||preview.hidden){slot.replaceChildren(visual(p),make('h3','preview-name',p.name),make('p','preview-price',money(p.priceCents)+' · prix indicatif'),make('p','preview-media-note',p.media.label));const more=make('a','button preview-detail','Voir le plat');more.href=p.url;slot.append(more);}
  const wasHidden=preview.hidden;preview.hidden=false;
  const r=link.getBoundingClientRect(),w=preview.offsetWidth,h=preview.offsetHeight;
  let x=r.right+12;if(x+w>innerWidth-12)x=r.left-w-12;if(x<12)x=(innerWidth-w)/2;
  let y=r.top;if(window.matchMedia('(pointer: coarse)').matches)y=r.bottom+8;
  if(y+h>innerHeight-12)y=r.top-h-8;y=Math.max(12,Math.min(y,innerHeight-h-12));
  preview.style.left=Math.max(12,x)+'px';preview.style.top=y+'px';
  if(wasHidden&&animate&&motion())window.gsap.fromTo(preview,{opacity:0,scale:.97},{opacity:1,scale:1,duration:.16,ease:'power2.out',clearProps:'opacity,transform'});
 }
 document.querySelectorAll('.dish-link').forEach(link=>{
  link.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')showPreview(link,true);});
  link.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')hideTimer=setTimeout(()=>hidePreview(),180);});
  link.addEventListener('focus',()=>{if(suppressPreviewFocus)return;requestAnimationFrame(()=>{if(document.activeElement===link)showPreview(link);});});
  link.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')showPreview(link);});
  link.addEventListener('click',e=>{
   if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.detail===0)return;
   e.preventDefault();const now=performance.now();
   if(e.detail>=2||(lastActivation.id===link.dataset.productId&&now-lastActivation.time<450)){location.assign(link.href);return;}
   lastActivation={id:link.dataset.productId,time:now};showPreview(link,true);
  });
 });
 preview?.addEventListener('pointerenter',()=>clearTimeout(hideTimer));
 preview?.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')hideTimer=setTimeout(()=>hidePreview(),180);});
 preview?.querySelector('[data-close-preview]')?.addEventListener('click',()=>hidePreview(true));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&preview&&!preview.hidden)hidePreview(true);});
 document.addEventListener('click',e=>{if(!e.target.closest('.dish-link,#dish-preview'))hidePreview();});
 document.addEventListener('scroll',()=>hidePreview(),{capture:true,passive:true});
 window.addEventListener('resize',()=>hidePreview());
 document.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&e.isPrimary){const link=document.elementFromPoint(e.clientX,e.clientY)?.closest('.dish-link');if(link)showPreview(link);}},{passive:true});
 initSocialFeeds(C.socials);
}
if(window.DINA_CATALOG)initShop(window.DINA_CATALOG);else window.addEventListener('DOMContentLoaded',()=>{if(window.DINA_CATALOG)initShop(window.DINA_CATALOG);},{once:true});
const video=document.querySelector('#hero-video');
if(video){
 const play=document.querySelector('#video-play'),sound=document.querySelector('#video-sound');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let userPaused=false;
 const autoAllowed=()=>!reduced.matches&&!navigator.connection?.saveData;
 function sync(){if(play){play.setAttribute('aria-label',video.paused?'Lire la vidéo':'Mettre la vidéo en pause');play.setAttribute('aria-pressed',String(!video.paused));play.classList.toggle('is-playing',!video.paused);}if(sound){sound.setAttribute('aria-pressed',String(!video.muted));sound.setAttribute('aria-label',video.muted?'Activer le son':'Couper le son');sound.classList.toggle('is-audible',!video.muted);}}
 play.hidden=false;sound.hidden=false;video.controls=false;
 play.addEventListener('click',()=>{if(video.paused){userPaused=false;video.play().catch(()=>announce('La lecture vidéo n’est pas disponible dans ce navigateur.'));}else {userPaused=true;video.pause();}sync();});
 sound.addEventListener('click',()=>{video.muted=!video.muted;if(!video.muted){userPaused=false;video.play().catch(()=>announce('Utilisez le bouton lecture pour démarrer la vidéo.'));}sync();});
 video.addEventListener('play',sync);video.addEventListener('pause',sync);video.addEventListener('volumechange',sync);
 video.addEventListener('error',()=>{announce('La vidéo est momentanément indisponible. La carte reste accessible.');});
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)video.pause();else if(autoAllowed()&&!userPaused)video.play().catch(()=>{});}},{threshold:.2});observer.observe(video);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
 reduced.addEventListener('change',()=>{if(reduced.matches)video.pause();});sync();
}
