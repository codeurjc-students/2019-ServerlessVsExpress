const express = require('express');
const routes = express.Router();
const UserController = require('../controllers/UserController');
const jwtCheck = require('../middleware/jwtCheck');

routes.get('/', [jwtCheck], UserController.getAllUsers);
routes.get('/:id([0-9]+)', [jwtCheck], UserController.getUser);
routes.post('/register', UserController.register);
routes.get('/activate?:activation_token', UserController.activate);

module.exports = routes;