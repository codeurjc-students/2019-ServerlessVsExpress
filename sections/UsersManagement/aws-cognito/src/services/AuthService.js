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

        cognitoidentityserviceprovider.signUp(params, (err, dataSignUp) => {
            if(err) {
                reject(err);
            } else {
                resolve(dataSignUp);
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