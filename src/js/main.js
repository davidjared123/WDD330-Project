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

function showRegistrationModal() {
  const modal = document.createElement('div');
  modal.id = 'registration-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Win $500 in Outdoor Gear! ⛺</h2>
      <p>Register an account with Sleep Outside today and you will be automatically entered into our gear giveaway!</p>
      <div class="modal-actions">
        <a href="#" class="btn-modal-register"><button>Register Now</button></a>
        <button class="btn-modal-dismiss">Maybe Later</button>
      </div>
    </div>
  `;

  const closeModal = () => {
    document.body.removeChild(modal);
  };

  modal.querySelector('.close-modal').addEventListener('click', closeModal);
  modal.querySelector('.btn-modal-dismiss').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.body.appendChild(modal);
}

function checkFirstVisit() {
  const visited = localStorage.getItem('visited_before');
  if (!visited) {
    showRegistrationModal();
    localStorage.setItem('visited_before', 'true');
  }
}

checkFirstVisit();
