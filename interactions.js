(() => {
  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.playground');
  const friend = document.querySelector('.felt-friend');
  const reset = document.querySelector('.reset-play');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const halo = document.createElement('div');
  halo.className = 'cursor-halo';
  halo.setAttribute('aria-hidden', 'true');
  document.body.append(halo);
  let x = 0, y = 0, drag = null, moved = false, tick = false, latest = null;
  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function bounds() {
    const maxX = Math.max(0, (stage.clientWidth - friend.offsetWidth) / 2 - 12);
    const maxY = Math.min(90, stage.clientHeight * 0.24);
    x = clamp(x, -maxX, maxX); y = clamp(y, -maxY, maxY);
  }
  function place() {
    friend.style.setProperty('--drag-x', x + 'px');
    friend.style.setProperty('--drag-y', y + 'px');
  }
  function resetFriend() {
    x = y = 0; drag = null; place();
    stage.style.setProperty('--tilt-x', '0deg');
    stage.style.setProperty('--tilt-y', '0deg');
  }
  function celebrate() {
    if (reduced.matches) { friend.style.setProperty('--turn', friend.style.getPropertyValue('--turn') === '9deg' ? '-9deg' : '9deg'); return; }
    friend.classList.remove('is-spinning');
    void friend.offsetWidth;
    friend.classList.add('is-spinning');
    for (let i = 0; i < 6; i++) {
      const mark = document.createElement('span');
      mark.className = 'play-burst'; mark.setAttribute('aria-hidden', 'true');
      mark.textContent = i % 2 ? '✧' : '✳';
      const angle = i * Math.PI / 3;
      mark.style.setProperty('--burst-x', Math.cos(angle) * 155 + 'px');
      mark.style.setProperty('--burst-y', Math.sin(angle) * 140 + 'px');
      stage.append(mark); setTimeout(() => mark.remove(), 800);
    }
  }
  friend.addEventListener('animationend', () => friend.classList.remove('is-spinning'));
  friend.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    friend.focus({ preventScroll: true });
    drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x, y };
    moved = false; friend.setPointerCapture(event.pointerId);
  });
  friend.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 5) moved = true;
    x = drag.x + dx; y = drag.y + dy; bounds(); place();
  });
  function endDrag(event) {
    if (!drag || drag.id !== event.pointerId) return;
    drag = null;
    if (friend.hasPointerCapture(event.pointerId)) friend.releasePointerCapture(event.pointerId);
  }
  friend.addEventListener('pointerup', endDrag);
  friend.addEventListener('pointercancel', event => { moved = true; endDrag(event); });
  friend.addEventListener('lostpointercapture', () => { drag = null; });
  friend.addEventListener('click', () => { if (!moved) celebrate(); moved = false; });
  friend.addEventListener('keydown', event => {
    const directions = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] };
    if (directions[event.key]) {
      event.preventDefault(); const [dx, dy] = directions[event.key];
      x += dx; y += dy; bounds(); place();
    } else if (event.key === 'Escape' || event.key === 'Home') { event.preventDefault(); resetFriend(); }
    if (event.key === 'Enter' || event.key === ' ') moved = false;
  });
  reset.addEventListener('click', resetFriend);
  function updatePointer() {
    tick = false;
    if (!latest || !finePointer.matches || reduced.matches || drag) return;
    const rect = stage.getBoundingClientRect();
    const dx = clamp((latest.x - rect.left - rect.width / 2) / rect.width, -1, 1);
    const dy = clamp((latest.y - rect.top - rect.height / 2) / rect.height, -1, 1);
    stage.style.setProperty('--tilt-x', -dy * 14 + 'deg');
    stage.style.setProperty('--tilt-y', dx * 18 + 'deg');
    stage.querySelector('.spark-one').style.transform = `translate(${dx * -14}px,${dy * -14}px) rotate(-12deg)`;
    stage.querySelector('.spark-two').style.transform = `translate(${dx * 18}px,${dy * 18}px)`;
    halo.style.transform = `translate(${latest.x - 12}px,${latest.y - 12}px)`;
  }
  hero.addEventListener('pointermove', event => {
    latest = { x: event.clientX, y: event.clientY };
    if (!tick) { tick = true; requestAnimationFrame(updatePointer); }
  });
  hero.addEventListener('pointerenter', () => { if (finePointer.matches && !reduced.matches) halo.classList.add('visible'); });
  hero.addEventListener('pointerleave', () => { halo.classList.remove('visible'); stage.style.setProperty('--tilt-x', '0deg'); stage.style.setProperty('--tilt-y', '0deg'); });
  function updateProgress() {
    const length = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${length > 0 ? clamp(scrollY / length, 0, 1) : 0})`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', () => { bounds(); place(); updateProgress(); });
  reduced.addEventListener('change', () => { resetFriend(); halo.classList.remove('visible'); });
  updateProgress();
})();
