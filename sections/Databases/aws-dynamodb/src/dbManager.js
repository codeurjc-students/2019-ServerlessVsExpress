const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: "https://dynamodb.eu-west-3.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'users';

// This is a DB simulation. Data should be managed with a real database inside functions.

const getAllUsers = () => {
    const params = {
        TableName: table
    };

    return docClient.scan(params).promise();
};

const addUser = (data) => {
    const params = {
        TableName: table,
        Item: {
            "userid": uuid.v1(),
            "name": data.name,
            "email": data.email,
            "age": data.age
        }
    };

    return docClient.put(params).promise();
};

const updateUser = (data) => {
    const params = {
        TableName: table,
        Key: {
            "userid": data.userid
        },
        UpdateExpression: "set #na = :n, email = :e, age = :a",
        ExpressionAttributeNames: { // Used when there are reserved words in DynamoDB, like name
            "#na": 'name'
        },
        ExpressionAttributeValues: {
            ":n": data.name,
            ":e": data.email,
            ":a": data.age
        },
        ReturnValues: "ALL_OLD" // Returns the item content before it was updated
    };

    return docClient.update(params).promise();
};

const deleteUser = (userid) => {
    const params = {
        TableName: table,
        Key: {
            "userid": userid
        },
        ConditionExpression: "userid = :userid",
        ExpressionAttributeValues: {
            ":userid": userid
        },
        ReturnValues: "ALL_OLD" // Returns the item content before it was deleted
    };

    return docClient.delete(params).promise();
};

module.exports = {
    getAllUsers,
    addUser,
    updateUser,
    deleteUser
};