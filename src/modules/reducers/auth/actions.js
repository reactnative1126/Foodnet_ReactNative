import types from './types';

export const setLoading = (data) => ({
    type: types.SET_LOADING,
    payload: data,
});

export const setCountry = (data) => ({
    type: types.SET_COUNTRY,
    payload: data,
});
export const setCity = (data) => ({
    type: types.SET_CITY,
    payload: data,
});
export const setUser = (data) => ({
    type: types.SET_USER,
    payload: data,
});
export const setUserCity = (data) => ({
    type: types.SET_USER_CITY,
    payload: data,
});
export const deleteUser = (data) => ({
    type: types.DELETE_USER,
    payload: data,
});
