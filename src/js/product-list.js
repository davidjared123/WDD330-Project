import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");

// Update category title
const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
document.querySelector(".category-title").textContent =
  `Top Products: ${formattedCategory}`;

const productList = new ProductList(category, dataSource, element);
productList.init();

// Sort feature
document.getElementById("sort-by").addEventListener("change", (e) => {
  productList.sortList(e.target.value);
});
