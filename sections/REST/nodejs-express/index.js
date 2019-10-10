const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const services = require("./mockup-services");

// Using middlewares to parse json response objects
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('API route works!');
});

app.get('/users', (req, res) => {
    services.getAllUsers()
    .then((users) => {
        res.send({
            error: false,
            code: 200,
            message: 'Users fetched successfully',
            data: users
        });
    })
    .catch((err) => {
        res.send({
            error: true,
            code: 200,
            message: err
        });
    });
    
});

app.get('/user/:username', (req, res) => {
    services.getUser(req.params.username)
    .then((user) => {
        res.send({
            error: false,
            code: 201,
            message: `${user.username} has been found!`,
            data: user
        });
    })
    .catch((err) => {
        res.send({
            error: true,
            code: 200,
            message: err
        });
    });
});

app.post('/user', (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.surname,
        name: req.body.name,
        lastname: req.body.lastname
    };

    services.addUser(user)
    .then((user) => {
        res.send({
            error: false,
            code: 201,
            message: `${user.username} added successfully!`
        });
    })
    .catch((err) => {
        res.send({
            error: true,
            code: 200,
            message: err
        });
    });
    
});

app.put('/user', (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.surname,
        name: req.body.name,
        lastname: req.body.lastname
    };

    services.updateUser(user)
    .then((user) => {
        res.send({
            error: false,
            code: 200,
            message: `${user.username} updated successfully!`
        });
    })
    .catch((err) => {
        res.send({
            error: true,
            code: 200,
            message: err
        });
    });
    
});

app.delete('/user', (req, res) => {
    const user = {
        username: req.body.username
    };

    services.deleteUser(user)
    .then((user) => {
        res.send({
            error: false,
            code: 200,
            message: `${user.username} deleted successfully!`
        });
    })
    .catch((err) => {
        res.send({
            error: true,
            code: 200,
            message: err
        });
    });
    
});

// If a route doesn't exist, use this middleware to show a 404 error message
app.use((req, res, next) => {
    res.status(404).send({
        error: true,
        code: 404,
        message: "Url not found!"
    });
});

// Exposing Server in port 3000
app.listen(3000, () => {
    console.log("Server initialized in port 3000");
});