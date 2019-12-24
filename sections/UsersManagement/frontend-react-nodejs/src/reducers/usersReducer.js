import { LOADING } from '../constants/userConstants';

const initialState = {
    loading: false
};

export default function users(state = initialState, action = {}) {
    switch (action.type) {

        case LOADING:
            return {
                ...state,
                loading: true
            };

        default:
            return state;
    }
}