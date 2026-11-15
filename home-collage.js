function initializeLineHome() {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  document.querySelectorAll('.doodle-link').forEach(link=>{
    let frame=0,x=0,y=0;
    link.addEventListener('pointermove',event=>{
      if(!fine.matches||reduced.matches)return;
      const r=link.getBoundingClientRect();x=clamp((event.clientX-r.left)/r.width-.5,-.5,.5)*5;y=clamp((event.clientY-r.top)/r.height-.5,-.5,.5)*5;
      if(!frame)frame=requestAnimationFrame(()=>{frame=0;link.style.setProperty('--mx',x+'px');link.style.setProperty('--my',y+'px');});
    });
    link.addEventListener('pointerleave',()=>{if(frame){cancelAnimationFrame(frame);frame=0;}link.style.setProperty('--mx','0px');link.style.setProperty('--my','0px');});
  });
  // Preserve the existing work-gallery hover behavior independently of the hero.
  document.querySelectorAll('.portfolio-media').forEach(media=>{
    let pending=0,px=0,py=0;
    media.addEventListener('pointermove',event=>{
      if(!fine.matches||reduced.matches)return;
      const r=media.getBoundingClientRect();px=clamp((event.clientX-r.left)/r.width-.5,-.5,.5);py=clamp((event.clientY-r.top)/r.height-.5,-.5,.5);
      if(!pending)pending=requestAnimationFrame(()=>{pending=0;media.style.setProperty('--peek-x',px*-16+'px');media.style.setProperty('--peek-y',py*-16+'px');media.style.setProperty('--label-x',px*12+'px');media.style.setProperty('--label-y',py*12+'px');});
    });
    media.addEventListener('pointerleave',()=>{if(pending){cancelAnimationFrame(pending);pending=0;}['--peek-x','--peek-y','--label-x','--label-y'].forEach(key=>media.style.setProperty(key,'0px'));});
  });
  const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  function updateProgress(){const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?clamp(scrollY/total,0,1):0})`;}
  addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
}
if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',initializeLineHome,{once:true});else initializeLineHome();
