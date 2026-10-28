import { moodieJourney } from './journey-data.js';

let instanceCount = 0;
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

/** Reusable, dependency-free journey map. Pass another four-phase dataset to reuse. */
export class JourneyMap {
  constructor(root, phases) {
    this.root = root;
    this.phases = phases;
    this.selected = null;
    this.prefix = `journey-${++instanceCount}`;
    this.render();
    this.bind();
  }

  render() {
    const p = this.prefix;
    const phases = this.phases;
    const field = (label, text, extra = '') => `<div class="jm-field ${extra}"><h5>${label}</h5><p>${escape(text)}</p></div>`;
    // Equally spaced phase positions align with card centers, even on mobile.
    const positions = phases.map((phase, i) => ({ x: 125 + i * 250, y: phase.y }));
    const line = positions.reduce((path, point, i) => {
      if (!i) return `M ${point.x} ${point.y}`;
      const previous = positions[i - 1];
      const middle = (previous.x + point.x) / 2;
      return `${path} C ${middle} ${previous.y}, ${middle} ${point.y}, ${point.x} ${point.y}`;
    }, '');

    this.root.innerHTML = `
      <div class="jm-toolbar">
        <p><span class="jm-tiny-arrow" aria-hidden="true">↗</span> Explore each stage</p>
        <span>Click a card or a point on the curve</span>
      </div>
      <div class="jm-scroll" role="region" aria-label="Journey timeline and emotion curve" tabindex="0">
        <div class="jm-track">
          <div class="jm-phases" role="group" aria-label="Choose a journey phase">
            ${phases.map((phase, i) => `
              <button type="button" class="jm-card" data-phase="${i}" id="${p}-card-${i}"
                aria-expanded="false" aria-controls="${p}-panel-${i}">
                <span class="jm-card-top"><span class="jm-number">PHASE 0${i + 1}</span><span class="jm-open" aria-hidden="true">↗</span></span>
                <span class="jm-card-title">${escape(phase.title)}</span>
                <span class="jm-summary">${escape(phase.summary)}</span>
                <span class="jm-emotion"><span aria-hidden="true" style="--jm-dot:${phase.accent}"></span>${escape(phase.emotion)}</span>
                <span class="jm-pain"><span>Friction</span>${escape(phase.painSummary)}</span>
                <span class="jm-card-footer">Explore phase <span aria-hidden="true">+</span></span>
              </button>`).join('')}
          </div>
          <div class="jm-curve" role="group" aria-label="Illustrative emotional journey; four selectable phases">
            <span class="jm-curve-label">Emotional experience <span aria-hidden="true">↘</span></span>
            <svg class="jm-svg" viewBox="0 0 1000 220" aria-hidden="true" focusable="false">
              <defs><linearGradient id="${p}-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#bda8e1" stop-opacity=".40"/><stop offset="100%" stop-color="#e9e1f5" stop-opacity=".10"/></linearGradient></defs>
              ${positions.map(point => `<path class="jm-guide" d="M ${point.x} 42 V 200"/>`).join('')}
              <path d="${line} L 875 200 L 125 200 Z" fill="url(#${p}-fill)"/>
              <path class="jm-line" d="${line}"/>
            </svg>
            ${phases.map((phase, i) => `
              <button type="button" class="jm-node" data-phase="${i}" style="--jm-x:${positions[i].x / 10}%;--jm-y:${positions[i].y / 2.2}%;--jm-dot:${phase.accent}"
                aria-label="Phase 0${i + 1}: ${escape(phase.title)}. ${escape(phase.emotion)} Show details."
                aria-expanded="false" aria-controls="${p}-panel-${i}" aria-describedby="${p}-tooltip-${i}">
                <span class="jm-node-ring"><span></span></span><span class="jm-node-number" aria-hidden="true">0${i + 1}</span>
                <span class="jm-tooltip" id="${p}-tooltip-${i}" role="tooltip">${escape(phase.emotion)}</span>
              </button>`).join('')}
          </div>
        </div>
      </div>
      <div class="jm-legend"><p>Illustrative curve · Qualitative emotional narrative, not measured scores.</p><span class="jm-mobile-hint">Swipe to explore all four phases →</span></div>
      <div class="jm-expand" id="${p}-details">
        <div class="jm-panel-stack">
          ${phases.map((phase, i) => `
            <section class="jm-panel" id="${p}-panel-${i}" aria-labelledby="${p}-heading-${i}" aria-hidden="true" inert>
              <div class="jm-panel-heading"><div><span class="jm-number">A CLOSER LOOK / 0${i + 1}</span><h4 id="${p}-heading-${i}">${escape(phase.title)}</h4></div><button class="jm-close" type="button" aria-label="Close phase details">Close <span aria-hidden="true">×</span></button></div>
              <div class="jm-detail-columns"><div class="jm-experience">
                ${field('User goal', phase.goal)}${field('User action', phase.action)}${field('Emotional experience', phase.emotion, 'jm-feeling-field')}
              </div><div class="jm-decisions">
                ${field('01 / Pain point', phase.pain, 'jm-pain-field')}
                <div class="jm-link-arrow" aria-hidden="true">↓</div>
                ${field('02 / Design opportunity', phase.opportunity, 'jm-opportunity-field')}
                <div class="jm-link-arrow" aria-hidden="true">↓</div>
                ${field('03 / Proposed design direction', phase.direction, 'jm-direction-field')}
                <p class="jm-proposal-note">Proposal for exploration · Not tested or validated.</p>
              </div></div>
            </section>`).join('')}
        </div>
      </div>
      <p class="jm-status" role="status" aria-live="polite" aria-atomic="true"></p>
      <p class="jm-source">Journey scenario: Lily & Mia · Original journey map, p. 2; narrative and proposed directions supplied by Sofie.</p>`;
    this.controls = [...this.root.querySelectorAll('[data-phase]')];
    this.panels = [...this.root.querySelectorAll('.jm-panel')];
    this.expander = this.root.querySelector('.jm-expand');
  }

