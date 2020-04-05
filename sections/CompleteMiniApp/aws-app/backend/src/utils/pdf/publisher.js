const AWS = require('aws-sdk');

const sqs = new AWS.SQS({
    apiVersion: '2012-11-05'
});

const publisher = (pdfData) => {
    const params = {
        DelaySeconds: 15,
        MessageBody: JSON.stringify(pdfData),
        QueueUrl: process.env.PDF_QUEUE_URL
    };

    return new Promise((resolve, reject) => {
        sqs.sendMessage(params, (err, data) => {
            if (err) {
                reject(new Error(err));
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = {
    publisher
};