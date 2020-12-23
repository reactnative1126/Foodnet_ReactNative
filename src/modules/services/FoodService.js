import axios from '@utils/axios';

const FoodService = {
    promotion: function (country, cityName) {
        return axios.get(`/location/promotion/${country}/${cityName}`).then((response) => {
            console.log(response.data)
            return response.data;
        });
    },
    popular: function (country, cityName) {
        return axios.get(`/location/popular/${country}/${cityName}`).then((response) => {
            return response.data;
        });
    },
    all: function (country, cityName) {
        return axios.get(`/location/${country}/${cityName}`).then((response) => {
            return response.data;
        });
    },
    result: function (country, cityName, search, filters) {
        return axios.post(`/location/home/search`, {
            lang: country,
            location: cityName,
            searchString: search,
            filters
        }).then((response) => {
            return response.data;
        });
    },
    
    categories: function (country, restaurantId) {
        return axios.post(`/product/category`, {
            restaurantId,
            lang: country
        }).then((response) => {
            return response.data;
        });
    },    
    subCategories: function (country, restaurantId, categoryId) {
        return axios.post(`/product/subcategories`, {
            restaurantId,
            lang: country,
            categoryId
        }).then((response) => {
            return response.data;
        });
    }, 
    products: function (country, restaurantId, categoryId, subcategoryId, propertyValTransId, searchedProduct) {
        return axios.post(`/product/subcategories-products`, {
            restaurantId,
            lang: country,
            subcategoryId,
            propertyValTransId,
            categoryId
        }).then((response) => {
            return response.data;
        });
    }, 
    information: function (country, restaurantName) {
        return axios.get(`/restaurant/info/${country}/${restaurantName}`).then((response) => {
            return response.data;
        });
    },
    reviews: function (restaurantName, rating) {
        return axios.post(`/restaurant/review-list`, {
            restaurantName,
            rating
        }).then((response) => {
            return response.data;
        });
    },

    required: function (country, restaurantId, variantId) {
        return axios.post(`/product/required-extra`, {
            restaurantId,
            lang: country,
            variantId
          }).then((response) => {
            return response.data;
        });
    },

    optional: function (country, restaurantId, variantId) {
        return axios.post(`/product/optional-extra`, {
            restaurantId,
            lang: country,
            variantId
          }).then((response) => {
            return response.data;
        });
    },

    order: function (deliveryAddressId, restaurantId, take, cutlery, products) {
        console.log(JSON.stringify({
            deliveryAddressId,
            restaurantId,
            take: take ? 1 : 0,
            cutlery: cutlery ? 1 : 0,
            products
          }));
        return axios.post(`/order`, {
            deliveryAddressId,
            restaurantId,
            take: take ? 1 : 0,
            cutlery: cutlery ? 1 : 0,
            products
          }).then((response) => {
              console.log(response.data)
            return response.data;
        });
    },
}

export default FoodService;