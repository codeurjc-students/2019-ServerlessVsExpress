const express = require('express');
const routes = express.Router();
const UserController = require('../controllers/UserController');
const jwtCheck = require('../middleware/jwtCheck');
const roleCheck = require('../middleware/roleCheck');

// Private routes
routes.get('/', [jwtCheck], UserController.getAllUsers);

// Private routes with admin privileges
routes.get('/admins', [jwtCheck, roleCheck], UserController.getAdmins);
routes.put('/activate-user-from-admin', [jwtCheck, roleCheck], UserController.activateUserFromAdmin);

// Public routes
routes.post('/register', UserController.register);
routes.get('/activate?:activation_token', UserController.activate);

module.exports = routes;