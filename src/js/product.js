import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const productId = getParam("product");
// Note: findProductById uses just the ID and hits the API
const dataSource = new ProductData("tents"); 

const product = new ProductDetails(productId, dataSource);
product.init();
