(() => {
  'use strict';
  const jobs = Array.isArray(window.JOBS) ? window.JOBS : [];
  const list = document.getElementById('job-list');
  const search = document.getElementById('job-search');
  const chips = [...document.querySelectorAll('.filter-chip')];
  const count = document.getElementById('result-count');
  const empty = document.getElementById('empty-state');
  const reset = document.getElementById('reset');
  let category = 'All';
  const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safe = s => { try { const u = new URL(s); return u.protocol === 'https:' ? u.href : '#'; } catch { return '#'; } };
  function jobCard(j) {
    return `<article class="job-card" id="${e(j.id)}">
      <div class="job-card-top"><div class="company-mark" aria-hidden="true">${e(j.initials)}</div><div class="company-info"><p class="company-name">${e(j.company)}</p><p class="source-name">${e(j.source)}</p></div><span class="job-kind">${e(j.category === 'Technology' ? 'Tech' : 'Business')}</span></div>
      <h3>${e(j.role)}</h3>
      <div class="job-tags"><span>${e(j.location)}</span><span>${e(j.experience)}</span></div>
      <p class="job-description">${e(j.note)}</p>
      <p class="location-footnote">${e(j.wtc)}</p>
      ${j.caution ? `<p class="caution">${e(j.caution)}</p>` : ''}
      <a class="job-link" href="${e(safe(j.url))}" target="_blank" rel="noopener noreferrer">View LinkedIn listing <span aria-hidden="true">↗</span></a>
      ${j.careers ? `<a class="careers-link" href="${e(safe(j.careers))}" target="_blank" rel="noopener noreferrer">Browse company careers <span aria-hidden="true">↗</span></a>` : ''}
    </article>`;
  }
  function render() {
    const terms = search.value.trim().toLocaleLowerCase('en-IN').split(/\s+/).filter(Boolean);
    const filtered = jobs.filter(j => {
      const text = [j.company, j.role, j.category, j.location, j.experience, j.audience, j.note, j.wtc, j.highlight].join(' ').toLocaleLowerCase('en-IN');
      const matchesCategory = category === 'All' || (category === 'Entry level' ? j.audience === 'Entry level' : j.category === category);
      return matchesCategory && terms.every(term => text.includes(term));
    });
    list.innerHTML = filtered.map(jobCard).join('');
    count.textContent = `Showing ${filtered.length} of ${jobs.length} job links`;
    empty.hidden = filtered.length > 0;
    reset.hidden = category === 'All' && terms.length === 0;
  }
  chips.forEach(chip => chip.addEventListener('click', () => {
    category = chip.dataset.category;
    chips.forEach(c => { const selected = c === chip; c.classList.toggle('active', selected); c.setAttribute('aria-pressed', selected ? 'true' : 'false'); });
    render();
  }));
  search.addEventListener('input', render);
  function resetAll() {
    search.value = '';
    chips[0].click();
    search.focus();
  }
  reset.addEventListener('click', resetAll);
  document.getElementById('reset-empty').addEventListener('click', resetAll);
  render();

  // Do not present a past recruitment drive as currently scheduled.
  // Compare YYYY-MM-DD safely by constructing values from Intl parts, regardless of device locale.
  const parts = new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const byType = Object.fromEntries(parts.map(p=>[p.type,p.value]));
  const today = `${byType.year}-${byType.month}-${byType.day}`;
  if (today > '2026-11-11') {
    document.getElementById('drive-title').textContent = 'Rocketlane hiring drive.';
    document.getElementById('drive-status').textContent = 'PAST EVENT DATE';
    document.getElementById('drive-status').classList.add('past');
    document.getElementById('event-note').textContent = 'The scheduled 11 Nov 2026 recruitment date has passed. This archived listing is for reference; check with Rocketlane before attempting to register.';
    const apply = document.getElementById('rocketlane-apply');
    apply.textContent = 'Check original form ↗';
  }
})();
