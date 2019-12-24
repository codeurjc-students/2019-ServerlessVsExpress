const MONGO_DB_USER = "franrobles8";
const MONGO_DB_PASSWORD = "fUj0yXIwE33er99z";

module.exports = {
    SERVER_PORT: 4000,
    SECRET: "Aq.?*OxMe;",
    REFRESH_SECRET: "PLKK*;!",
    ACCOUNT_ACTIVATION_SECRET: "aAD?!",
    ACCESS_TOKEN_EXPIRATION_TIME: "5h",
    REFRESH_TOKEN_EXPIRATION_TIME: "20d",
    MONGO_DB_CONNECTION_URL: `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster0-oampc.mongodb.net/db_users_management?retryWrites=true&w=majority`
};