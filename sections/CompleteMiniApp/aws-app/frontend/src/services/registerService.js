import axios from 'axios';
import * as Config from '../config/config';
const BASE_URL = Config.BASE_URL_API_BACKEND;

export function register(user) {
    const result = new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/auth/register`, {
            email: user.email,
            password: user.password,
            firstname: user.firstName,
            lastname: user.lastName
        })
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        })
    });
    return result;
}