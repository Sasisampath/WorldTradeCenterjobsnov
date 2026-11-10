(() => {
  'use strict';
  const jobs = window.JOBS;
  const list = document.getElementById('job-list');
  const search = document.getElementById('job-search');
  const count = document.getElementById('result-count');
  const empty = document.getElementById('empty-state');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
    ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[char]);
  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const {year, month, day} = Object.fromEntries(dateParts.map(part => [part.type, part.value]));
  const today = `${year}-${month}-${day}`;

  function link(url, label, className) {
    const destination = new URL(url, document.baseURI);
    if (destination.protocol !== 'https:' && destination.origin !== location.origin) return '';
    return `<a class="${className}" href="${escape(destination.href)}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span></a>`;
  }

  function role(j, showLocation) {
    const past = j.eventDate && today > j.eventDate;
    const status = past ? 'Past drive · 11 Nov 2026' : j.eventLabel || j.caution;
    const label = past ? 'Check original form' : j.eventDate ? 'Check registration' : j.caution ? 'View listing' : j.actionLabel || 'Apply now';
    const experience = j.experience === 'Check job description' ? '' : j.experience;
    return `<section class="job-role" id="${escape(j.id)}">
      <h3>${escape(j.role)}</h3>
      ${showLocation ? `<p class="muted">${escape(j.location)}</p>` : ''}
      ${experience ? `<p class="muted">${escape(experience)}</p>` : ''}
      ${status ? `<p class="muted">${escape(status)}</p>` : ''}
      <div class="job-actions">
        <details>
          <summary>View details</summary>
          ${j.note ? `<p>${escape(j.note)}</p>` : ''}
          ${j.wtc ? `<p>${escape(j.wtc)}</p>` : ''}
          ${j.process ? `<p>${escape(j.process)}</p>${link('assets/rocketlane-drive.webp', 'View original poster', 'detail-link')}` : ''}
          ${j.careers ? link(j.careers, 'Browse company careers', 'detail-link') : ''}
        </details>
        ${link(j.url, label, 'job-link')}
      </div>
    </section>`;
  }

  function render() {
    const terms = search.value.trim().toLocaleLowerCase('en-IN').split(/\s+/).filter(Boolean);
    const companies = new Map();
    for (const job of jobs) {
      const text = `${job.company} ${job.role}`.toLocaleLowerCase('en-IN');
      if (!terms.every(term => text.includes(term))) continue;
      if (!companies.has(job.company)) companies.set(job.company, []);
      companies.get(job.company).push(job);
    }
    list.innerHTML = Array.from(companies, ([company, roles]) => {
      const sharedLocation = roles.every(job => job.location === roles[0].location);
      return `<article class="job-card">
      <div class="job-card-top">
        <h2>${escape(company)}</h2>
        ${sharedLocation ? `<span class="location">${escape(roles[0].location)}</span>` : ''}
      </div>
      ${roles.map(job => role(job, !sharedLocation)).join('')}
    </article>`;
    }).join('');
    count.textContent = `${companies.size} matching companies`;
    empty.hidden = companies.size > 0;
  }

  search.addEventListener('input', render);
  render();
})();
