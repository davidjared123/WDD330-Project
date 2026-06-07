import { renderListWithTemplate, getLocalStorage, setLocalStorage, updateCartBadge, alertMessage } from "./utils.mjs";

function productCardTemplate(product) {
  const imageSrc = product.Images ? product.Images.PrimaryMedium : product.Image;
  const imageSmall = product.Images ? product.Images.PrimarySmall : product.Image;
  
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <picture>
        <source media="(min-width: 500px)" srcset="${imageSrc}">
        <img src="${imageSmall}" alt="Image of ${product.Name}" />
      </picture>
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
    <button class="quick-view-btn" data-id="${product.Id}">Quick View</button>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    this.list = await this.dataSource.getData(this.category);
    this.renderList(this.list);
    this.updateBreadcrumbs();
  }

  updateBreadcrumbs() {
    const breadcrumb = document.querySelector(".breadcrumbs");
    if (breadcrumb) {
      const cat = this.category.charAt(0).toUpperCase() + this.category.slice(1);
      breadcrumb.innerHTML = `${cat} -> (${this.list.length} items)`;
    }
  }

  sortList(sortBy) {
    if (sortBy === "name") {
      this.list.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
    } else if (sortBy === "price") {
      this.list.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }
    this.renderList(this.list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);

    // Attach click event listeners to Quick View buttons
    this.listElement.querySelectorAll(".quick-view-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        await this.showQuickView(id);
      });
    });
  }

  async showQuickView(id) {
    try {
      const product = await this.dataSource.findProductById(id);

      const modal = document.createElement("div");
      modal.className = "modal-overlay quick-view-modal";
      modal.innerHTML = `
        <div class="modal-content product-quick-view-content">
          <span class="close-modal">&times;</span>
          <h3>${product.Brand.Name}</h3>
          <h2>${product.NameWithoutBrand}</h2>
          <img src="${product.Images.PrimaryLarge}" alt="${product.Name}" />
          <p class="product-card__price">$${product.FinalPrice}</p>
          <p class="product__color">${product.Colors[0].ColorName}</p>
          <div class="product__description">
            ${product.DescriptionHtmlSimple}
          </div>
          <button id="quickAddToCart" class="btn-checkout" data-id="${product.Id}">Add to Cart</button>
        </div>
      `;

      const closeModal = () => {
        document.body.removeChild(modal);
      };

      modal.querySelector(".close-modal").addEventListener("click", closeModal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      modal.querySelector("#quickAddToCart").addEventListener("click", () => {
        this.addProductToCart(product);
      });

      document.body.appendChild(modal);
    } catch (err) {
      console.error("Error loading quick view details:", err);
    }
  }

  addProductToCart(product) {
    let cart = getLocalStorage("so-cart");
    if (!cart) {
      cart = [];
    } else if (!Array.isArray(cart)) {
      cart = [cart];
    }

    const existingProduct = cart.find((item) => item.Id === product.Id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }

    setLocalStorage("so-cart", cart);
    updateCartBadge();
    alertMessage("Item added to cart!", false);
  }
}
