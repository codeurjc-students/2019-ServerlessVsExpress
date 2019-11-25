const { publisher } = require('./publisher');
const { consumer } = require('./consumer');

exports.pdfSenderHandler = async (event, context, callback) => {
    switch (event.httpMethod) {
        case 'POST':
            if(event.body && JSON.parse(event.body).title && JSON.parse(event.body).content) {
                try {
                    await publisher({title: JSON.parse(event.body).title, content: JSON.parse(event.body).content});
                    sendResponse(201, `Pdf information has been sent to a queue to be processed!`, callback);
                } catch(err) {
                    console.log("Publisher error: ", err);
                    sendResponse(500, `An internal error happened while creating the pdf!`, callback);
                }
            } else {
                sendResponse(500, `The request's body needs a title and a content`, callback);
            }
            break;
        default:
            sendResponse(400, `Unsupported method ${event.httpMethod}`, callback);
    }
};

exports.queueProcessingHandler = async (event, context, callback) => {
    // When this lambda is triggered from the queue, it receives the message and deletes it if didn't happen any error.
    // In the background, it would be the same that doing sqs.receiveMessage(params, (err, res)) and sqs.deleteMessage(params, (err, res))
    // but the trigger does it automatically
    if(event.Records) {
        console.log("Consumer working...", event);
        let bodyPdfMessage = event.Records[0].body;
        try {
            await consumer(bodyPdfMessage);
            sendResponse(201, `The pdf has been created from the message.`, callback);
        } catch(err) {
            console.log(err);
            sendResponse(500, `Error creating from the message.`, callback);
        }
    }
    sendResponse(200, '', callback);
};

const sendResponse = (statusCode, message, callback) => {
    const res = {
        statusCode: statusCode,
        body: JSON.stringify(message)
    };
    callback(null, res);
};