const toggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#navigation');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (toggle && navigation) {
  toggle.hidden = false;
  const close = () => { toggle.setAttribute('aria-expanded','false'); navigation.classList.remove('open'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded',String(open)); navigation.classList.toggle('open',open);
    if (open && window.gsap && !reduced.matches) window.gsap.fromTo(navigation.querySelectorAll('a'),{opacity:0,y:12},{opacity:1,y:0,duration:.4,stagger:.05,ease:'power2.out',clearProps:'all'});
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
if(window.gsap&&window.ScrollTrigger&&!document.body.classList.contains('card-page')){
  const gsap=window.gsap;gsap.registerPlugin(window.ScrollTrigger);
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
    gsap.from('.hero h1 > span',{y:24,opacity:0,duration:.85,stagger:.1,ease:'power3.out',clearProps:'all'});
    document.querySelectorAll('.reveal').forEach(el=>gsap.from(el,{y:25,opacity:.25,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'all'}));
    document.querySelectorAll('.specialty .image-shell,.house-photo,.sharing-photo').forEach(el=>gsap.fromTo(el,{scale:.96},{scale:1,ease:'none',scrollTrigger:{trigger:el,start:'top 95%',end:'top 40%',scrub:.6}}));
    const statement=document.querySelector('.house-statement');
    if(statement){
      const words=statement.textContent.split(' ');statement.replaceChildren(...words.flatMap((word,i)=>{const span=document.createElement('span');span.textContent=word;return i?[document.createTextNode(' '),span]:[span];}));
      gsap.fromTo(statement.children,{opacity:.3},{opacity:1,stagger:.12,ease:'none',scrollTrigger:{trigger:statement,start:'top 90%',end:'top 55%',scrub:.5}});
    }
  });
}
