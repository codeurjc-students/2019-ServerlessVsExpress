import { 
    LOADING_USERS,
    GET_USERS_SUCCESS,
    PDF_LOADING
} from '../constants/userConstants';

const initialState = {
    loading: false,
    users: [],
    loadingPdf: false
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
            };
        case PDF_LOADING:
            return {
                ...state,
                loadingPdf: action.loadingPdf
            };
        default:
            return state;
    }
}