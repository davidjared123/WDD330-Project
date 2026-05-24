import { getLocalStorage, renderListWithTemplate, updateCartBadge } from "./utils.mjs";

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <div class="cart-card__quantity">
    <button class="quantity-btn minus" data-id="${item.Id}">-</button>
    <span>${item.quantity || 1}</span>
    <button class="quantity-btn plus" data-id="${item.Id}">+</button>
  </div>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }
  
  renderCartContents() {
    const cartItems = getLocalStorage(this.key);
    const parentElement = document.querySelector(this.parentSelector);
    
    if (cartItems && cartItems.length > 0) {
      renderListWithTemplate(this.cartItemTemplate, parentElement, cartItems);

      const total = cartItems.reduce((acc, item) => acc + (item.FinalPrice * (item.quantity || 1)), 0);
      const cartFooter = document.querySelector(".cart-footer");
      const cartTotal = document.querySelector(".cart-total");
      
      cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
      cartFooter.classList.remove("hide");

      // Add event listeners for quantities
      document.querySelectorAll(".quantity-btn.minus").forEach(btn => {
        btn.addEventListener("click", () => this.updateQuantity(btn.dataset.id, -1));
      });
      document.querySelectorAll(".quantity-btn.plus").forEach(btn => {
        btn.addEventListener("click", () => this.updateQuantity(btn.dataset.id, 1));
      });

    } else {
      parentElement.innerHTML = "<p>Your cart is empty.</p>";
    }
  }

  updateQuantity(id, change) {
    let cart = getLocalStorage(this.key);
    const itemIndex = cart.findIndex(item => item.Id === id);
    if (itemIndex > -1) {
      cart[itemIndex].quantity = (cart[itemIndex].quantity || 1) + change;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }
      localStorage.setItem(this.key, JSON.stringify(cart));
      this.renderCartContents();
      updateCartBadge();
    }
  }
}
