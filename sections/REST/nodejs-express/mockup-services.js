let users = [
    {
        username: "franrobles",
        password: "1234"
    },
    {
        username: "anajohnson",
        password: "1234"
    }
];

// This is a DB simulation. Data should be managed with a real database inside functions.

const getAllUsers = () => {
    let usersWithoutPass = users.map(e => e.username);
    return new Promise((resolve, reject) => {
        users ? resolve(usersWithoutPass) : reject("Error fetching users");
    });
};

const addUser = (user) => {
    let added = false;
    if(!users.filter(e => e.username === user.username).length > 0) {
        users.push(user);
        added = true;
    }
    console.log(added);
    return new Promise((resolve, reject) => {
        (added) ? resolve(user) : reject("Error adding user...");
    });
};

module.exports = {
    getAllUsers,
    addUser
};