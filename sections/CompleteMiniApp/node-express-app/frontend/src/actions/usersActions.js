import {
    LOADING_USERS,
    GET_USERS_SUCCESS
} from '../constants/userConstants';

import * as API from '../services/usersService';

export const getUsers = () => {
    return (dispatch) => {
        dispatch(usersLoading(true));
        API.getUsers()
        .then(users => {
            dispatch(getUsersSuccess(users.data));
            dispatch(usersLoading(false));
        })
        .catch(err => {
            console.log(err);
            dispatch(usersLoading(false));
        });
    };
}

export const activateUser = (email, activate) => {
    return (dispatch) => {
        API.activateUser(email, activate)
        .then(res => {
            dispatch(usersLoading(true));
            dispatch(getUsers());
        })
        .catch(err => {
            console.log(err);
        });
    };
}

export const usersLoading = (loading) => {
    return {
        type: LOADING_USERS,
        loading
    };
};

export const getUsersSuccess = (users) => {
    return {
        type: GET_USERS_SUCCESS,
        users: users
    };
}

export const printUsers = () => {
    return (dispatch, getState) => {
        dispatch(usersLoading(true));
        const users = getState().users.users;
        API.printUsers(users)
        .then(data => {
            console.log(data);
            dispatch(usersLoading(false));
        })
        .catch(err => {
            console.log(err);
            dispatch(usersLoading(false));
        });
    };
};