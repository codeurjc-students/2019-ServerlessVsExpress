const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: "https://dynamodb.eu-west-3.amazonaws.com"
});

const dbb = new AWS.DynamoDB.DocumentClient();
const { TABLE_NAME } = process.env;

exports.handlerConnect = async (event, context, callback) => {
    const { connectionId } = event.requestContext;

    try {
        let res = await addConnectionDB(connectionId);
        console.log(res);
        const response = {
            statusCode: 200,
            body: 'Connection successful'
        };
        callback(null, response);
    } catch(err) {
        console.log(err);
        const response = {
            statusCode: 500,
            body: `Couldn't connect`
        };
        callback(null, response);
    }
};

exports.handlerDisconnect = async (event, context, callback) => {
    const { connectionId } = event.requestContext;

    try {
        let res = await deleteConnectionDB(connectionId);
        console.log(res);
        const response = {
            statusCode: 200,
            body: 'User disconnected'
        };
        callback(null, response);
    } catch(err) {
        console.log(err);
        const response = {
            statusCode: 500,
            body: `Error disconnecting`
        };
        callback(null, response);
    }  
};

exports.handlerOnMessage = async (event, context, callback) => {  
    try {
        let res = await emitMessage(event);
        console.log(res);
        const response = {
            statusCode: 200,
            body: 'Message sent to all users'
        };
        callback(null, response);
    } catch(err) {
        console.log(err);
        const response = {
            statusCode: 500,
            body: `Error sending message to all users`
        };
        callback(null, response);
    }
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