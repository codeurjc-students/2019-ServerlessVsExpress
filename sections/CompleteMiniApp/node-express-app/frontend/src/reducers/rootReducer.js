import { combineReducers } from 'redux';
import users from './usersReducer';
import login from './loginReducer';
import register from './registerReducer';

const rootReducer =  combineReducers({
    login: login,
    users: users,
    register: register
});

export default rootReducer;