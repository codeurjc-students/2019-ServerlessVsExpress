const AWS = require('aws-sdk');

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.getUserInfo = (data) => {
    return new Promise((resolve, reject) => {
        if(!data || !data.access_token) {
            reject({statusCode: 401, message: 'You must provide an access_token!'});
        }

        const params = {
            AccessToken: data.access_token
        };

        cognitoidentityserviceprovider.getUser(params, (err, dataUser) => {
            if(err) {
                reject(err);
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
                reject(err);
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
                    reject(err);
                } else {
                    resolve(users);
                }
            });
        } else {
            cognitoidentityserviceprovider.adminDisableUser(params, (err, users) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });
        }
    });
};