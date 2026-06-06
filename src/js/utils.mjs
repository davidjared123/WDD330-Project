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

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const headerElement = document.querySelector("#main-header");
  const footerTemplate = await loadTemplate("/partials/footer.html");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement, null, updateCartBadge);
  renderWithTemplate(footerTemplate, footerElement);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
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

export function alertMessage(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener('click', function(e) {
    if (e.target.tagName === 'SPAN' || e.target.innerText === 'X') {
      const main = document.querySelector('main');
      main.removeChild(this);
    }
  });

  const main = document.querySelector('main');
  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
}
