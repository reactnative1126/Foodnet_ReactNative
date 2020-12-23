import types from './types';

const initialState = {
    filters: {
        freeDelivery: 0,
        newest: 0,
        pizza: 0,
        hamburger: 0,
        dailyMenu: 0,
        soup: 0,
        salad: 0,
        money: 0,
        card: 0,
        withinOneHour: 0
    },
    cartRestaurant: null,
    cartProducts: [],
    cartBadge: 0,
    cartToast: false
};

export default function foodReducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_FILTERS:
            return {
                ...state,
                filters: action.payload,
            };
        case types.SET_CART_RESTAURANT:
            return {
                ...state,
                cartRestaurant: action.payload,
            };
        case types.SET_CART_PRODUCTS:
            return {
                ...state,
                cartProducts: action.payload,
            };
        case types.SET_CART_BADGE:
            return {
                ...state,
                cartBadge: action.payload,
            };
        case types.SET_CART_TOAST:
            return {
                ...state,
                cartToast: action.payload,
            };

        default:
            return state;
    }
}