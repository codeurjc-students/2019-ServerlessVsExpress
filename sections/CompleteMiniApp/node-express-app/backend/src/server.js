const express = require('express');
const session = require('express-session');
const cors = require('cors');
const router = express.Router();
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const { SERVER_PORT } = require('./config/config') || process.env.server_port || 4000;
const { sendConnectedAdminsPeriodically } = require('./helpers/connectedAdmins');

// Using middlewares
app.use(cors());
router.use(express.json());

// Routes will be like "/auth/login"
router.use('/auth', authRouter);

// Routes to get data
router.use('/user', userRouter);

app.use('/', router);

/*io.on('connection', (socket) => {
    console.log('An user has been connected!');
    socket.on('disconnect', () => {
        console.log('An user has been disconnected');
    });

    setInterval(() => sendConnectedAdminsPeriodically(socket), 10000);
});*/

//http.listen(SERVER_PORT, () => console.log(`Server listening on http://localhost:${SERVER_PORT}`));

module.exports = app;