const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Using middlewares to parse json response objects
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('API route works!');
});

// Exposing Server in port 3000
app.listen(3000, () => {
    console.log("Server initialized in port 3000");
});