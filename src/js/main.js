import Alert from './Alert.js';
import { loadHeaderFooter, alertMessage } from './utils.mjs';

loadHeaderFooter();

const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    alertMessage(`Thank you for subscribing with ${emailInput.value}!`, false);
    newsletterForm.reset();
  });
}

const alert = new Alert();
alert.init();
