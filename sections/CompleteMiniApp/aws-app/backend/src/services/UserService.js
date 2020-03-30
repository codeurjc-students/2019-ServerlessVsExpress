const AWS = require('aws-sdk');
const uuid = require('uuid');

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'users_connection';

exports.getUserInfo = (data) => {
    return new Promise((resolve, reject) => {
        if(!data || !data.access_token) {
            reject({statusCode: 401, message: 'You must provide an access_token'});
        }

        const params = {
            AccessToken: data.access_token
        };

        cognitoidentityserviceprovider.getUser(params, (err, dataUser) => {
            if(err) {
                reject({statusCode: 400, message: 'Error finding user'});
            } else {
                resolve(dataUser);
            }
        });
    });
};

exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const params = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID
        };

        cognitoidentityserviceprovider.listUsers(params, (err, users) => {
            if(err) {
                reject({statusCode: 400, message: 'Error getting all the users'});
            } else {
                resolve(users);
            }
        });
    });
};

exports.activateUserFromAdmin = (data) => {
    return new Promise((resolve, reject) => {
        const params = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: data.username
        };

        if(data.activate) {
            cognitoidentityserviceprovider.adminEnableUser(params, (err, users) => {
                if(err) {
                    reject({statusCode: 400, message: 'Error enabling user'});
                } else {
                    resolve(users);
                }
            });
        } else {
            cognitoidentityserviceprovider.adminDisableUser(params, (err, users) => {
                if(err) {
                    reject({statusCode: 400, message: 'Error disabling user'});
                } else {
                    resolve(users);
                }
            });
        }
    });
};

exports.addConnectionInfo = (event) => {
    const body = JSON.parse(event.body);
    
    const params = {
        TableName: table,
        Item: {
            "users_connection_id": uuid.v1(),
            "email": body.email,
            "user_agent": event.headers["User-Agent"],
            "accepted_language": event.headers["Accept-Language"],
            "connected_at": new Date().toISOString()
        }
    };
    return docClient.put(params).promise();
}