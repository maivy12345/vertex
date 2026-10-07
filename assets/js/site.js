const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    document.body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? 'Close' : 'Menu';
  });

  mainNav.addEventListener('click', (event) => {
    if (event.target.closest('a') && window.matchMedia('(max-width: 760px)').matches) {
      mainNav.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = 'Menu';
    }
  });
}

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

let cookieBanner = document.querySelector('[data-cookie-banner]');
if (!cookieBanner) {
  document.body.insertAdjacentHTML('beforeend', `
    <aside class="cookie-banner" data-cookie-banner hidden aria-label="Cookie notice">
      <h2>Cookie preferences</h2>
      <p>We use essential cookies to operate this site. With your permission, analytics cookies help us improve it. See our <a class="text-link" href="/cookies/">Cookie Notice</a>.</p>
      <div class="cookie-actions">
        <button class="button button-primary" data-cookie-choice="accepted">Accept analytics</button>
        <button class="button button-secondary" data-cookie-choice="essential">Essential only</button>
      </div>
    </aside>
  `);
  cookieBanner = document.querySelector('[data-cookie-banner]');
}
if (cookieBanner) {
  const savedChoice = localStorage.getItem('vertex-cookie-choice');
  if (!savedChoice) cookieBanner.hidden = false;

  cookieBanner.querySelectorAll('[data-cookie-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem('vertex-cookie-choice', button.dataset.cookieChoice);
      cookieBanner.hidden = true;
    });
  });
}
