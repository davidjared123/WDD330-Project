import { setLocalStorage, getLocalStorage, updateCartBadge } from "./utils.mjs";

function productDetailsTemplate(product) {
  const discount = product.SuggestedRetailPrice - product.FinalPrice;
  const discountFlag = discount > 0 ? `<p class="discount-flag">Discount: $${discount.toFixed(2)} off!</p>` : "";
  const imageSrc = product.Images ? product.Images.PrimaryLarge : product.Image;
  const imageSmall = product.Images ? product.Images.PrimaryMedium : product.Image;

  return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <picture>
      <source media="(min-width: 500px)" srcset="${imageSrc}">
      <img class="divider" src="${imageSmall}" alt="${product.NameWithoutBrand}" />
    </picture>
    <p class="product-card__price">$${product.FinalPrice}</p>
    ${discountFlag}
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div></section>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails("main");
    
    // Breadcrumbs
    const breadcrumb = document.querySelector(".breadcrumbs");
    if (breadcrumb) {
      const cat = this.product.Category ? this.product.Category.charAt(0).toUpperCase() + this.product.Category.slice(1) : "Product";
      breadcrumb.innerHTML = `${cat} -> ${this.product.NameWithoutBrand}`;
    }

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }
  addToCart() {
    let cart = getLocalStorage("so-cart");
    if (!cart) {
      cart = [];
    } else if (!Array.isArray(cart)) {
      cart = [cart];
    }
    
    // Check for duplicates
    const existingProduct = cart.find(item => item.Id === this.product.Id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      this.product.quantity = 1;
      cart.push(this.product);
    }
    
    setLocalStorage("so-cart", cart);
    updateCartBadge();
  }
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.innerHTML = '<div class="breadcrumbs"></div>' + productDetailsTemplate(this.product);
  }
}
