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

exports.authHandler = async (event, context, callback) => {
    switch (event.httpMethod) {
        case 'GET':
                sendResponse(200, `Received ${event.httpMethod} method!`, callback);
                break;
        case 'POST':
                const challenge = event.path;

                switch(challenge) {
                    case '/auth/register':
                            try{
                                const data = JSON.parse(event.body);
                                await AuthController.register(data);
                                sendResponse(201, `User has been registered successfully!`, callback);
                            } catch(err) {
                                sendResponse(err.statusCode, err.message, callback);
                            }
                        break;
                    case '/auth/login':
                            try{
                                const data = JSON.parse(event.body);
                                const res = await AuthController.login(data);
                                sendResponse(200, res, callback);
                            } catch(err) {
                                sendResponse(err.statusCode, err.message, callback);
                            }
                        break;
                    case '/auth/refresh-token':
                            try{
                                const data = JSON.parse(event.body);
                                const res = await AuthController.refreshToken(data);
                                sendResponse(200, res, callback);
                            } catch(err) {
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