require('dotenv').config();

const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_DB_USER = process.env.MONGO_DB_USER;
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;

// If your MongoDB is inside another cluster, the url may vary...
module.exports = {
    SERVER_PORT: 4000,
    SECRET: "Aq.?*OxMe;",
    REFRESH_SECRET: "PLKK*;!",
    ACCOUNT_ACTIVATION_SECRET: "aAD?!",
    ACCESS_TOKEN_EXPIRATION_TIME: "5h",
    REFRESH_TOKEN_EXPIRATION_TIME: "20d",
    MONGO_DB_CONNECTION_URL: `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster0-oampc.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`
};