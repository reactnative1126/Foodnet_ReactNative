import axios, { setClientToken, removeClientToken } from '@utils/axios';

const ProfileService = {
    getDeliveryList: function (token, country) {
        setClientToken(token);
        return axios.get(`/delivery-address/${country}`).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
    setDeliveryAddress: function (token, id, city, street, houseNumber, floor, doorNumber) {
        setClientToken(token);
        return axios.post(`/delivery-address`, {
            houseNumber,
            street,
            city: city.cities,
            floor,
            doorNumber,
            deliveryAddressId: id,
            locationNameId: city.id,
            operation: id === 0 ? 'create' : 'update'
        }).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
    deleteDeliveryAddress: function (token, id) {
        setClientToken(token);
        return axios.delete(`/delivery-address/${id}`).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
    getProfileInformation: function (token) {
        setClientToken(token);
        return axios.get(`/profile/me`).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
    modifyProfileInformation: function (token, fullName, email, phoneNumber) {
        setClientToken(token);
        return axios.post(`/profile/me`, {
            email,
            fullName,
            phoneNumber
        }).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
    deleteProfile: function (token) {
        setClientToken(token);
        return axios.delete(`/profile`).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
    modifyProfilePassword: function (token, oldPassword, newPassword, newPasswordAgain) {
        setClientToken(token);
        return axios.post(`/profile/change-password`, {
            oldPassword,
            newPassword,
            newPasswordAgain
        }).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
    addReviews: function (token) {
        setClientToken(token);
        return axios.get(`/restaurant-review/addition-list`).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
    viewReviews: function (token) {
        setClientToken(token);
        return axios.get(`/restaurant-review/added-list`).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
    getReview: function (token, reviewId) {
        setClientToken(token);
        return axios.get(`/restaurant-review/${reviewId}`).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
    setReview: function (token, genLink, rating, message) {
        setClientToken(token);
        return axios.post(`/restaurant-review`, {
            genLink,
            rating,
            message
        }).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
    deleteReview: function (token, reviewId) {
        setClientToken(token);
        return axios.delete(`/restaurant-review/${reviewId}`).then((response) => {
            removeClientToken();
            return response.data;
        });
    },
}

export default ProfileService;