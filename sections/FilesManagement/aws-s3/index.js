const AWS = require('aws-sdk');

// Configure S3 object to use the API functionality of 2006-03-01 version
const S3 = new AWS.S3({apiVersion: '2006-03-01'});

// Set your bucket name, where you will handle the files
const bucket = 'franrobles8-filehandling-bucket';


exports.filesHandler = (event, context, callback) => {
    console.log(event);
    let bodyData = {};
    let fileName = "";

    switch (event.httpMethod) {
        case 'GET':
            // Gets an object by name
            // path params: fileName (String)
            fileName = event.pathParameters.fileName;
            getObject(fileName, callback);
            break;
        case 'POST':
        case 'PUT':
            // Creates/Updates an object
            // Params: fileName (String), data: (Binary, String)
            bodyData = JSON.parse(event.body);
            writeObject(bodyData, callback);
            break;
        case 'DELETE':
            // Deletes an object
            // path params: fileName (String)
            fileName = event.pathParameters.fileName;
            deleteObject(fileName, callback);
            break;
        default:
            sendResponse(400, `Unsupported method ${event.httpMethod}`, callback);
    }
};

const sendResponse = (statusCode, message, callback) => {
    const res = {
        statusCode: statusCode,
        body: JSON.stringify(message)
    };
    callback(null, res);
};

// Used to write a new object, or update an existent (it changes the metadata, for example, with a new last modified date)
const writeObject = (data, callback) => {
    const params = {
        Bucket: bucket,
        Key: data.fileName,
        Body: data.data
    };

    return S3.putObject(params, (err, dataObject) => {
        if(err) {
            console.log(err, err.stack);
            sendResponse(500, `Error trying to add the file ${data.fileName}`, callback);
        } else {
            console.log(dataObject);
            sendResponse(201, `File/Object ${data.fileName} was created/updated successfully`, callback);
        }
    });
};

const getObject = (fileName, callback) => {
    const params = {
        Bucket: bucket,
        Key: fileName
    };

    return S3.getObject(params, (err, dataObject) => {
        if(err) {
            console.log(err, err.stack);
            sendResponse(500, `Error trying to get the file ${fileName}`, callback);
        } else {
            console.log(dataObject);
            // As the data returned from getObject contains a lot of meta-data and
            // the body is buffered, we must parse it to whatever we need, in our case, a string
            sendResponse(200, {content: dataObject.Body.toString('utf-8')}, callback);
        }
    });
};

const deleteObject = (fileName, callback) => {
    const params = {
        Bucket: bucket,
        Key: fileName
    };

    return S3.deleteObject(params, (err, dataObject) => {
        if(err) {
            console.log(err, err.stack);
            sendResponse(500, `Error trying to delete the file ${fileName}`, callback);
        } else {
            console.log(dataObject);
            sendResponse(200, `Object with name ${fileName} couldn't be deleted`, callback);
        }
    });
};

