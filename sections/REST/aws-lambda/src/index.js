'use strict';

// dbManager file will have DynamoDB functionality in further changes. For now, it just uses mocked data to test a REST Api
const dbManager = require('./dbManager');

// uuidv1() will allow us to create a random id based in a timestamp. This will avoid the collision of id's 
const uuidv1 = require('uuid/v1');

exports.usersHandler = (event, context, callback) => {

    switch (event.httpMethod) {
        // Checking the path, we can know when a GET/PUT/... event for the same aws lambda function is refered to one or another
        // route
        case 'GET':
            if(event.path === '/users') {
                getAllUsers(callback);
            } else {
                if(event.pathParameters && event.pathParameters.username) {
                    getUser(event.pathParameters.username, callback);
                }
            }
            break;
        case 'POST':
            addUser(event, callback);
            break;
        case 'PUT':
            updateUser(event, callback);
            break;
        case 'DELETE':
            deleteUser(event, callback);
            break;
        default:
            sendResponse(400, `Unsupported method ${event.httpMethod}`, callback);
    }
};

const getAllUsers = (callback) => {
    dbManager.getAllUsers()
    .then((res) => {
        console.log(res);
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const getUser = (username, callback) => {

    dbManager.getUser(username)
    .then((res) => {
        console.log(res);
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const addUser = (event, callback) => {
    const user = JSON.parse(event.body);
    user.userId = uuidv1();

    dbManager.addUser(user)
    .then((res) => {
        console.log(res);
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const updateUser = (event, callback) => {
    const user = JSON.parse(event.body);

    dbManager.updateUser(user)
    .then((res) => {
        console.log(res);
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const deleteUser = (event, callback) => {
    const user = JSON.parse(event.body);

    dbManager.deleteUser(user.userId)
    .then((res) => {
        console.log(res);
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const sendResponse = (statusCode, message, callback) => {
    const res = {
        statusCode: statusCode,
        body: JSON.stringify(message)
    };
    callback(null, res);
};