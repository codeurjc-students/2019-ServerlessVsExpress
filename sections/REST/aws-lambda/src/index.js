'use strict';

// dbManager file will have DynamoDB functionality in further changes. For now, it just uses mocked data to test a REST Api
const dbManager = require('./dbManager');

exports.usersHandler = (event, context, callback) => {
    switch (event.httpMethod) {
        case 'GET':
            getAllUsers(callback);
            break;
        default:
            sendResponse(400, `Unsupported method ${event.httpMethod}`, callback);
    }
};

const getAllUsers = (callback) => {
    dbManager.getAllUsers()
    .then((res) => {
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