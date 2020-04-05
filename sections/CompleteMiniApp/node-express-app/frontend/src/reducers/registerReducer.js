import {
    LOADING_REGISTER,
    SUCCESS_REGISTER,
    ERROR_REGISTER,
    ERROR_DISMISS_REGISTER,
    REDIRECT_LOGIN,
    REMOVE_USER_REGISTER_DATA,
    SET_REGISTERED_SUCCESSFULLY
} from '../constants/registerConstants';

const initialState = {
    loading: false,
    user: false,
    errorRegister: false,
    errorMessage: '',
    redirectLogin: false,
    registeredSuccessfully: false
};

export default function register(state = initialState, action = {}) {
    switch (action.type) {

        case LOADING_REGISTER:
            return {
                ...state,
                loading: action.loading
            };
        case SUCCESS_REGISTER:
            return {
                ...state,
                loading: action.loading,
                registeredSuccessfully: true,
                errorRegister: action.errorRegister
            };
        case ERROR_REGISTER:
            return {
                ...state,
                loading: action.loading,
                errorRegister: action.errorRegister,
                errorMessage: action.errorMessage
            };
        case ERROR_DISMISS_REGISTER:
            return {
                ...state,
                errorRegister: action.errorRegister,
                registeredSuccessfully: false
            };
        case REDIRECT_LOGIN:
            return {
                ...state,
                redirectLogin: action.redirectLogin
            };
        case REMOVE_USER_REGISTER_DATA:
            return {
                ...state,
                registeredSuccessfully: false
            };
        case SET_REGISTERED_SUCCESSFULLY:
            return {
                ...state,
                registeredSuccessfully: action.registeredSuccessfully
            };

        default:
            return state;
    }
}