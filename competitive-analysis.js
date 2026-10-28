import { competitors, categories, dimensions, coverageStates, getComparison } from './comparison-data.js';
const escape = value => String(value).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
let instances = 0;
export class CompetitiveAnalysis {
  constructor(root) {
    this.root = root;
    this.prefix = `comparison-${++instances}`;
    this.activeCategory = 'All';
    this.selected = null;
    this.render();
    this.bind();
  }
  render() {
    const p = this.prefix;
    this.root.innerHTML = `
      <div class="ca-overview">${competitors.map((c, i) => `<article class="ca-competitor">
        <div class="ca-card-header"><span class="ca-kicker">0${i+1} / ${escape(c.positioning)}</span><h4>${escape(c.name)}</h4></div>
        <div class="ca-screen"><img src="${c.image}" width="1200" height="624" alt="${escape(c.name)} website screenshot reproduced from the original project comparison" loading="lazy"></div>
        <dl><div><dt>Primary strength</dt><dd>${escape(c.strength)}</dd></div><div><dt>Key limitation in the review</dt><dd>${escape(c.limitation)}</dd></div></dl>
      </article>`).join('')}</div>
      <div class="ca-matrix-heading"><div><span class="ca-kicker">A closer look</span><h4>Compare the dimensions<br>that shape the experience.</h4></div><p>Explore a cell to see the evidence and the design implication.</p></div>
      <div class="ca-filters" role="group" aria-label="Filter comparison categories">${categories.map((category,i) => `<button type="button" data-category="${category}" aria-pressed="${i===0}" aria-controls="${p}-table">${category}</button>`).join('')}</div>
      <div class="ca-legend" aria-label="Feature coverage legend">${Object.entries(coverageStates).map(([key,s])=>`<span><span class="ca-symbol ca-${key}" aria-hidden="true">${s.symbol}</span>${s.label}</span>`).join('')}</div>
      <p class="ca-research-note">Historical project review · Ratings reflect documented coverage, not usability scores. Unassessed dimensions remain “Not verified.”</p>
      <p class="ca-selection-summary">Select a cell to read the source behind the rating.</p>
      <div class="ca-table-scroll" role="region" aria-label="Scrollable competitor comparison" tabindex="0">
        <table class="ca-table" id="${p}-table"><caption class="ca-sr-only">Storytelling product coverage from the original Moodie Tales research. Select a cell for evidence.</caption><thead><tr><th scope="col">Comparison dimension</th>${competitors.map(c=>`<th scope="col" data-column="${c.id}">${c.name}</th>`).join('')}</tr></thead>
        ${categories.slice(1).map(category=>`<tbody data-group="${category}"><tr class="ca-category-row"><th colspan="4" scope="rowgroup">${category}</th></tr>${dimensions.filter(d=>d.category===category).map(d=>`<tr data-dimension="${d.id}"><th scope="row" id="${p}-row-${d.id}">${d.label}</th>${competitors.map(c=>{const item=getComparison(c,d);const state=coverageStates[item.state];return `<td data-column="${c.id}"><button type="button" class="ca-cell" data-competitor="${c.id}" data-dimension="${d.id}" aria-label="${c.name}, ${d.label}: ${state.label}. View evidence" aria-expanded="false" aria-controls="${p}-detail" aria-describedby="${p}-tip-${c.id}-${d.id}"><span class="ca-symbol ca-${item.state}" aria-hidden="true">${state.symbol}</span><span>${state.label}</span><span class="ca-cell-arrow" aria-hidden="true">↗</span><span class="ca-tooltip" id="${p}-tip-${c.id}-${d.id}" role="tooltip">${escape(d.description)}</span></button></td>`;}).join('')}</tr>`).join('')}</tbody>`).join('')}</table>
      </div>
      <p class="ca-mobile-hint">Swipe the comparison to explore all three products →</p>
      <div class="ca-detail-expander"><section class="ca-detail" id="${p}-detail" aria-labelledby="${p}-detail-title" hidden></section></div>
      <p class="ca-status ca-sr-only" role="status" aria-live="polite" aria-atomic="true"></p>
      <div class="ca-opportunity"><span class="ca-kicker">From comparison to direction</span><h4>The Opportunity We Identified</h4><p class="ca-opportunity-intro">Existing products support different aspects of storytelling and bedtime experiences. Our analysis revealed an opportunity to connect daily emotional experiences, personalized stories, and meaningful parent reflection.</p>
      <ol class="ca-flow"><li><span>01</span><h5>Daily Emotion</h5><p>Capture children’s everyday emotional experiences.</p></li><li><span>02</span><h5>Personalized Story</h5><p>Translate those experiences into meaningful bedtime narratives.</p></li><li><span>03</span><h5>Long-term Reflection</h5><p>Help parents understand emotional patterns and progress over time.</p></li></ol>
      <div class="ca-question"><span class="ca-kicker">The design question</span><p>How might we connect children’s everyday emotional experiences with personalized bedtime storytelling and meaningful parent insights?</p></div><p class="ca-opportunity-note">Identified design opportunity · Not a tested outcome or a claim that every competitor lacks these capabilities.</p></div>
      <p class="ca-source">Source: Moodie Tales, original competitive analysis, p. 3. <a href="portfolios/moodie-tales.pdf#page=3" target="_blank" rel="noopener">View original research ↗</a></p>`;
  }
  bind() {
    this.root.querySelectorAll('[data-category]').forEach(button => {
      button.addEventListener('click',()=>this.filter(button.dataset.category));
      button.addEventListener('keydown',event=>{
        const buttons=[...this.root.querySelectorAll('[data-category]')];const index=buttons.indexOf(button);
        const keys={ArrowRight:(index+1)%buttons.length,ArrowLeft:(index+buttons.length-1)%buttons.length,Home:0,End:buttons.length-1};
        if(keys[event.key]!==undefined){event.preventDefault();buttons[keys[event.key]].focus();}
      });
    });
    this.root.querySelectorAll('.ca-cell').forEach(button=>{
      const preview=()=>this.highlight(button.dataset.dimension,button.dataset.competitor);
      button.addEventListener('pointerenter',preview);button.addEventListener('focus',preview);
      button.addEventListener('pointerleave',()=>this.highlight(null,null));button.addEventListener('blur',()=>this.highlight(null,null));
      button.addEventListener('click',()=>this.select(button));
      button.addEventListener('keydown',event=>{
        const cells=[...this.root.querySelectorAll('tbody:not([hidden]) .ca-cell')];
        const index=cells.indexOf(button);
        const targets={ArrowRight:index+1,ArrowLeft:index-1,ArrowDown:index+3,ArrowUp:index-3,Home:index-index%3,End:index-index%3+2};
        if(targets[event.key]!==undefined){event.preventDefault();cells[Math.max(0,Math.min(cells.length-1,targets[event.key]))].focus();}
      });
    });
    this.root.addEventListener('keydown',event=>{if(event.key==='Escape'&&this.selected){event.preventDefault();this.close(true);}});
  }
  highlight(dimension,competitor) {
    const focused=document.activeElement;
    if(this.root.contains(focused)&&focused.classList.contains('ca-cell')&&focused.matches(':focus-visible')) {
      dimension=focused.dataset.dimension;competitor=focused.dataset.competitor;
    }
    this.root.querySelectorAll('tr[data-dimension]').forEach(row=>row.classList.toggle('is-preview',row.dataset.dimension===dimension));
    this.root.querySelectorAll('[data-column]').forEach(cell=>cell.classList.toggle('is-preview-column',cell.dataset.column===competitor));
  }
  filter(category) {
    this.activeCategory=category;
    this.root.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
    this.root.querySelectorAll('tbody[data-group]').forEach(group=>{group.hidden=category!=='All'&&group.dataset.group!==category;});
    if(this.selected&&category!=='All'&&dimensions.find(d=>d.id===this.selected.dataset.dimension).category!==category)this.close(false);
    this.highlight(null,null);
    const count=dimensions.filter(d=>category==='All'||d.category===category).length;
    this.root.querySelector('.ca-status').textContent=`${category}: ${count} comparison dimensions shown.`;
  }
  select(button) {
    const c=competitors.find(c=>c.id===button.dataset.competitor);
    const d=dimensions.find(d=>d.id===button.dataset.dimension);
    const item=getComparison(c,d);const state=coverageStates[item.state];
    this.selected=button;
    this.root.querySelector('.ca-selection-summary').innerHTML = `<span>${escape(c.name)} / ${escape(d.label)}</span><a href="#${this.prefix}-detail">View evidence below ↓</a>`;
    this.root.querySelectorAll('.ca-cell').forEach(cell=>{const active=cell===button;cell.classList.toggle('is-selected',active);cell.setAttribute('aria-expanded',String(active));});
    const panel=this.root.querySelector('.ca-detail');
    panel.innerHTML=`<div class="ca-detail-top"><div><span class="ca-kicker">${d.category} / ${c.name}</span><h4 id="${this.prefix}-detail-title">${d.label}</h4><span class="ca-detail-state"><span class="ca-symbol ca-${item.state}" aria-hidden="true">${state.symbol}</span>${state.label}</span></div><button type="button" class="ca-close" aria-label="Close comparison details">Close ×</button></div>
      <div class="ca-detail-grid"><div><h5>Documented approach</h5><p>${escape(item.approach)}</p><h5>Research evidence</h5><p class="ca-evidence">${escape(item.evidence)}</p><a class="ca-evidence-link" href="portfolios/moodie-tales.pdf#page=3" target="_blank" rel="noopener">Original comparison · p. 3 ↗</a></div><div><h5>Strength supported by the source</h5><p>${escape(item.strength)}</p><h5>Limitation or evidence boundary</h5><p>${escape(item.limitation)}</p><div class="ca-implication"><h5>UX implication / interpretation</h5><p>${escape(d.implication)}</p></div></div></div>`;
    panel.hidden=false;
    panel.classList.remove('is-entering');void panel.offsetWidth;panel.classList.add('is-entering');
    panel.querySelector('.ca-close').addEventListener('click',()=>this.close(true));
    this.root.querySelector('.ca-status').textContent=`${c.name}: ${d.label}. ${state.label}. Evidence details are open below the matrix.`;
  }
  close(returnFocus) {
    const previous=this.selected;this.selected=null;
    this.root.querySelector('.ca-selection-summary').textContent='Select a cell to read the source behind the rating.';
    this.root.querySelector('.ca-detail').hidden=true;
    this.root.querySelectorAll('.ca-cell').forEach(cell=>{cell.classList.remove('is-selected');cell.setAttribute('aria-expanded','false');});
    if(returnFocus&&previous&&!previous.closest('tbody').hidden)previous.focus({preventScroll:true});
    this.root.querySelector('.ca-status').textContent='Comparison details closed.';
  }
}
document.querySelectorAll('[data-competitive-analysis]').forEach(root=>new CompetitiveAnalysis(root));
