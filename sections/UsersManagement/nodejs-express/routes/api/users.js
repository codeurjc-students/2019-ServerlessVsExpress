const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const validateRegister = require('../../validation/register');
const validateLogin = require('../../validation/login');

const User = require('../../models/User');

/** 
 * @route POST api/users/register
 * @desc Endpoint to register an user
 * @access Public
*/
router.post('/register', (req, res) => {
    // Form validation
    const {errors, validData} = validateRegister(req.body);

    if(!validData) {
        return res.status(400).json(errors);
    }

    // Return the user, if exists, or an error if don't
    User.findOne({
            email: req.body.email
        }).then((user) => {
        if(user) {
            return res.status(400).json({email: "This email is already used, try with another"});
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email
            });

            // Before saving to the new user into the Database, we need to hash the password
            bcrypt.genSalt(10, (error, salt) => {
                bcrypt.hash(req.body.password, salt, (error, hash) => {
                    if(error) throw error;
                    newUser.password = hash;

                    // We can now save the user
                    newUser.save()
                    .then(user => res.json(user))
                    .catch(error => console.log(error));
                })
            });
        }
    })
});

/** 
 * @route POST api/users/login
 * @desc Endpoint to login an user
 * @access Public
*/
router.post('/login', (req, res) => {
    const {errors, validData} = validateLogin(req.body);

    if(!validData) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email: email
    })
    .then((user) => {
        if(!user) {
            return res.status(400).json({emailNotExist: "This email doesn't exist"});
        }

        // We need to check if the passwords' hash match with the one found
        bcrypt.compare(password, user.password)
        .then((match) => {
            // If passwords match, we need to create a Jwt payload
            if(match) {
                const payload = {
                    id: user.id,
                    name: user.name,
                    userType: user.userType
                };

                // We need to sign the Jwt token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year
                    },
                    (error, token) => {
                        if(!error) {
                            res.json({
                                success: true,
                                token: `Bearer ${token}`
                            });
                        }
                    }
                );
            } else {
                return res.status(400).json({wrongPassword: "The password isn't correct"});
            }
        });
    });
});

module.exports = router;