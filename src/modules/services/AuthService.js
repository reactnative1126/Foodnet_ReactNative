import axios from '@utils/axios';

const AuthService = {
    login: function (email, password) {
        return axios.post(`/auth/login`, {
            email,
            password
        }).then((response) => {
            return response.data;
        });
    },
    register: function (name, email, password, newsletter) {
        return axios.post(`/auth/register`, {
            email,
            name,
            password,
            newsletter
        }).then((response) => {
            return response.data;
        });
    },
    verification: function (email) {
        return axios.post(`/auth/reset-password`, {
            email
        }).then((response) => {
            return response.data;
        });
    },
    reset: function (email, password, code) {
        return axios.post(`/auth/change-password`, {
            email,
            newPassword: password,
            code
        }).then((response) => {
            return response.data;
        });
    },
    cities: function (country) {
        return axios.get(`/location/${country}`).then((response) => {
            return response.data;
        });
    },
    cityNames: function (cityId) {
        return axios.get(`/location/base/city-name/${cityId}`).then((response) => {
            return response.data;
        });
    },
}

export default AuthService;