const AuthService = require('../services/AuthService');

exports.register = async (data) => {
    return await AuthService.register(data);
}