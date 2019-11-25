const AWS = require('aws-sdk');
const { pdfQueueUrl } = require('./config/config');

// Set the region
AWS.config.update({region: 'eu-west-3'});

// Setting the API version we're going to use for SQS
const sqs = new AWS.SQS({
    apiVersion: '2012-11-05'
});

const publisher = (pdfData) => {
    const params = {
        DelaySeconds: 15,
        MessageBody: JSON.stringify(pdfData),
        QueueUrl: pdfQueueUrl
    };

    return new Promise((resolve, reject) => {
        sqs.sendMessage(params, (err, data) => {
            if (err) {
                console.log("Error", err);
                reject(new Error(err));
            } else {
                console.log("Success", data.MessageId);
                resolve(`Success: ${data}`);
            }
        });
    });
};

module.exports = {
    publisher
};