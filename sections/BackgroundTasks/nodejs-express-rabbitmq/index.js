const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
const { publisher } = require('./publisher');
const { consumer } = require('./consumer');

// Middlewares

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Application test landing page!')
});

app.post('/generatePdf', (req, res) => {
    if(!req.body || !req.body.pdfData) {
        res.send('pdfData is missing...');
    } else {
        amqp.connect('amqp://localhost', (err, conn) => {
            if(err) {
                console.error(err);
                process.exit(1);
            }
            consumer(conn);
            publisher(conn, req.body.pdfData);
        });
        res.send('Your pdf has been generated!');
    }
});

app.listen(3000, () => console.log('App listening on port 3000!'));