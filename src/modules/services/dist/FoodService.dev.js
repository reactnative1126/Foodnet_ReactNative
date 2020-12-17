"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("@utils/axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var FoodService = {
  promotion: function promotion(country, cityName) {
    return _axios["default"].get("/location/promotion/".concat(country, "/").concat(cityName)).then(function (response) {
      return response.data;
    });
  },
  popular: function popular(country, cityName) {
    return _axios["default"].get("/location/popular/".concat(country, "/").concat(cityName)).then(function (response) {
      return response.data;
    });
  },
  all: function all(country, cityName) {
    return _axios["default"].get("/location/".concat(country, "/").concat(cityName)).then(function (response) {
      return response.data;
    });
  },
  result: function result(country, cityName, search, filters) {
    return _axios["default"].post("/location/home/search", {
      lang: country,
      location: cityName,
      searchString: search,
      filters: filters
    }).then(function (response) {
      return response.data;
    });
  },
  categories: function categories(country, restaurantId) {
    return _axios["default"].post("/product/category", {
      restaurantId: restaurantId,
      lang: country
    }).then(function (response) {
      return response.data;
    });
  },
  subCategories: function subCategories(country, restaurantId, categoryId) {
    return _axios["default"].post("/product/subcategories", {
      restaurantId: restaurantId,
      lang: country,
      categoryId: categoryId
    }).then(function (response) {
      return response.data;
    });
  },
  products: function products(country, restaurantId, categoryId, subcategoryId, propertyValTransId, searchedProduct) {
    return _axios["default"].post("/product/subcategories-products", {
      restaurantId: restaurantId,
      lang: country,
      subcategoryId: subcategoryId,
      propertyValTransId: propertyValTransId,
      categoryId: categoryId
    }).then(function (response) {
      return response.data;
    });
  },
  // categories: function (country, restaurantName, searchedProduct) {
  //     return axios.post(`/product`, {
  //         lang: country,
  //         restaurantName,
  //         searchedProduct
  //     }).then((response) => {
  //         return response.data;
  //     });
  // },
  // products: function (country, categoryId, restaurantName, searchedProduct) {
  //     return axios.post(`/product/category`, {
  //         lang: country,
  //         categoryId,
  //         restaurantName,
  //         searchedProduct
  //     }).then((response) => {
  //         return response.data;
  //     });
  // },
  // allergen: function (country, productId, restaurantName) {
  //     return axios.post(`/product/allergen`, {
  //         lang: country,
  //         productId,
  //         restaurantName
  //     }).then((response) => {
  //         return response.data.result;
  //     });
  // },
  information: function information(country, restaurantName) {
    return _axios["default"].get("/restaurant/info/".concat(country, "/").concat(restaurantName)).then(function (response) {
      return response.data;
    });
  },
  reviews: function reviews(restaurantName, rating) {
    return _axios["default"].post("/restaurant/review-list", {
      restaurantName: restaurantName,
      rating: rating
    }).then(function (response) {
      return response.data;
    });
  }
};
var _default = FoodService;
exports["default"] = _default;