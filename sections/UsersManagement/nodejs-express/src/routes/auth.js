const express = require('express');
const routes = express.Router();
const AuthController = require('../controllers/AuthController');

routes.post('/login', AuthController.login);
routes.post('/refresh-token', AuthController.refreshToken);

module.exports = routes;