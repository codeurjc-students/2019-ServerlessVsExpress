// Passwords should be encrypted to avoid security risks. This is just a demo.
let users = [
    {
        username: "franrobles",
        password: "1234",
        name: "Francisco",
        lastname: "Robles"
    },
    {
        username: "anajohnson",
        password: "1234",
        name: "Ana",
        lastname: "Johnson"
    }
];

// This is a DB simulation. Data should be managed with a real database inside functions.

const getAllUsers = () => {
    let usersWithoutPass = users.map(e => ({
        username: e.username,
        name: e.name,
        lastname: e.lastname
    }));
    return new Promise((resolve, reject) => {
        users ? resolve(usersWithoutPass) : reject("There aren't any users!");
    });
};

const getUser = (username) => {
    let user = users.find(e => e.username === username);
    return new Promise((resolve, reject) => {
        user ? resolve(user) : reject(`User ${username} not found!`);
    });
};

const addUser = (user) => {
    let added = false;
    if(!users.filter(e => e.username === user.username).length > 0) {
        users.push(user);
        added = true;
    }

    return new Promise((resolve, reject) => {
        (added) ? resolve(user) : reject("User already exists!");
    });
};

const updateUser = (user) => {
    let index = users.findIndex(e => e.username === user.username);
    users[index] = user;

    return new Promise((resolve, reject) => {
        (index !== -1) ? resolve(user) : reject(`User ${user.username} doesn't exist!`);
    });
};

const deleteUser = (user) => {
    let usersLengthBefore = users.length;
    users = users.filter(e => e.username !== user.username);

    return new Promise((resolve, reject) => {
        (users.length < usersLengthBefore) ? resolve(user) : reject(`User ${user.username} doesn't exist!`);
    });
};

module.exports = {
    getAllUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
};