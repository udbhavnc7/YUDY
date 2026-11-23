import { ACHIEVEMENTS } from '../data/achievements';
import { EDUCATION } from '../data/education';
import { HOBBIES } from '../data/hobbies';
import { PROFILE } from '../data/profile';
import { GROUP_PROJECTS, SOLO_PROJECTS, type Project } from '../data/projects';

const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (value: string) => value.replace(/[&<>"']/g, character => entities[character]);

function link(url: string, text: string, context?: string) {
  return `<a href="${escape(url)}"${context ? ` aria-label="${escape(text + ' for ' + context)}"` : ''}>${escape(text)}</a>`;
}

function projects(items: Project[]) {
  return `<ul class="entries">${items.map(project => `<li>
    <h4>${escape(project.title)}</h4>
    <p>${escape(project.description)}</p>
    <p class="meta">${escape(project.technologies.join(' · '))}</p>
    <div class="links">${link(project.github, 'GitHub', project.title)}
      ${project.live ? link(project.live, 'Live site', project.title) : '<span class="meta">Public deployment unavailable</span>'}
    </div>
  </li>`).join('')}</ul>`;
}

export function renderWork(styles: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(PROFILE.name)}’s projects, achievements, education and interests.">
  <meta name="theme-color" content="#f6f0e5">
  <title>${escape(PROFILE.name)} · Portfolio</title>
  <style>${styles}</style>
</head>
<body>
  <a class="skip" href="#work">Skip to projects</a>
  <header class="page-header">
    <div class="identity">
      <h1>${escape(PROFILE.name)}</h1>
      <p>${escape(PROFILE.title)} · ${escape(PROFILE.education.degree)}</p>
    </div>
    <div class="links contacts">
      ${link(PROFILE.github, 'GitHub')} ${link(PROFILE.linkedin, 'LinkedIn')} ${link('mailto:' + PROFILE.email, 'Email')}
      <a href="/">Visit the 3D room</a>
    </div>
  </header>
  <main id="work" tabindex="-1">
    <section aria-labelledby="project-heading">
      <h2 id="project-heading">Projects</h2>
      <h3>Solo projects</h3>
      ${projects(SOLO_PROJECTS)}
      <h3>VAPORLOGIC team projects</h3>
      ${projects(GROUP_PROJECTS)}
    </section>
    <section aria-labelledby="achievements-heading">
      <h2 id="achievements-heading">Achievements</h2>
      <ul class="entries">${ACHIEVEMENTS.map(item => `<li>
        <h3>${escape(item.event)}</h3><p class="meta">${escape(item.title)}${item.year ? ' · ' + item.year : ''}</p>
        ${item.description ? `<p>${escape(item.description)}</p>` : ''}
        ${item.link ? link(item.link, 'View project on GitHub', item.event) : ''}
      </li>`).join('')}</ul>
    </section>
    <section aria-labelledby="education-heading">
      <h2 id="education-heading">Education</h2>
      <ul class="entries">${EDUCATION.map(item => `<li>
        <h3>${escape(item.institution)}</h3><p class="meta">${escape(item.label)} · ${escape(item.period)}</p>
        ${item.details ? `<p>${escape(item.details)}</p>` : ''}
      </li>`).join('')}</ul>
    </section>
    <section aria-labelledby="hobbies-heading">
      <h2 id="hobbies-heading">Hobbies</h2>
      <ul class="entries">${HOBBIES.map(item => `<li><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p></li>`).join('')}</ul>
    </section>
  </main>
</body>
</html>`;
}
