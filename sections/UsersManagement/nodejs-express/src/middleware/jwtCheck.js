const jwt = require('jsonwebtoken');
const { SECRET, REFRESH_SECRET } = require('../config/config');

const jwtCheck = (req, res, next) => {
    const access_token = req.headers["access_token"];

    if(!access_token) {
        return res.status(401).send('Unauthorized operation');
    }

    jwt.verify(access_token, SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).send(err);
        }
        next();
    });
};

module.exports = jwtCheck;