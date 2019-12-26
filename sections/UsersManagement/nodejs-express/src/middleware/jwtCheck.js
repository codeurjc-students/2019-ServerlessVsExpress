const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config');

const jwtCheck = (req, res, next) => {
    const array_access_token = req.headers.authorization;
    const access_token = array_access_token.split(" ")[1];

    if(!access_token) {
        return res.status(401).send('Unauthorized operation');
    }

    jwt.verify(access_token, SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).send(err);
        }
        res.locals.email = decoded.email;
        next();
    });
};

module.exports = jwtCheck;