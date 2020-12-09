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
};

export default function foodReducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_FILTERS:
            return {
                ...state,
                filters: action.payload,
            };

        default:
            return state;
    }
}