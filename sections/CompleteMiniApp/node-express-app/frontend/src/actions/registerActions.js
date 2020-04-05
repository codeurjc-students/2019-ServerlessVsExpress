import Joi from '@hapi/joi';
import {
    LOADING_REGISTER,
    SUCCESS_REGISTER,
    ERROR_REGISTER,
    ERROR_DISMISS_REGISTER,
    REDIRECT_LOGIN,
    REMOVE_USER_REGISTER_DATA,
    SET_REGISTERED_SUCCESSFULLY
} from '../constants/registerConstants';

import * as API from '../services/registerService';

export const register = (user) => {

    const schemaRegister = Joi.object({
        email: Joi.string().email({ tlds: {allow: false} }).required()
                    .messages({
                        'string.email': 'Email must be a valid email',
                        'string.empty': 'Email cannot be empty',
                        'any.required': 'Email cannot be empty'
                    }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required()
                    .messages({
                        'string.pattern.base': 'Password must be alphanumeric and have a length between 6 and 30.',
                        'string.empty': 'Password cannot be empty',
                        'any.required': 'Password cannot be empty'
                    }),
        password2: Joi.ref('password'),
        firstName: Joi.string()
                    .min(3)
                    .max(30)
                    .required()
                    .messages({
                        'string.empty': 'First name cannot be empty',
                        'string.min': 'First name must have a length between 3 and 30',
                        'string.max': 'First name must have a length between 3 and 30',
                        'any.required': 'First name cannot be empty'
                    }),
        lastName: Joi.string()
                    .min(3)
                    .max(30)
                    .required()
                    .messages({
                        'string.empty': 'Last name cannot be empty',
                        'string.min': 'Last name must have a length between 3 and 30',
                        'string.max': 'Last name must have a length between 3 and 30',
                        'any.required': 'Last name cannot be empty'
                    }),

    });

    return (dispatch) => {
        dispatch(registerLoading(true));

        try {
            const validation = schemaRegister.validate(user);
            if(validation.error) {
                throw new Error(validation.error.message);
            }

            const response = API.register(user);
            response.then((res) => {
                console.log(res);
                dispatch(registerSuccessful());
                dispatch(registerLoading(false));

            }).catch((error) => {
                console.log(error);
                dispatch(registerLoading(false));
                dispatch(registerError({message: 'Error registering user'}));
            });
        } catch(error) {
            dispatch(registerLoading(false));
            dispatch(registerError(error));
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

const registerError = (error) => {
    return {
        type: ERROR_REGISTER,
        loading: false,
        errorRegister: true,
        errorMessage: error.message
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

export const setRegisteredSuccessfully = (success) => {
    return {
        type: SET_REGISTERED_SUCCESSFULLY,
        registeredSuccessfully: success
    }
};