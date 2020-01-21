const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');

exports.optionsHandler = async (event, context, callback) => {
    const res = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
        },
        body: JSON.stringify('Headers for cors accepted')
    };
    callback(null, res);
};

exports.userHandler = async (event, context, callback) => {
    const challenge = event.path;
    switch (event.httpMethod) {
        case 'GET':
                switch(challenge) {
                    case '/user':
                            try{
                                const res = await UserController.getAllUsers();
                                sendResponse(200, res, callback);
                            } catch(err) {
                                console.log(err);
                                sendResponse(err.statusCode, err.message, callback);
                            }
                        break;
                }
                break;
        case 'POST':
                switch(challenge) {
                    case '/user/info':
                            try{
                                const data = JSON.parse(event.body);
                                const res = await UserController.getUserInfo(data);
                                sendResponse(200, res, callback);
                            } catch(err) {
                                console.log(err);
                                sendResponse(err.statusCode, err.message, callback);
                            }
                        break;
                }
                break;
        case 'PUT':
                switch(challenge) {
                    case '/user/activate-user-from-admin':
                            try{
                                const data = JSON.parse(event.body);
                                const res = await UserController.activateUserFromAdmin(data);
                                sendResponse(200, res, callback);
                            } catch(err) {
                                console.log(err);
                                sendResponse(err.statusCode, err.message, callback);
                            }
                        break;
                }
                break;
        default:
            sendResponse(400, `Unsupported method ${event.httpMethod}`, callback);
    }
};

const sendResponse = (statusCode, message, callback) => {
    const res = {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials' : true, // Required for cookies
        },
        body: JSON.stringify(message)
    };
    callback(null, res);
};