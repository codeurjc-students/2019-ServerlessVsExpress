import {
    LOADING_USERS,
    GET_USERS_SUCCESS,
    PDF_LOADING
} from '../constants/userConstants';

import * as API from '../services/usersService';

export const getUsers = () => {
    return (dispatch) => {
        dispatch(usersLoading(true));
        API.getUsers()
        .then(users => {
            let usersFormatted = [];
            for(let i = 0; i < users.data.Users.length; i++) {
                const actualUser = users.data.Users[i];
                usersFormatted.push({
                    username: actualUser.Username,
                    email: actualUser.Attributes.find(elem => elem.Name === 'email').Value,
                    activated: actualUser.Enabled ? 'ACTIVATED' : 'PENDING'
                });
            }
            dispatch(getUsersSuccess(usersFormatted));
            dispatch(usersLoading(false));
        })
        .catch(err => {
            console.log(err);
            dispatch(usersLoading(false));
        });
    };
}

export const activateUser = (username, activate) => {
    return (dispatch) => {
        API.activateUser(username, activate)
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

export const printPdfUsers = () => {
    return (dispatch, getState) => {
        const users = getState().users.users;

        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        const bodyPdf = {
            title: "Users registered until " + date,
            content: users.map(user => user.email).join("\n")
        };

        dispatch(pdfLoading(true));
        API.printPdfUsers(bodyPdf)
        .then(res => {
            console.log(res);
            dispatch(pdfLoading(false));
        })
        .catch(err => {
            console.log(err);
            dispatch(pdfLoading(true));
        });
    };
}

export const pdfLoading = (isLoading) => {
    return {
        type: PDF_LOADING,
        loadingPdf: isLoading
    };
}