// Single source of truth for published insights.
// `published` must be the real publication date (YYYY-MM-DD). Leave it empty until confirmed:
// an empty date is simply not shown, so the site never displays an invented date.
// Only list articles that have a live page here; drafts stay out of this list.
const INSIGHTS = [
  {
    slug: 'baseline-before-gantt',
    title: 'Why your project needs a baseline before it needs a Gantt chart',
    topic: 'Schedule control',
    summary: 'A frozen baseline turns a schedule from a picture of optimism into a reliable reference.',
    published: '',
  },
  {
    slug: 'reading-cpi-and-spi',
    title: 'Reading CPI and SPI: what the numbers are actually telling you',
    topic: 'Cost & Earned Value',
    summary: 'Two indices can reveal whether the real pressure is productivity, sequencing or scope.',
    published: '',
  },
  {
    slug: 'monte-carlo-schedules',
    title: 'Monte Carlo for schedules: turning a single date into a range',
    topic: 'Risk & forecasting',
    summary: 'Confidence ranges show how robust a completion date really is.',
    published: '',
  },
];

const findInsight = (slug) => INSIGHTS.find((item) => item.slug === slug);

const formatDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// Dates on cards and article headers.
document.querySelectorAll('[data-insight-date]').forEach((element) => {
  const insight = findInsight(element.dataset.insightDate);
  if (!insight || !insight.published) {
    element.remove();
    return;
  }
  element.setAttribute('datetime', insight.published);
  element.textContent = formatDate(insight.published);
});

// Topic filter on the insights index.
const filterBar = document.querySelector('[data-insight-filter]');
if (filterBar) {
  const cards = [...document.querySelectorAll('[data-topic]')];
  const empty = document.querySelector('[data-insight-empty]');
  const topics = [...new Set(cards.map((card) => card.dataset.topic))];

  const applyFilter = (topic) => {
    let visible = 0;
    cards.forEach((card) => {
      const show = topic === 'all' || card.dataset.topic === topic;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (empty) empty.hidden = visible > 0;
    filterBar.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === topic));
    });
  };

  ['all', ...topics].forEach((topic) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.filter = topic;
    button.textContent = topic === 'all' ? 'All topics' : topic;
    button.addEventListener('click', () => applyFilter(topic));
    filterBar.append(button);
  });

  const requested = new URLSearchParams(window.location.search).get('topic');
  applyFilter(topics.includes(requested) ? requested : 'all');
}

// Article template: share links and related articles.
const article = document.querySelector('[data-article]');
if (article) {
  const slug = article.dataset.article;
  const insight = findInsight(slug);
  const url = window.location.href.split('#')[0];

  const copyButton = document.querySelector('[data-copy-link]');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(url);
        copyButton.textContent = 'Link copied';
      } catch {
        window.prompt('Copy this link:', url);
      }
      setTimeout(() => { copyButton.textContent = 'Copy link'; }, 2500);
    });
  }

  const linkedIn = document.querySelector('[data-share-linkedin]');
  if (linkedIn) linkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const email = document.querySelector('[data-share-email]');
  if (email && insight) email.href = `mailto:?subject=${encodeURIComponent(insight.title)}&body=${encodeURIComponent(url)}`;

  const related = document.querySelector('[data-related]');
  if (related) {
    const others = INSIGHTS.filter((item) => item.slug !== slug)
      .sort((a, b) => Number(b.topic === insight?.topic) - Number(a.topic === insight?.topic))
      .slice(0, 3);
    related.innerHTML = others.map((item) => `
      <article class="insight-card">
        <div class="insight-meta"><span class="card-tag">${item.topic}</span>${item.published ? `<time datetime="${item.published}">${formatDate(item.published)}</time>` : ''}</div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <a class="text-link" href="./${item.slug}.html">Read article</a>
      </article>`).join('');
    if (!others.length) related.closest('section').hidden = true;
  }
}
