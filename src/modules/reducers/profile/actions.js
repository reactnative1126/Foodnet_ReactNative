import types from './types';

export const setDeliveryStatus = (data) => ({
    type: types.SET_DELIVERYSTATUS,
    payload: data,
});

export const setReviewStatus = (data) => ({
    type: types.SET_REVIEWSTATUS,
    payload: data,
});