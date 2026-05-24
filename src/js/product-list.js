import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const dataSource = new ProductData(category);
const element = document.querySelector(".product-list");

// Update category title
document.querySelector(".category-title").textContent = category.charAt(0).toUpperCase() + category.slice(1);

const productList = new ProductList(category, dataSource, element);
productList.init();

// Sort feature
document.getElementById("sort-by").addEventListener("change", (e) => {
  productList.sortList(e.target.value);
});
