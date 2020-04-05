
// Connection to the database
require('../db/database');

const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { publisher } = require('../background-tasks-manager/publisher');
const { consumer } = require('../background-tasks-manager/consumer');
const amqp = require('amqplib/callback_api');

class UserController {
    static getAllUsers = (req, res) => {
        UserModel.find({}, '-password',  (err, users) => {
            if(err) {
                return res.status(401).send({message: `Database error when trying to fetch all the users`});
            }
            return res.status(200).send(users);
        });
    };

    static getAdmins = (req, res) => {
        // Search admin users hidding their password
        UserModel.find({role: 'ADMIN'}, '-password',  (err, users) => {
            if(err) {
                return res.status(401).send({message: `Database error when trying to fetch all the admins`});
            }
            return res.status(200).send(users);
        });
    };

    static register = (req, res) => {
        if(!req.body) {
            return res.status(400).send({message: 'Body parameters are missing'});
        }

        if(!(req.body.email && req.body.password)) {
            return res.status(400).send({message: 'Wrong body parameters'});
        }

        const newUser = new UserModel({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            firstName: req.body.firstName ? req.body.firstName : '',
            lastName: req.body.lastName ? req.body.lastName : '',
            role: "USER"
        });

        newUser.save(async (err) => {
            if(err) {
                return res.status(400).send({message: 'Database error when trying to save the user'});
            }
            
            // The user has been created, but the account needs to be activated with a link! 
            // We'll use a fake smtp client/server for developing purposes
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'expressvsserverless@gmail.com',
                    pass: 'expressvsserverless1234'
                }
            });

            const activation_token = jwt.sign({email: req.body.email}, config.ACCOUNT_ACTIVATION_SECRET, {expiresIn: "10m"});

            // send mail with defined transport object
            transporter.sendMail({
                from: '"Users management app" <expressvsserverless@gmail.com>', // sender address
                to: newUser.email, // receiver
                subject: "Welcome!", // Subject line
                text: "You are almost done, we just need you to click on this link:", // plain text body
                html: `<a href="http://localhost:${config.SERVER_PORT}/user/activate?activation_token=${encodeURI(activation_token)}">http://localhost:${config.SERVER_PORT}/user/activate?activation_token=${encodeURI(activation_token)}</a>` // html body
            }, (err, info) => {
                if(err) {
                    return res.status(400).send({message: 'Error sending activation email'});
                }
                return res.status(201).send({message: "User created. Check your email inbox to activate your account!"});
            });
        });
    };

    static activate = (req, res) => {
        const activation_token = req.query["activation_token"];

        if(!activation_token) {
            return res.status(401).send({message: 'The activation must be sent!'});
        }

        jwt.verify(activation_token, config.ACCOUNT_ACTIVATION_SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).send({message: 'Something went wrong during the activation.'});
            }
            
            UserModel.findOneAndUpdate({email: decoded.email}, {$set:{activated: "ACTIVE"}}, (err, doc) => {
                if(err) {
                    return res.status(400).send({message: 'Database error trying to activate the user'});
                }
                res.status(200).send(`Your account has been activated! Click here to go to the login page <a href="http://localhost:3000/login">http://localhost:3000/login</a>`);
            });
          });
    };

    static activateUserFromAdmin = (req, res) => {
        if(req.body && req.body.email) {
            if(req.body.activate){
                UserModel.findOneAndUpdate({email: req.body.email}, {$set:{activated: "ACTIVE"}}, (err, doc) => {
                    if(err) {
                        return res.status(400).send({message: 'Database error trying to activate user from admin'});
                    }
                    res.status(200).send({message: `The account with email ${req.body.email} has been activated`});
                });
            } else {
                UserModel.findOneAndUpdate({email: req.body.email}, {$set:{activated: "PENDING"}}, (err, doc) => {
                    if(err) {
                        return res.status(400).send({message: 'Database error trying to deactivate user from admin'});
                    }
                    res.status(200).send({message: `The account with email ${req.body.email} has been deactivated`});
                });
            }
        } else {
            return res.status(400).send({message: 'The request body must contain an email'});
        }
    };

    static generateUsersPdf = (req, res) => {
        if(!req.body || !req.body.pdfData) {
            res.status(400).send({message: 'pdfData is missing...'});
        } else {
            amqp.connect('amqp://localhost', (err, conn) => {
                if(err) {
                    console.error(err);
                    process.exit(1);
                }
                consumer(conn);
                publisher(conn, req.body.pdfData);
            });
            res.status(201).send({message: 'Your pdf has been generated!'});
        }
    };
}

module.exports = UserController;