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
        console.log(users);
        res.send({
            error: false,
            code: 200,
            message: 'Users fetched successfully',
            content: users
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

app.post('/users/add', (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.surname
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

// Exposing Server in port 3000
app.listen(3000, () => {
    console.log("Server initialized in port 3000");
});