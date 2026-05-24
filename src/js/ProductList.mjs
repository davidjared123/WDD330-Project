import { renderListWithTemplate } from "./utils.mjs";

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
  }
}
