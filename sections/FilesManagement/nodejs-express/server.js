const express = require('express');
const app = express();
const fs = require('fs');
const ErrorsDescriber = require('./fileErrors');

// Middlewares

app.use(express.json());

// Routes

// Getting all the users from file users.json Synchronously
app.route('/sync/users').get((req, res) => {
    try {
        let readData = fs.readFileSync('users.json', 'utf-8');
        responseObject(null, readData, res);
    } catch(err) {
        responseObject(err, {}, res);
    }
});

// Getting all the users from file users.json Asynchronously
app.route('/async/users').get((req, res) => {
    fs.readFile('users.json', 'utf-8', (err, data) => {
        responseObject(err, data, res);
    }); 
});

// Adding a new user to users.json file Synchronously
app.route('/sync/users').post((req, res) => {
    try {
        let readData = fs.readFileSync('users.json', 'utf-8');
        readData = JSON.parse(readData);

        readData.users.push({
            name: req.body.name ? req.body.name : "",
            email: req.body.email ? req.body.email : "",
            age: req.body.age ? req.body.age : -1
        });
        
        readData = JSON.stringify(readData);
        fs.writeFileSync('users.json', readData);
        responseObject(null, readData, res);
    } catch(err) {
        responseObject(err, {}, res);
    }
});

// Adding a new user to users.json file Asynchronously
app.route('/async/users').post((req, res) => {
    fs.readFile('users.json', 'utf-8', (err, data) => {
        if(!err) {
            data = JSON.parse(data);
            data.users.push({
                name: req.body.name ? req.body.name : "",
                email: req.body.email ? req.body.email : "",
                age: req.body.age ? req.body.age : -1
            });
            
            data = JSON.stringify(data);
            fs.writeFile('users.json', data, err => {
                responseObject(err, data, res);
            });
        }
    }); 
});

// Route to create a new file with the indicated name in fileName's body attribute
app.route('/async/create').post((req, res) => {
    if(req.body.fileName) {
        fs.writeFile(req.body.fileName, `File's name: ${req.body.fileName}`, err => {
            responseObject(err, JSON.stringify({}), res);
            console.log("Created file!");
        });
    } else {
        const error = {
            code: 503,
            path: ''
        };
        responseObject(error, {}, res);
    }
});

// Route to append new data to a file (if the file doesn't exist, it creates it)
app.route('/async/append').put((req, res) => {
    if(req.body.fileName && req.body.appendData) {
        fs.appendFile(req.body.fileName, req.body.appendData, err => {
            responseObject(err, JSON.stringify({}), res);
            console.log("Appended data!");
        });
    } else {
        const error = {
            code: 503,
            path: ''
        };
        responseObject(error, {}, res);
    }
});

// Route to rename a file
app.route('/async/rename').put((req, res) => {
    if(req.body.oldFileName && req.body.newFileName) {
        fs.rename(req.body.oldFileName, req.body.newFileName, err => {
            responseObject(err, JSON.stringify({}), res);
            console.log("File renamed!");
        });
    } else {
        const error = {
            code: 503,
            path: ''
        };
        responseObject(error, {}, res);
    }
});

// Route to delete an existent file indicating the file's name
app.route('/async/delete').delete((req, res) => {
    if(req.body.fileName) {
        fs.unlink(req.body.fileName, err => {
            responseObject(err, JSON.stringify({}), res);
            console.log("Deleted file!");
        });
    } else {
        const error = {
            code: 503,
            path: ''
        };
        responseObject(error, {}, res);
    }
});

const responseObject = (error, data, res) => {
    if(!error) {
        res.send({
            status: 200,
            data: JSON.parse(data)
        });
    } else {
        res.send({
            status: 404,
            data: {},
            error: ErrorsDescriber.fileError(error.code, error.path)
        });
    }
};

app.listen(3000, () => console.log(`Server running on port 3000`));
