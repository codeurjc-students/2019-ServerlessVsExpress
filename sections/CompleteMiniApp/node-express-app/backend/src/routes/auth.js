const express = require('express');
const routes = express.Router();
const AuthController = require('../controllers/AuthController');

routes.post('/login', AuthController.login);
routes.post('/refresh-token', AuthController.refreshToken);
routes.post('/check-valid-token', AuthController.checkValidToken);
routes.post('/logout', AuthController.logout);

module.exports = routes;