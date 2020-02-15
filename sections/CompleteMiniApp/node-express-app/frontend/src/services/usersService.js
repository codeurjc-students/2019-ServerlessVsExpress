import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const BASE_URL = 'http://localhost:4000';

export const getUsers = () => {
    const config = {
        headers: {
            Authorization: `Bearer ${cookies.get('access_token')}`
        }
    };
    const result = new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/user/`, config)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    });
    return result;
}

export const activateUser = (email, activate) => {
    const config = {
        headers: {
            Authorization: `Bearer ${cookies.get('access_token')}`
        }
    };
    const result = new Promise((resolve, reject) => {
        axios.put(`${BASE_URL}/user/activate-user-from-admin`, {email, activate}, config)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    });
    return result;
}

export const printUsers = (users) => {
    const config = {
        headers: {
            Authorization: `Bearer ${cookies.get('access_token')}`
        }
    };

    const pdfData = {
        title: 'Users registered',
        users
    };

    const result = new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/user/generateUsersPdf`, {pdfData}, config)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    });
    return result;
}