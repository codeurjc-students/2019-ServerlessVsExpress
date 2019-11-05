## Comparative between mongoDB in Node.js and DynamoDB in AWS
### Projects installation
<details>
<summary>mongoDB + Node.js and Express</summary>
<p>

### Requirements
- **Node.js** [Download](https://nodejs.org/es/download/)
- **MongoDB Cloud Account** [Create an account for free](https://cloud.mongodb.com/user#/atlas/register/accountProfile)
- **POSTMAN** or your prefered way to do HTTP requests to an API [Get POSTMAN](https://www.getpostman.com/downloads/)

### Installation and Use

#### MongoDB Atlas database creation
1. Login with your MongoDB account.
2. In the left sidebar, you'll see the option **Clusters**. Click on it.
3. Once you're inside clusters section, press the button on the top right corner that says **Build a new Cluster**.
4. You'll be asked to select a cloud provider. Just choose AWS (this doesn't mean we are going to use AWS at all). For the region, choose one of the options which have the label **free tier available** and is closer to your region.
5. Make sure that in the bottom bar, it **says $0/hour** and then, press the button **Create cluster**. By default, if you haven't chosen a name for the cluster, it will be called **Cluster0**.
6. Go to Clusters section again on the left sidebar and you should see your created cluster. There, press the button **Collections**.
7. Click on **Create Database** and give it a name (name it **db_users_test**). Then, give a name to create your first collection (name it **users**).
8. Now, we need to create an user with access to the database. We can do that by clicking on **Database Access** in the left sidebar. Input a username, and a password (you can use the Autogenerate Secure Password button). Then, select **Read and Write to any database** for user privileges. Save the user.
9. After that, go to the left sidebar and press **Network Access** and add your IP to the whitelist, or in our case, 0.0.0.0/0  (includes your current IP address). In production, this is not recommended because it allow access to our database from all the IPs.
10. The last step would be getting the **MongoDB connection string** to have access to our database from our node.js app. To find it, go again to **Clusters**, and then press **Connect**. A popover will ask you to select a connection method, choose **Connect your application**. In the driver option, select **Node.js**, and the version, **3.0 or later**. You can now copy the connection string, which will be something similar to this: **mongodb+srv://<user>:<password>@cluster0-oampc.mongodb.net/db_users_test?retryWrites=true&w=majority**. Note that we need to select the database we want to use in the string (db_users_test).

#### Node.js + express app installation
1. Clone the repository using the command line:

    ```
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```

2. From the command line, navigate to the folder **setions -> Databases -> node-mongodb**

3. Write the following command to install the necessary dependencies:

    ```
    npm install
    ```
4. Open the file **config/keys.js** and update the line **mongoURI: "YOUR_MONGODB_URI"** with the **connection URI** you got on the step 10 from creating the database.
5. We can now run the server writing this command:

    ```
    npm start
    ```

#### Use

We have created a mini API to use some typical **queries to our MongoDB database**. Here, you can see the endpoints you will have access to (the **queries explanation are in the Comparative section**):

##### GET endpoints
1. To get all the users, we can do a request with this data:

    **Method**: GET <br/>
    **Route:** http://localhost:3000/users <br/>
    **Body parameters:** none <br/>

2. To get all the users who are older than an age:

    **Method**: GET <br/>
    **Route:** http://localhost:3000/users/age/:number <br/>
    **Body parameters:** none <br/>

##### POST endpoint
1. To create a new user:

    **Method**: POST <br/>
    **Route:** http://localhost:3000/users <br/>
    **Body parameters:** <br/>
     ```json
     {
         "name": "John Doe",
         "email": "john23@gmail.com",
         "age": 40
     }
     ```

##### PUT endpoint
1. To update an user data by its id:

    **Method**: PUT <br/>
    **Route:** http://localhost:3000/users/:id <br/>
    **Body parameters:** <br/>
     ```json
     {
         "name": "John Doe",
         "email": "john23@gmail.com",
         "age": 40
     }
     ```

##### DELETE endpoint
1. To delete an user by its id:

    **Method**: DELETE <br/>
    **Route:** http://localhost:3000/users/:id <br/>
    **Body parameters:** none<br/>

</p>
</details>

<details>
<summary>DynamoDB + AWS</summary>
<p>

</p>
</details>

## Comparative

### MongoDB + Node.js & Express
To start with, we need to know some easy basics in MongoDB. We can have many **clusters**. Clusters are containers where we will have our different **databases**. In each database, we can have many **collections**, which would correspond to tables, if we were using relational databases. Inside a collection, we would find a bunch of **documents**. A document is a kind of json object that contains the data we insert, update, find or delete. In relational DB's, it corresponds to a row. Knowing this, we can now start the comparative.

To use **MongoDB**, i've chosen an elegant mongodb object modeling library called **mongoose**, which fits very well with node.js. To connect our app with the mongoDB we created using mongoose, we can do this:

```javascript
mongoose.connect(keys.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => console.log(`Connected to database!`))
.catch(err => console.log(err));
```

If you look at the options, **useNewUrlParser** is necessary in case you have a mongo **version >= 3.1.0**, otherwise, you will get deprecated warnings everywhere.

We also need a model, which will be, indeed, a mongoose Schema. This will tell mongoDB, the document structure we will have in our collection **users**, in our case, just three fields:

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: String,
    email: String,
    age: Number
});

module.exports = mongoose.model('User', UserSchema);
```

Having that, we are now able to use the Schema whenever we want to create a query, importing the Schema to the file we are working on: 

```javascript
const User = require('./models/user');
```

An example where we use it to **get all the documents** in **users collection**:

```javascript
User.find({}, (err, docs) => {
    if(err) throw err;
    res.send(docs);
});
```

We can do a lot of different queries easily. For example, we created an endpoint to find all the users older than an age, that cointains this query inside:

```javascript
User.find({age: { $gte: req.params.age }}, (err, docs) => {
    if(err) throw err;
    res.send(docs);
});
```

As you can possibly imagine, the first parameter in **find** method is the condition. **$gte** means greater or equal. We can also add more conditions to the object, for example, we could add **$lte** to our function to search inside a range.

If we want to add/create a document to our collection, in this case, an user, we can do this:

```javascript
User.create(user, (err, result) => {
    if(err) throw err;
    res.send(`User ${user.name} has been added!`);
});
```

We just needed to pass the **user object**, which must fit the structure indicated in its Schema, and it will create a new document in the collection, **asigning a new hashed id** to it.

To update an existing document, it is necessary to have a unique attribute, for example, the id, and the rest of attributes we want to change:

```javascript
User.findOneAndUpdate({_id: req.params.id}, user, (err, updated) => {
    if(err) throw err;

    res.send({
        message: `User with id ${req.params.id} has been updated!`,
        result: updated
    });
});
```

In the code above, you can see that we are using the method **findOneAndUpdate({where conditions}, {updatedObject}, callback)**. But this isn't the only one method we can use. There exist more like **findByIdAndUpdate**, which we can use to achieve the same result.

Of course, we can also delete a document:

```javascript
User.findOneAndDelete({_id: req.params.id}, (err, deleted) => {
    if(err) throw err;

    res.send({
        message: `User with id ${req.params.id} has been deleted!`,
        result: deleted
    });
});
```

When deleting, we just need to tell the condition we want to use to search the document that will be deleted (e.g. the id).

In all the queries above, there is always a **callback** containing the **error**, in case of failure during the execution, or the **results**, that could be the old object in case of update/delete and all the documents, when we tried to find all the users.

Let's now see how to do the same, but with DynamoDB and AWS!

### DynamoDB + AWS