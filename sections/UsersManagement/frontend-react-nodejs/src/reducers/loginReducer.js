import {
    LOADING,
    SUCCESS_LOGIN,
    ERROR_LOGIN,
    ERROR_DISMISS,
    SUCCESS_LOGOUT
} from '../constants/loginConstants';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

const initialState = {
    loading: false,
    user: {
        email: cookies.get('email'),
        role: cookies.get('role'),
        access_token: cookies.get('access_token'),
        refresh_token: cookies.get('refresh_token')
        } || {},
    errorLogin: false
};

export default function login(state = initialState, action = {}) {
    switch (action.type) {

        case LOADING:
            return {
                ...state,
                loading: action.loading
            };
        case SUCCESS_LOGIN:
            cookies.set('access_token', action.user.access_token, {path: '/'});
            cookies.set('refresh_token', action.user.refresh_token, {path: '/'});
            cookies.set('email', action.user.email, {path: '/'});
            cookies.set('role', action.user.role, {path: '/'});
            
            return {
                ...state,
                loading: action.loading,
                user: action.user
            };
        case ERROR_LOGIN:
            return {
                ...state,
                loading: action.loading,
                errorLogin: action.errorLogin
            };
        case ERROR_DISMISS:
            return {
                ...state,
                errorLogin: action.errorLogin
            };
        case SUCCESS_LOGOUT:
            cookies.remove('access_token');
            cookies.remove('refresh_token');
            cookies.remove('email');
            return {
                ...state,
                user: {}
            };

        default:
            return state;
    }
}