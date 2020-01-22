const UserService = require('../services/UserService');

exports.getUserInfo = async (data) => {
    return await UserService.getUserInfo(data);
}

exports.getAllUsers = async () => {
    return await UserService.getAllUsers();
}

exports.activateUserFromAdmin = async (data) => {
    return await UserService.activateUserFromAdmin(data);
}