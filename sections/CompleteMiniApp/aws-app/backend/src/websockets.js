const AWS = require('aws-sdk');

const dbb = new AWS.DynamoDB.DocumentClient();
const { TABLE_NAME } = process.env;

exports.handlerConnect = async (event, context, callback) => {
    const { connectionId } = event.requestContext;

    try {
        await addConnectionDB(connectionId);
        sendResponse(200, 'Connection successful', callback);
    } catch(err) {
        console.log(err);
        sendResponse(500, `Couldn't connect`, callback);
    }
};

exports.handlerDisconnect = async (event, context, callback) => {
    const { connectionId } = event.requestContext;

    try {
        await deleteConnectionDB(connectionId);
        sendResponse(200, `User disconnected`, callback);
    } catch(err) {
        console.log(err);
        sendResponse(500, `Error disconnecting`, callback);
    }  
};

exports.handlerOnMessage = async (event, context, callback) => {  
    try {
        await emitMessage(event);
        sendResponse(200, `Message sent to all users`, callback);
    } catch(err) {
        console.log(err);
        sendResponse(500, `Error sending message to all users`, callback);
    }
};

const sendResponse = (statusCode, message, callback) => {
    const res = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials" : true, // Required for cookies
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
        },
        body: JSON.stringify(message)
    };
    callback(null, res);
};


const addConnectionDB = (connectionId) => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            "connectionid": connectionId
        }
    };

    return dbb.put(params).promise();
};

const deleteConnectionDB = (connectionId) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            "connectionid": connectionId
        }
    };

    return dbb.delete(params).promise();
};

const emitMessage = async (event) => {
    let posted;
    try {
        const connectedIds = await getAllConnectedIds();
        posted = connectedIds.Items.map(async (item) => {
            console.log(`ConnectionId: ${item.connectionid}`);
            try {
                await sendMessage(event, item.connectionid);
            } catch(error) {
                console.log(error);
            }
        });
    } catch(err) {
        console.log(err);
    }

    try {
        return Promise.all(posted);
    } catch(err) {
        console.log(err);
    }
};

const getAllConnectedIds = () => {
    const params = {
        TableName: TABLE_NAME,
        ProjectionExpression: 'connectionid'
    };

    return dbb.scan(params).promise();
};

const sendMessage = (event, connectionId) => {
    const body = JSON.parse(event.body);
    const data = body.data;
    const { domainName, stage } = event.requestContext;
    const endpoint = `${domainName}/${stage}`;

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: endpoint
    });

    const params = {
        ConnectionId: connectionId,
        Data: JSON.stringify(data)
    };

    return apigwManagementApi.postToConnection(params).promise();
};