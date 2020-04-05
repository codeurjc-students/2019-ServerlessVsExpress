require('dotenv').config();
const UserModel = require('../models/user');

const sendConnectedAdminsPeriodically = async (socket) => {
    try {
        const adminsConnected = await getConnectedAdmins();
        socket.emit('ADMINS_CONNECTED', adminsConnected);
    } catch(err) {
        console.log(err);
    }
};

const getConnectedAdmins = () => new Promise((resolve, reject) => {
    UserModel.find({role: 'ADMIN', connected: true}, function(err, admins) {
        if(err) {
            return reject(err);
        }

        const adminsMap = admins.map(admin => {
            return {
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName
            };
        });
        
        return resolve(adminsMap);  
    });
});

module.exports = {
    sendConnectedAdminsPeriodically
};