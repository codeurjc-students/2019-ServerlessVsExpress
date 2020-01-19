const UserService = require('../services/UserService');

exports.getUserInfo = async (data) => {
    return await UserService.getUserInfo(data);
}