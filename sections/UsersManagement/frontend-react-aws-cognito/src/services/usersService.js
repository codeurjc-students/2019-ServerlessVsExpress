import axios from 'axios';
import Cookies from 'universal-cookie';
import * as Config from '../config/config';
const cookies = new Cookies();

const BASE_URL = Config.BASE_URL_API_BACKEND;

export const getUsers = () => {
    const config = {
        headers: {
            Authorization: `Bearer ${cookies.get('id_token')}`
        }
    };
    const result = new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/user`, config)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    });
    return result;
}

export const activateUser = (username, activate) => {
    const config = {
        headers: {
            Authorization: `Bearer ${cookies.get('id_token')}`
        }
    };
    const result = new Promise((resolve, reject) => {
        axios.put(`${BASE_URL}/user/activate-user-from-admin`, {username, activate}, config)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    });
    return result;
}

export const getUserInfo = (idToken, accessToken) => {
    const config = {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    };
    const result = new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/user/info`, {access_token: accessToken}, config)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    });
    return result;
};