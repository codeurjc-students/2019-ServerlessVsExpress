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
        refresh_token: cookies.get('refresh_token'),
        id_token: cookies.get('id_token')
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
            setAllCookies(action);
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
            deleteAllCookies();
            return {
                ...state,
                user: {}
            };

        default:
            return state;
    }
}

const setAllCookies = (action) => {
    //expires: new Date(Date.now()+2592000)
    const expirationTime = new Date(Date.now()+60000);

    if(action.user.rememberUser) {
        cookies.set('access_token', action.user.access_token, {path: '/'});
        cookies.set('refresh_token', action.user.refresh_token, {path: '/'});
        cookies.set('email', action.user.email, {path: '/'});
        cookies.set('role', action.user.role, {path: '/'});
        cookies.set('id_token', action.user.id_token, {path: '/'});
    } else {
        cookies.set('access_token', action.user.access_token, {path: '/', expires: expirationTime});
        cookies.set('refresh_token', action.user.refresh_token, {path: '/', expires: expirationTime});
        cookies.set('email', action.user.email, {path: '/', expires: expirationTime});
        cookies.set('role', action.user.role, {path: '/', expires: expirationTime});
        cookies.set('id_token', action.user.id_token, {path: '/', expires: expirationTime});
    }
};

const deleteAllCookies = () => {
    cookies.remove('access_token');
    cookies.remove('refresh_token');
    cookies.remove('email');
    cookies.remove('role');
    cookies.remove('id_token');
};