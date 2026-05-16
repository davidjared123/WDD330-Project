// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function updateCartBadge() {
  const cartItems = getLocalStorage("so-cart");
  let totalItems = 0;
  if (cartItems) {
    if (Array.isArray(cartItems)) {
      totalItems = cartItems.length;
    } else {
      totalItems = 1;
    }
  }
  
  if (totalItems > 0) {
    const cartIcon = qs(".cart a");
    if (cartIcon) {
      let badge = qs(".cart-superscript", cartIcon);
      if (!badge) {
        cartIcon.insertAdjacentHTML("beforeend", `<span class="cart-superscript">${totalItems}</span>`);
      } else {
        badge.textContent = totalItems;
      }
    }
  }
}
