import { 
    LOADING_USERS,
    GET_USERS_SUCCESS
} from '../constants/userConstants';

const initialState = {
    loading: false,
    users: [],
};

export default function users(state = initialState, action = {}) {
    switch (action.type) {
        case LOADING_USERS:
            return {
                ...state,
                loading: true
            };
        case GET_USERS_SUCCESS:
            return {
                ...state,
                users: action.users
            }

        default:
            return state;
    }
}