const AuthController = require('./controllers/AuthController');

exports.usersHandler = async (event, context, callback) => {
    console.log(event);
    console.log(context);
    switch (event.httpMethod) {
        case 'GET':
                sendResponse(200, `Received ${event.httpMethod} method!`, callback);
                break;
        case 'POST':
                try{
                    const data = JSON.parse(event.body);
                    await AuthController.register(data);
                    sendResponse(201, `User has been registered successfully!`, callback);
                } catch(err) {
                    sendResponse(err.statusCode, err.message, callback);
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