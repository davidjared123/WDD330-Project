function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

const baseURL = import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

export default class ProductData {
  constructor(category) {
    this.category = category;
  }
  async getData() {
    return fetch(baseURL + `products/search/${this.category}`)
      .then(convertToJson)
      .then((data) => data.Result);
  }
  async findProductById(id) {
    return fetch(baseURL + `product/${id}`)
      .then(convertToJson)
      .then((data) => data.Result);
  }
}
