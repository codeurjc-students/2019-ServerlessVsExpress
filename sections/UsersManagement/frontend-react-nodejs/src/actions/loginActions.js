import {
    LOADING,
    SUCCESS_LOGIN,
    ERROR_LOGIN,
    ERROR_DISMISS,
    SUCCESS_LOGOUT
} from '../constants/loginConstants';

import * as API from '../services/loginService';

export const login = (email, password, rememberUser) => {
    return (dispatch) => {
        dispatch(loginLoading(true));

        try {
            const response = API.authenticate(email, password);
            response.then((res) => {
                dispatch(loginSuccessful({email: res.data.email, role: res.data.role, access_token: res.data.access_token, refresh_token: res.data.refresh_token, rememberUser}));
                dispatch(loginLoading(false));
            }).catch((error) => {
                console.log(error.message);
                dispatch(loginLoading(false));
                dispatch(loginError());
            });
        } catch(error) {
            console.log(error.message);
            dispatch(loginLoading(false));
        }
    }
}

export const logout = () => {
    return (dispatch) => {
        // if there isn't any parameter, it will remove the token from headers
        dispatch(logoutSucessful());
    }
}

const loginLoading = (isLoading) => {
    return {
        type: LOADING,
        loading: isLoading
    };
}

const loginSuccessful = (user) => {
    return {
        type: SUCCESS_LOGIN,
        loading: false,
        errorLogin: false,
        user: user
    };
}

const logoutSucessful = () => {
    return {
        type: SUCCESS_LOGOUT,
        user: {}
    };
}

const loginError = () => {
    return {
        type: ERROR_LOGIN,
        loading: false,
        errorLogin: true
    }
}

export const setErrorLoginFalse = () => {
    return {
        type: ERROR_DISMISS,
        errorLogin: false
    }
};

export const checkValidToken = () => {
    return (dispatch) => {
        API.checkValidToken()
        .then(res => {
        })
        .catch(err => {
            dispatch(logoutSucessful());
        });
    };
};