
// Connection to the database
require('../db/database');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

class UserController {
    static getAllUsers = (req, res) => {
        UserModel.find({}, '-password',  (err, users) => {
            if(err) {
                return res.status(401).send(`Unauthorized operation`);
            }
            return res.status(200).send(users);
        });
    };

    static getAdmins = (req, res) => {
        // Search admin users hidding their password
        UserModel.find({role: 'ADMIN'}, '-password',  (err, users) => {
            if(err) {
                return res.status(401).send(`Unauthorized operation`);
            }
            return res.status(200).send(users);
        });
    };

    static register = (req, res) => {
        if(!req.body) {
            return res.status(400).send({message: "Wrong body parameters"});
        }

        if(!(req.body.email && req.body.password)) {
            return res.status(400).send();
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
                return res.status(400).send(err);
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
                    console.log(err);
                    return res.status(400).send(err);
                }
            });

            res.status(201).send({message: "User created. Check your email inbox to activate your account!"});
            
        });
    };

    static activate = (req, res) => {
        const activation_token = req.query["activation_token"];

        if(!activation_token) {
            return res.status(401).send({message: 'The activation token has expired!'});
        }

        jwt.verify(activation_token, config.ACCOUNT_ACTIVATION_SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).send({message: 'Something went wrong during the activation.'});
            }
            
            UserModel.findOneAndUpdate({email: decoded.email}, {$set:{activated: "ACTIVE"}}, (err, doc) => {
                if(err) {
                    return res.status(400).send();
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
                        return res.status(400).send();
                    }
                    res.status(200).send({message: `The account with email ${req.body.email} has been activated`});
                });
            } else {
                UserModel.findOneAndUpdate({email: req.body.email}, {$set:{activated: "PENDING"}}, (err, doc) => {
                    if(err) {
                        return res.status(400).send();
                    }
                    res.status(200).send({message: `The account with email ${req.body.email} has been deactivated`});
                });
            }
        } else {
            return res.status(400).send();
        }
    };
}

module.exports = UserController;