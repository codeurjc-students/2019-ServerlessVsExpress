const express = require('express');
const app = express();
const mongoose = require('mongoose');
const keys = require('./config/keys');
const User = require('./models/user');

// Middlewares

app.use(express.json());

// Connection with our database
mongoose.connect(keys.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => console.log(`Server connected to database!`))
.catch(err => console.log(err));

// Routes to test the database

// Get all the data in the collection users
app.route('/users').get((req,res) => {
    User.find({}, (err, docs) => {
        if(err) throw err;
        res.send(docs);
    });
});

// Get all the users who are older than an age
app.route('/users/age/:age').get((req,res) => {
    // $gte:  greater or equal than
    User.find({age: { $gte: req.params.age }}, (err, docs) => {
        if(err) throw err;
        res.send(docs);
    });
});

// Create a new document in the collection users
app.route('/users').post((req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };

    User.create(user, (err, result) => {
        if(err) throw err;
        res.send(`User ${user.name} has been added!`);
    });
});

// Update a document in the collection users by its id
app.route('/users/:id').put((req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };

    User.findOneAndUpdate({_id: req.params.id}, user, (err, updated) => {
        if(err) throw err;

        res.send({
            message: `User with id ${req.params.id} has been updated!`,
            result: updated
        });
    });
});

// Delete a document in the collection users by its id
app.route('/users/:id').delete((req, res) => {
    User.findOneAndDelete({_id: req.params.id}, (err, deleted) => {
        if(err) throw err;

        res.send({
            message: `User with id ${req.params.id} has been deleted!`,
            result: deleted
        });
    });
});

app.listen(3000, () => console.log(`Server running on port 3000`));

