// Basic section navigation only. No prototype interactions or scroll animation.
(() => {
  const nav = document.querySelector('.floating-nav');
  const links = [...nav.querySelectorAll('a')];
  const sections = [...document.querySelectorAll('[data-nav]')];
  let scheduled = false;
  let previousActive = null;
  function updateActive() {
    const line = Math.min(innerHeight * .35, 260);
    let active = sections[0].dataset.nav;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= line) active = section.dataset.nav;
    }
    // Include the reflection tab when the reader reaches the end on tall screens.
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 3) active = 'reflection';
    for (const link of links) {
      if (link.hash === '#' + active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    if (active !== previousActive) {
      const current = nav.querySelector('[aria-current]');
      nav.scrollLeft = current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2;
      previousActive = active;
    }
    scheduled = false;
  }
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateActive); }
  }, { passive: true });
  addEventListener('resize', updateActive);
  addEventListener('load', updateActive);
  updateActive();
})();
