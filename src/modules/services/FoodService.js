import axios from '@utils/axios';

const FoodService = {
    promotion: function (country, cityName) {
        return axios.get(`/location/promotion/${country}/${cityName}`).then((response) => {
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
    categories: function (country, restaurantName, searchedProduct) {
        return axios.post(`/product`, {
            lang: country,
            restaurantName,
            searchedProduct
        }).then((response) => {
            return response.data;
        });
    },
    products: function (country, categoryId, restaurantName, searchedProduct) {
        return axios.post(`/product/category`, {
            lang: country,
            categoryId,
            restaurantName,
            searchedProduct
        }).then((response) => {
            return response.data;
        });
    },
    allergen: function (country, productId, restaurantName) {
        return axios.post(`/product/allergen`, {
            lang: country,
            productId,
            restaurantName
        }).then((response) => {
            return response.data.result;
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
}

export default FoodService;