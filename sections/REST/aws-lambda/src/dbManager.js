const uuidv1 = require('uuid/v1');

// Passwords should be encrypted to avoid security risks. This is just a demo.
let users = [
    {
        userId: `${uuidv1()}-1`,
        username: "franrobles",
        password: "1234",
        name: "Francisco",
        lastname: "Robles"
    },
    {
        userId: `${uuidv1()}-2`,
        username: "anajohnson",
        password: "1234",
        name: "Ana",
        lastname: "Johnson"
    }
];

// This is a DB simulation. Data should be managed with a real database inside functions.

const getAllUsers = () => {
    let usersWithoutPass = users.map(e => ({
        userId: e.userId,
        username: e.username,
        name: e.name,
        lastname: e.lastname
    }));
    return new Promise((resolve, reject) => {
        users ? resolve(usersWithoutPass) : reject("There aren't any users!");
    });
};

module.exports = {
    getAllUsers
};