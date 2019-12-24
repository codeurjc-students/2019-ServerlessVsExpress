const UserModel = require('../models/user');

const roleCheck = (req, res, next) => {
    const email = res.locals.email;

    UserModel.findOne({email}, (err, doc) => {
        if(err) {
            return res.status(404).send({message: `User not found`});
        }
        
        if(doc.role === 'ADMIN') {
            // If the access role is contained in the allowed roles, we allow the access
            next();
        } else {
            return res.status(401).send('Unauthorized operation');
        }
    });
};

module.exports = roleCheck;