  bind() {
    this.controls.forEach(control => {
      const index = Number(control.dataset.phase);
      control.addEventListener('click', () => this.select(index));
      control.addEventListener('pointerenter', () => this.highlight(index));
      control.addEventListener('pointerleave', () => this.highlight(null));
      control.addEventListener('focus', () => this.highlight(index));
      control.addEventListener('blur', () => this.highlight(null));
      control.addEventListener('keydown', event => {
        const direction = { ArrowRight: 1, ArrowLeft: -1, Home: 'first', End: 'last' }[event.key];
        if (direction === undefined) return;
        event.preventDefault();
        const next = direction === 'first' ? 0 : direction === 'last' ? this.phases.length - 1 : (index + direction + this.phases.length) % this.phases.length;
        const selector = control.classList.contains('jm-card') ? '.jm-card' : '.jm-node';
        this.root.querySelector(`${selector}[data-phase="${next}"]`).focus();
      });
    });
    this.root.querySelectorAll('.jm-close').forEach(button => button.addEventListener('click', () => this.close()));
    this.root.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.selected !== null) {
        event.preventDefault();
        this.close();
      }
    });
  }

  highlight(index) {
    this.controls.forEach(control => control.classList.toggle('is-preview', Number(control.dataset.phase) === index));
  }

  select(index) {
    if (this.selected === index) { this.close(); return; }
    this.selected = index;
    this.controls.forEach(control => {
      const active = Number(control.dataset.phase) === index;
      control.classList.toggle('is-selected', active);
      control.setAttribute('aria-expanded', String(active));
      if (control.classList.contains('jm-card')) {
        control.querySelector('.jm-card-footer').innerHTML = active ? 'Phase selected <span aria-hidden="true">−</span>' : 'Explore phase <span aria-hidden="true">+</span>';
      }
    });
    this.panels.forEach((panel, i) => {
      const active = i === index;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
      panel.inert = !active;
    });
    this.expander.classList.add('is-open');
    this.root.querySelector('.jm-status').textContent = `Phase 0${index + 1}: ${this.phases[index].title}. Details expanded below the curve. Proposed directions are not validated.`;
  }

  close() {
    const previous = this.selected;
    this.selected = null;
    this.expander.classList.remove('is-open');
    this.controls.forEach(control => {
      control.classList.remove('is-selected');
      control.setAttribute('aria-expanded', 'false');
      if (control.classList.contains('jm-card')) control.querySelector('.jm-card-footer').innerHTML = 'Explore phase <span aria-hidden="true">+</span>';
    });
    this.panels.forEach(panel => {
      panel.classList.remove('is-active');
      panel.setAttribute('aria-hidden', 'true');
      panel.inert = true;
    });
    if (previous !== null) this.root.querySelector(`.jm-card[data-phase="${previous}"]`).focus({ preventScroll: true });
    this.root.querySelector('.jm-status').textContent = 'Phase details closed. Choose another stage to explore.';
  }
}

document.querySelectorAll('[data-journey-map]').forEach(root => new JourneyMap(root, moodieJourney));
