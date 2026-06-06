import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage } from "./utils.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // calculate and display the total dollar amount of the items in the cart, and the number of items.
    const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
    const numItemsElement = document.querySelector(`${this.outputSelector} #num-items`);
    
    const count = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    this.itemTotal = this.list.reduce((sum, item) => sum + (item.FinalPrice * (item.quantity || 1)), 0);

    if (numItemsElement) {
      numItemsElement.innerText = count;
    }
    if (subtotalElement) {
      subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
    const count = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (count > 0) {
      this.shipping = 10 + (count - 1) * 2;
    } else {
      this.shipping = 0;
    }
    this.tax = this.itemTotal * 0.06;
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotalElement = document.querySelector(`${this.outputSelector} #order-total`);

    if (taxElement) {
      taxElement.innerText = `$${this.tax.toFixed(2)}`;
    }
    if (shippingElement) {
      shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
    }
    if (orderTotalElement) {
      orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  async checkout(form) {
    const json = formDataToJSON(form);
    // populate the JSON order object with the order Date, orderTotal, tax, shipping, and list of items
    json.orderDate = new Date().toISOString();
    json.items = packageItems(this.list);
    json.orderTotal = this.orderTotal.toFixed(2);
    json.shipping = this.shipping;
    json.tax = this.tax.toFixed(2);
    
    console.log("Submitting order payload:", json);
    
    try {
      const res = await this.services.checkout(json);
      console.log("Order submission response:", res);
    } catch (err) {
      console.error("Order submission error:", err);
    }
  }
}
