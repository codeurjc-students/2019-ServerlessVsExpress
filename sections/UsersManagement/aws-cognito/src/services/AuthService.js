const AWS = require('aws-sdk');

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.register = (data) => {
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
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.signUp(params, (err, dataSignUp) => {
            if(err) {
                reject(err);
            } else {
                resolve(dataSignUp);
            }
        });
    });
};