import types from './types';

export const setFilters = (data) => ({
    type: types.SET_FILTERS,
    payload: data,
});

export const setCartRestaurant = (data) => ({
    type: types.SET_CART_RESTAURANT,
    payload: data,
});

export const setCartProducts = (data) => ({
    type: types.SET_CART_PRODUCTS,
    payload: data,
});

export const setCartBadge = (data) => ({
    type: types.SET_CART_BADGE,
    payload: data,
});

export const setCartToast = (data) => ({
    type: types.SET_CART_TOAST,
    payload: data,
});