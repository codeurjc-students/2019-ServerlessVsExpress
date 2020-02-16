const app = require('./server');
const http = require('http').createServer(app);
const { SERVER_PORT } = require('./config/config') || process.env.server_port || 4000;

http.listen(SERVER_PORT, () => console.log(`Server listening on http://localhost:${SERVER_PORT}`));

