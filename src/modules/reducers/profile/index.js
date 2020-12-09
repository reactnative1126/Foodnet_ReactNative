import types from './types';

const initialState = {
    deliveryStatus: false,
    reviewStatus: false,
};

export default function profileReducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_DELIVERYSTATUS:
            return {
                ...state,
                deliveryStatus: action.payload,
            };
        case types.SET_REVIEWSTATUS:
            return {
                ...state,
                reviewStatus: action.payload,
            };

        default:
            return state;
    }
}