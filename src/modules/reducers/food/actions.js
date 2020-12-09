import types from './types';

export const setFilters = (data) => ({
    type: types.SET_FILTERS,
    payload: data,
});