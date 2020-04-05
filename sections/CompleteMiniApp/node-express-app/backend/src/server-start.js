const app = require('./server');
const http = require('http').createServer(app);
const { SERVER_PORT } = require('./config/config') || process.env.server_port || 4000;
const io = require('socket.io')(http);
const { sendConnectedAdminsPeriodically } = require('./helpers/connectedAdmins');

io.on('connection', (socket) => {
    console.log('An user has been connected!');
    socket.on('disconnect', () => {
        console.log('An user has been disconnected');
    });

    setInterval(() => sendConnectedAdminsPeriodically(socket), 10000);
});

http.listen(SERVER_PORT, () => console.log(`Server listening on http://localhost:${SERVER_PORT}`));

