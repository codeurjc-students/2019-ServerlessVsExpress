const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: "https://dynamodb.eu-west-3.amazonaws.com"
});

const db = AWS.DynamoDB.DocumentClient();

exports.handlerConnect = async (event, context, callback) => {
    const { connectionId } = event.requestContext;
    addConnectionDB(connectionId)
        .then(() => {
            callback(null, { statusCode: 200 });
        })
        .catch((err) => 
            console.log(err)
        );
};

exports.handlerDisconnect = async (event, context, callback) => {
    const { connectionId } = event.requestContext;
    deleteConnectionDB(connectionId)
        .then(() => {
            callback(null, { statusCode: 200 });
        })
        .catch((err) => 
            console.log(err)
        );
};

exports.handlerOnMessage = async (event, context, callback) => {
    const { connectionId } = event.requestContext;
    deleteConnectionDB(connectionId)
        .then(() => {
            callback(null, { statusCode: 200 });
        })
        .catch((err) => 
            console.log(err)
        );
};


const addConnectionDB = (connectionId) => {
    return db.put({
        TableName: 'websockets-table',
        Item: {connectionid: connectionId}
    }).promise();
};

const deleteConnectionDB = (connectionId) => {
    return db.delete({
        TableName: 'websockets-table',
        Key: {connectionid: connectionId}
    }).promise();
};