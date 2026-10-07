const servicePanels = [...document.querySelectorAll('[data-service-panel]')];
const serviceLinks = [...document.querySelectorAll('[data-service-link]')];

if ('IntersectionObserver' in window && servicePanels.length && serviceLinks.length) {
  const setActiveService = (id) => {
    serviceLinks.forEach((link) => {
      const isActive = link.dataset.serviceLink === id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveService(visible.target.id);
  }, { rootMargin: '-18% 0px -54% 0px', threshold: [0.08, 0.25, 0.5] });

  servicePanels.forEach((panel) => observer.observe(panel));
}
