(function(){
  const header  = document.querySelector('.site-header');
  if(!header) return;
  const buttons = header.querySelectorAll('.has-sub .menu-btn');
  const subnav  = header.querySelector('.subnav');
  const inner   = subnav.querySelector('.subnav-inner');
  const panels  = inner.querySelectorAll('.panel');
  let openBtn   = null;
  function show(panelId, btn){
    panels.forEach(p=>p.setAttribute('aria-hidden',p.dataset.panel!==panelId?'true':'false'));
    const b=btn.getBoundingClientRect(),h=header.getBoundingClientRect();
    subnav.style.setProperty('--arrow-left',`${b.left-h.left+b.width/2-9}px`);
    subnav.classList.add('show');openBtn=btn;
    buttons.forEach(bn=>bn.setAttribute('aria-expanded',bn===btn?'true':'false'));
  }
  function hide(){subnav.classList.remove('show');panels.forEach(p=>p.setAttribute('aria-hidden','true'));buttons.forEach(bn=>bn.setAttribute('aria-expanded','false'));openBtn=null;}
  buttons.forEach(btn=>{
    btn.addEventListener('mouseenter',()=>show(btn.parentElement.dataset.panel,btn));
    btn.addEventListener('focus',()=>show(btn.parentElement.dataset.panel,btn));
    btn.addEventListener('click',()=>openBtn===btn?hide():show(btn.parentElement.dataset.panel,btn));
  });
  header.addEventListener('mouseleave',hide);
  header.addEventListener('focusout',e=>{if(!header.contains(e.relatedTarget))hide();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});
})();