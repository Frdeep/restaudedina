const toggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#navigation');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (toggle && navigation) {
  toggle.hidden = false;
  const close = () => { toggle.setAttribute('aria-expanded','false'); navigation.classList.remove('open'); };
  toggle.addEventListener('click', (event) => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded',String(open)); navigation.classList.toggle('open',open);
    if (open && event.detail>0 && window.gsap && !reduced.matches) window.gsap.fromTo(navigation.querySelectorAll('a'),{opacity:0,y:12},{opacity:1,y:0,duration:.18,stagger:.035,ease:'power2.out',clearProps:'all'});
  });
  navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus();}});
  window.matchMedia('(min-width: 761px)').addEventListener('change',close);
  document.addEventListener('click',e=>{if(!e.target.closest('.header'))close();});
}
const filters=document.querySelector('.filters');
function selectCategory(id){
  if(!filters)return;
  filters.querySelectorAll('button').forEach(b=>{const active=b.dataset.filter===id;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  document.querySelectorAll('[data-category]').forEach(section=>{section.hidden=id!=='all'&&section.dataset.category!==id;});
  if(window.ScrollTrigger)window.ScrollTrigger.refresh();
}
if(filters){
  filters.hidden=false;
  filters.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b)selectCategory(b.dataset.filter);});
  document.querySelectorAll('[data-menu-jump]').forEach(a=>a.addEventListener('click',()=>selectCategory(a.dataset.menuJump)));
  document.querySelectorAll('a[href="#carte"]:not([data-menu-jump])').forEach(a=>a.addEventListener('click',()=>selectCategory('all')));
}
const print=document.querySelector('#print-card');
if(print){print.hidden=false;print.addEventListener('click',()=>window.print());}
if(window.gsap&&window.ScrollTrigger&&document.querySelector('.hero-feature')){
  const gsap=window.gsap;gsap.registerPlugin(window.ScrollTrigger);
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
    const intro=gsap.timeline({defaults:{ease:'power3.out',duration:.6}});
    intro.from('.hero h1 > span',{y:22,opacity:.35,stagger:.06,clearProps:'all'})
      .from('.hero-tagline',{y:10,opacity:.3,clearProps:'all'},.15)
      .from('.hero-film',{y:18,scale:.97,opacity:.4,clearProps:'all'},.12);
    gsap.fromTo('.hero-photo',{scale:.98},{scale:1,ease:'none',scrollTrigger:{trigger:'.hero-photo',start:'top 95%',end:'top 55%',scrub:.5},clearProps:'transform'});
  });
}

// Native anchor fallback remains available without JavaScript. On-page navigation
// scrolls and moves keyboard focus without appending a fragment to the public URL.
document.addEventListener('click',event=>{
 const link=event.target.closest('a[href^="#"]');
 if(!link||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
 const id=link.getAttribute('href').slice(1),target=document.getElementById(id);if(!target)return;
 event.preventDefault();target.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
 const focusTarget=target.matches('main')?target:target.querySelector('h2,h1')||target;
 if(!focusTarget.hasAttribute('tabindex')){focusTarget.tabIndex=-1;focusTarget.addEventListener('blur',()=>focusTarget.removeAttribute('tabindex'),{once:true});}
 focusTarget.focus({preventScroll:true});
 if(location.hash)history.replaceState(history.state,'',location.pathname+location.search);
});
