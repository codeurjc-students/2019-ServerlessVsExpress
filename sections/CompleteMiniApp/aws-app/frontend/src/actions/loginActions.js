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
            response.then(async (res) => {
                await API.saveConnectionInfo(email);
                const idToken = res.data.AuthenticationResult.IdToken;
                const accessToken = res.data.AuthenticationResult.AccessToken;
                const refreshToken = res.data.AuthenticationResult.RefreshToken;
                const decodedIdToken = API.decodeIdToken(idToken);
                const userRole = decodedIdToken['cognito:groups'][0] === 'Admins' ? 'ADMIN' : 'USER';
                const userEmail = decodedIdToken['email'];
                dispatch(loginSuccessful({email: userEmail, role: userRole, access_token: accessToken, refresh_token: refreshToken, id_token: idToken, rememberUser}));
                dispatch(loginLoading(false));
            }).catch((error) => {
                dispatch(loginLoading(false));
                dispatch(loginError());
            });
        } catch(error) {
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
            //console.log(res);
        })
        .catch(err => {
            dispatch(logoutSucessful());
        });
    };
};