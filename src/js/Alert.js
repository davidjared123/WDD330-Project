export default class Alert {
  constructor() {
    // The path should work from the root of the site since public folders are served at root
    this.path = '../json/alerts.json';
  }

  async init() {
    try {
      const response = await fetch(this.path);
      if (response.ok) {
        const alerts = await response.json();
        if (alerts && alerts.length > 0) {
          const section = document.createElement('section');
          section.classList.add('alert-list');

          alerts.forEach((alert) => {
            const p = document.createElement('p');
            p.textContent = alert.message;
            p.style.backgroundColor = alert.background;
            p.style.color = alert.color;
            p.style.padding = '0.5rem';
            p.style.margin = '0';
            p.style.textAlign = 'center';
            p.style.fontWeight = 'bold';
            section.appendChild(p);
          });

          document.querySelector('main').prepend(section);
        }
      }
    } catch (err) {
      console.error('Error loading alerts:', err);
    }
  }
}
