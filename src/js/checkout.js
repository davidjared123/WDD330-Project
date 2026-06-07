import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", "#order-summary");
myCheckout.init();

// Listen for zip code input blur (focusout) to compute order totals
const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    myCheckout.calculateOrderTotal();
  });
}

// Handle form validation and submission on checkout button click
const submitBtn = document.querySelector("#checkoutSubmit");
if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const myForm =
      document.querySelector("#checkout-form") || document.forms[0];
    const chk_status = myForm.checkValidity();
    myForm.reportValidity();
    if (chk_status) {
      myCheckout.checkout(myForm);
    }
  });
}
