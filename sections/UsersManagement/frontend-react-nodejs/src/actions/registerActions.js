import {
    LOADING_REGISTER,
    SUCCESS_REGISTER,
    ERROR_REGISTER,
    ERROR_DISMISS_REGISTER,
    REDIRECT_LOGIN,
    REMOVE_USER_REGISTER_DATA
} from '../constants/registerConstants';

import * as API from '../services/registerService';

export const register = (user) => {

    return (dispatch) => {
        dispatch(registerLoading(true));

        try {
            const response = API.register(user);
            response.then((res) => {
                console.log(res);
                dispatch(registerSuccessful());
                dispatch(registerLoading(false));

            }).catch((error) => {
                console.log(error);
                dispatch(registerLoading(false));
                dispatch(registerError());
            });
        } catch(error) {
            console.log(error);
            dispatch(registerLoading(false));
        }
    }
}

const registerLoading = (isLoading) => {
    return {
        type: LOADING_REGISTER,
        loading: isLoading
    };
}

const registerSuccessful = () => {
    return {
        type: SUCCESS_REGISTER,
        loading: false,
        errorRegister: false
    };
}

const registerError = () => {
    return {
        type: ERROR_REGISTER,
        loading: false,
        errorRegister: true
    }
}

export const setErrorRegisterFalse = () => {
    return {
        type: ERROR_DISMISS_REGISTER,
        errorRegister: false
    }
};

export const setRedirectLogin = (enabled) => {
    return {
        type: REDIRECT_LOGIN,
        redirectLogin: enabled
    }
};

export const removeRegisteredUserInfo = () => {
    return {
        type: REMOVE_USER_REGISTER_DATA
    }
}