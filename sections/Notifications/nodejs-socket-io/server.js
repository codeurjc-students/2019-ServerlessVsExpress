const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Middleware used to be able to import static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (err, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// var to control the current max bid
let currentBidAmount = 0;

io.on('connection', (socket) => {
    console.log('An user has been connected!');
    socket.on('disconnect', () => {
        console.log('An user has been disconnected');
    });

    socket.on('incoming bid', (msg) => {
        msg.user = `user-${socket.id}`;
        if(parseFloat(msg.amount) > parseFloat(currentBidAmount)) {
            currentBidAmount = msg.amount;
            // Broadcast the message to all the users connected
            io.emit('bid history', msg);
        }
    });

});


http.listen(3000, () => console.log('App listening on port 3000'));