const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('./keys');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.secretOrKey
};

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(options, (payload, done) => {
            User.findById(payload.id)
            .then(user => {
                if(user) return done(null, user);
                return done(null, false);
            })
            .catch(error => console.log(error));
        })
    );
};