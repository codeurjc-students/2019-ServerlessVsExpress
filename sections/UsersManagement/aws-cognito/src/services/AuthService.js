const AWS = require('aws-sdk');

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.register = (data) => {
    return new Promise((resolve, reject) => {
        const params = {
            ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
            Password: data.password,
            Username: data.email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: data.email
                }
            ],
            ValidationData: [
                {
                    Name: 'email',
                    Value: data.email
                }
            ]
        };

        cognitoidentityserviceprovider.signUp(params, async (err, dataSignUp) => {
            if(err) {
                reject(err);
            } else {
                // Add user to group 'users group'
                try {
                    await addUserToGroup(params.Username);
                    resolve(dataSignUp);
                } catch(err) {
                    reject(err);
                }
                
            }
        });
    });
};

const addUserToGroup = (username) => {
    return new Promise((resolve, reject) => {
        const params = {
            GroupName: process.env.COGNITO_DEFAULT_USER_GROUP_NAME,
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: username
        };
        
        cognitoidentityserviceprovider.adminAddUserToGroup(params, function(err, data) {
            if (err) {
                console.log("Error adding user to group");
                reject(err);
            } else {
                console.log("Success adding user to group");
                resolve(data);
            }
        });
    });
};

exports.login = (data) => {
    return new Promise((resolve, reject) => {
        if(!data || !data.email || !data.password) {
            reject({statusCode: 400, message: 'email or password is missing'});
        }

        const params = {
            ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
            AuthFlow: 'USER_PASSWORD_AUTH',
            AuthParameters: {
                USERNAME: data.email,
                PASSWORD: data.password
            }
        };

        cognitoidentityserviceprovider.initiateAuth(params, (err, dataLogin) => {
            if(err) {
                reject(err);
            } else {
                resolve(dataLogin);
            }
        });
    });
};

exports.refreshToken = (data) => {
    return new Promise((resolve, reject) => {
        if(!data || !data.refresh_token) {
            reject({statusCode: 400, message: 'refresh token is missing'});
        }

        const params = {
            ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            AuthParameters: {
                REFRESH_TOKEN: data.refresh_token
            }
        };

        cognitoidentityserviceprovider.initiateAuth(params, (err, dataLogin) => {
            if(err) {
                reject(err);
            } else {
                resolve(dataLogin);
            }
        });
    });
};