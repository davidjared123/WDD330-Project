import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const myCheckout = new CheckoutProcess('so-cart', '#order-summary');
myCheckout.init();

// Listen for zip code input blur (focusout) to compute order totals
const zipInput = document.querySelector('#zip');
if (zipInput) {
  zipInput.addEventListener('blur', () => {
    myCheckout.calculateOrderTotal();
  });
}

// Handle form submission
const checkoutForm = document.querySelector('#checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    myCheckout.checkout(e.target);
  });
}
