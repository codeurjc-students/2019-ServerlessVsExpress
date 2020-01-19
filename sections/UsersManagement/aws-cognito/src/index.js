const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');

exports.authHandler = async (event, context, callback) => {
    console.log(event);
    console.log(context);
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
                    case '/user/info':
                            try{
                                const data = JSON.parse(event.body);
                                const res = await UserController.getUserInfo(data);
                                console.log(res);
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
        body: JSON.stringify(message)
    };
    callback(null, res);
};