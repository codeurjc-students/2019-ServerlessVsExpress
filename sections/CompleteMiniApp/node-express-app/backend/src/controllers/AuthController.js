const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { 
    SECRET, 
    REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRATION_TIME,
    REFRESH_TOKEN_EXPIRATION_TIME
} = require('../config/config');
const UserModel = require('../models/user');

class AuthController {
    static login = (req, res) => {
        const { email, password } = req.body;

        if(!(email && password)) {
            return res.status(400).send({message: 'Error, email or password missing'});
        }
        
        const jwtPayload = {
            email
        };

        // Search in the database
        UserModel.findOne({email: email}, (err, user_db) => {
            if(err) {
                return res.status(401).send({message: 'An error happened while using the database'});
            }
            
            if(!user_db) {
                return res.status(401).send({message: `User doesn't exist`});
            }

            // If user exists, we compare the encripted password with the one in the database
            bcrypt.compare(password, user_db.password, (err, result) => {
                if(err) {
                    return res.status(401).send({message: 'An error happened while using the bcrypt'});
                }

                // If password doesn't match (result === false), we sent an error
                if(!result) {
                    return res.status(401).send({message: `Wrong password`});
                }

                // If email and password are ok, we check if it's activated
                if(user_db.activated === "PENDING") {
                    return res.status(401).send({message: `Password is not verified`});
                }

                // Set the user as connected
                const updated_user = {
                    ...user_db.toObject(),
                    connected: true
                };
                
                UserModel.findOneAndUpdate({_id: user_db.id}, updated_user, (err) => {
                    if(err) {
                        return res.status(401).send({message: "Error trying to update user's connected attribute in the database"});
                    }

                    // If user is activated, we create new access_token and refresh_token
                    // Sign tokens
                    const access_token = jwt.sign(jwtPayload, SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });
                    const refresh_token = jwt.sign(jwtPayload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });

                    return res.status(200).send({
                        email: user_db.email,
                        role: user_db.role,
                        access_token,
                        refresh_token
                    });
                });
            });
        });
    };

    static refreshToken = (req, res) => {
        if(!req.headers.authorization) {
            return res.status(401).send({message: "Unauthorized operation. Refresh token is missing."});
        }

        const array_refresh_token = req.headers.authorization;
        const refresh_token = array_refresh_token.split(" ")[1];

        // If refresh token doesn't exist, they must login again to create new tokens
        if(!refresh_token) {
            return res.status(401).send({message: "Unauthorized operation. You must login."});
        }

        // If refresh_token exists, verify that hasn't expired
        jwt.verify(refresh_token, REFRESH_SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).send({message: "Invalid refresh token."});
            }

            // If refresh_token hasn't expired, sign a new access_token
            const access_token = jwt.sign({ email: decoded.email }, SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });

            return res.status(201).send({
                access_token
            });
        });
    };

    static checkValidToken = (req, res) => {
        if(!req.headers.authorization) {
            return res.status(401).send({message: "Unauthorized operation."});
        }

        const array_access_token = req.headers.authorization;
        const access_token = array_access_token.split(" ")[1];

        // If refresh token doesn't exist, they must login again to create new tokens
        if(!access_token) {
            return res.status(401).send({message: "Unauthorized operation."});
        }

        // If refresh_token exists, verify that hasn't expired
        jwt.verify(access_token, SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).send({message: "Invalid access token."});
            }

            return res.status(201).send({
                access_token
            });
        });
    };

    static logout = (req, res) => {
        const { email } = req.body;

        if(!req.headers.authorization) {
            return res.status(401).send({message: "Unauthorized operation."});
        }

        const array_access_token = req.headers.authorization;
        const access_token = array_access_token.split(" ")[1];

        if(!access_token) {
            return res.status(401).send({message: "Unauthorized operation."});
        }

        // If refresh_token exists, verify that hasn't expired
        jwt.verify(access_token, SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).send({message: "Invalid access token."});
            }

            UserModel.findOne({email: email}, (err, user_db) => {
                if(err) {
                    return res.status(401).send({message: "Error from database while trying to find the user."});
                }
                
                if(!user_db) {
                    return res.status(401).send({message: `User doesn't exist.`});
                }

                // Set the user as disconnected
                const updated_user = {
                    ...user_db.toObject(),
                    connected: false
                };

                UserModel.findOneAndUpdate({_id: user_db.id}, updated_user, (err) => {
                    if(err) {
                        return res.status(401).send({message: "Error from database when trying to update user's connected attribute."});
                    }
                    res.status(204).send();
                });
            });
        });
    };
}

module.exports = AuthController;