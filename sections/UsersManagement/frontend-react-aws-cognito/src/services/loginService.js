import axios from 'axios';
import Cookies from 'universal-cookie';
import * as Config from '../config/config';
const cookies = new Cookies();
const BASE_URL = Config.BASE_URL_API_BACKEND;

export function authenticate(email, password) {

    const result = new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/auth/login`, {
            email,
            password
        })
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    });

    return result;
}

export function checkValidToken() {

    const config = {
        headers: {
            Authorization: `Bearer ${cookies.get('id_token')}`
        }
    };

    const result = new Promise((resolve, reject) => {
        if(!cookies.get('id_token') || !cookies.get('access_token')) return reject(null);
        axios.post(`${BASE_URL}/user/info`, {access_token: cookies.get('access_token')}, config)
            .then((res) => resolve(res))
            .catch((err) => {
                //reject(err)
                // If token not valid, try to refresh tokens
                refreshToken().then(res => resolve(res)).catch(err => reject(err));
            });
    });

    return result;
}

export const decodeIdToken = (idToken) => {
    var payload = idToken.split('.')[1];
    try {
        const decodedPayload = JSON.parse(atob(payload).toString('utf8'));
        return decodedPayload;
    } catch (err) {
        return {};
    }
}

export const refreshToken = () => {
    const result = new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/auth/refresh-token`, {refresh_token: cookies.get('refresh_token')})
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    });

    return result;
}