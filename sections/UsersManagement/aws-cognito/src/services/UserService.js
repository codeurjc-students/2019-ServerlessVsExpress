const AWS = require('aws-sdk');

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.getUserInfo = (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
        if(!data || !data.access_token) {
            reject({statusCode: 401, message: 'You must provide an access_token!'});
        }
        console.log(data.access_token);
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