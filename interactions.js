function initializeInteractions() {
  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.portrait-stage');
  const card = document.querySelector('.portrait-card');
  if (!hero || !stage || !card) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  const inks = ['lavender', 'graphite', 'violet'];
  const swatches = [...document.querySelectorAll('.ink-swatch')];
  const inkLabel = document.querySelector('.ink-label');
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let ink = 0, x = 0, y = 0, drag = null, dragged = false;
  let frame = 0, angleX = 0, angleY = 0, targetX = 0, targetY = 0;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  function setInk(index) {
    ink = index;
    stage.dataset.ink = inks[index];
    stage.style.setProperty('--rest-angle', [-3, 2, -1][index] + 'deg');
    swatches.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    inkLabel.textContent = inks[index][0].toUpperCase() + inks[index].slice(1) + ' / 0' + (index + 1);
  }
  function boundPosition() {
    const limitX = Math.max(8, (stage.clientWidth - card.offsetWidth) / 2 - 10);
    const limitY = Math.min(70, stage.clientHeight * .16);
    x = clamp(x, -limitX, limitX);
    y = clamp(y, -limitY, limitY);
  }
  function place() {
    stage.style.setProperty('--portrait-x', x + 'px');
    stage.style.setProperty('--portrait-y', y + 'px');
  }
  function animate() {
    frame = 0;
    if (reduced.matches) return;
    angleX += (targetX - angleX) * .12;
    angleY += (targetY - angleY) * .12;
    stage.style.setProperty('--rotate-x', angleX + 'deg');
    stage.style.setProperty('--rotate-y', angleY + 'deg');
    stage.style.setProperty('--image-x', angleY * -.55 + 'px');
    stage.style.setProperty('--image-y', angleX * .5 + 'px');
    if (Math.abs(targetX - angleX) + Math.abs(targetY - angleY) > .02) frame = requestAnimationFrame(animate);
  }
  function startAnimation() { if (!frame && !reduced.matches) frame = requestAnimationFrame(animate); }
  function rest() { targetX = targetY = 0; stage.classList.remove('is-active'); startAnimation(); }
  hero.addEventListener('pointermove', event => {
    if (!fine.matches || reduced.matches || drag) return;
    const r = stage.getBoundingClientRect();
    const px = clamp((event.clientX - r.left) / r.width, 0, 1);
    const py = clamp((event.clientY - r.top) / r.height, 0, 1);
    targetY = (px - .5) * 24; targetX = (py - .5) * -18;
    stage.style.setProperty('--light-x', px * 100 + '%');
    stage.style.setProperty('--light-y', py * 100 + '%');
    stage.classList.add('is-active'); startAnimation();
  });
  hero.addEventListener('pointerleave', rest);
  card.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    card.focus({ preventScroll: true });
    dragged = false;
    drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x, y };
    card.setPointerCapture(event.pointerId);
  });
  card.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 5) dragged = true;
    x = drag.x + dx; y = drag.y + dy; boundPosition(); place();
    if (!reduced.matches) { targetY = clamp(dx * .15,-14,14); targetX = clamp(-dy * .12,-10,10); startAnimation(); }
  });
  function release(event) {
    if (!drag || drag.id !== event.pointerId) return;
    drag = null;
    if (card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId);
    rest();
  }
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', event => { dragged = true; release(event); });
  card.addEventListener('lostpointercapture', () => { drag = null; });
  card.addEventListener('click', () => { if (!dragged) setInk((ink + 1) % inks.length); dragged = false; });
  swatches.forEach((button, i) => button.addEventListener('click', () => setInk(i)));
  function reset() { x = y = 0; drag = null; place(); setInk(0); rest(); }
  document.querySelector('.portrait-reset').addEventListener('click', reset);
  card.addEventListener('keydown', event => {
    const directions = { ArrowLeft: [-16,0], ArrowRight: [16,0], ArrowUp: [0,-16], ArrowDown: [0,16] };
    if (directions[event.key]) {
      event.preventDefault(); const [dx,dy] = directions[event.key];
      x += dx; y += dy; boundPosition(); place();
    } else if (event.key === 'Home' || event.key === 'Escape') { event.preventDefault(); reset(); }
    if (event.key === 'Enter' || event.key === ' ') dragged = false;
  });
  document.querySelectorAll('.portfolio-media').forEach(media => {
    let pending = 0, px = 0, py = 0;
    media.addEventListener('pointermove', event => {
      if (!fine.matches || reduced.matches) return;
      const r = media.getBoundingClientRect();
      px = clamp((event.clientX-r.left)/r.width-.5,-.5,.5);
      py = clamp((event.clientY-r.top)/r.height-.5,-.5,.5);
      if (!pending) pending = requestAnimationFrame(() => {
        pending = 0;
        media.style.setProperty('--peek-x', px * -16 + 'px');
        media.style.setProperty('--peek-y', py * -16 + 'px');
        media.style.setProperty('--label-x', px * 12 + 'px');
        media.style.setProperty('--label-y', py * 12 + 'px');
      });
    });
    media.addEventListener('pointerleave', () => {
      if (pending) { cancelAnimationFrame(pending); pending = 0; }
      ['--peek-x','--peek-y','--label-x','--label-y'].forEach(key => media.style.setProperty(key,'0px'));
    });
  });
  function updateProgress() {
    const length = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${length > 0 ? clamp(scrollY/length,0,1) : 0})`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', () => { boundPosition(); place(); updateProgress(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; } });
  reduced.addEventListener('change', () => {
    if (frame) { cancelAnimationFrame(frame); frame = 0; }
    angleX = angleY = targetX = targetY = 0;
    ['--rotate-x','--rotate-y'].forEach(key => stage.style.setProperty(key,'0deg'));
    ['--image-x','--image-y'].forEach(key => stage.style.setProperty(key,'0px'));
    stage.classList.remove('is-active');
  });
  setInk(0); updateProgress();
}
if (document.readyState !== "complete") {
  document.addEventListener("DOMContentLoaded", initializeInteractions, { once: true });
} else {
  initializeInteractions();
}
