const UserController = require('./controllers/UserController');

exports.connectionDbHandlerOptions = async (event, context, callback) => {
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

exports.connectionDbHandler = async (event, context, callback) => {
    console.log(event);
    console.log(context);

    switch(event.httpMethod) {
        case 'POST':
                try {
                    const res = await UserController.addConnectionInfo(event);
                    sendResponse(201, res, callback);
                } catch(err) {
                    console.log(err);
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
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials' : true
        },
        body: JSON.stringify(message)
    };
    callback(null, res);
};