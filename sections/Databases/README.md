## Comparative between mongoDB in Node.js and DynamoDB in AWS
### Projects installation
<details>
<summary>mongoDB + Node.js and Express</summary>
<p>

### Requirements
- **Node.js** [Download](https://nodejs.org/es/download/)
- **MongoDB Cloud Account** [Create an account for free](https://cloud.mongodb.com/user#/atlas/register/accountProfile)
- **POSTMAN** or your prefered way to do HTTP requests to an API [Get POSTMAN](https://www.getpostman.com/downloads/)

### Installation

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

2. From the command line, navigate to the folder **sections -> Databases -> node-mongodb**

3. Write the following command to install the necessary dependencies:

    ```
    npm install
    ```
4. Open the file **config/keys.js** and update the line **mongoURI: "YOUR_MONGODB_URI"** with the **connection URI** you got on the step 10 from creating the database.
5. We can now run the server writing this command:

    ```
    npm start
    ```

### Use

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

### Requirements
- **Nodejs** [Download](https://nodejs.org/es/download/)
- A REST consumer app like **POSTMAN** [Download](https://www.getpostman.com/downloads/)
- **AWS SAM CLI** (You will need to have an **AWS account**). Follow these instructions to install it from the official docs: [Instructions](https://docs.aws.amazon.com/es_es/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- **AWS SDK for Javascript** Follow this two [Installation](https://aws.amazon.com/es/sdk-for-node-js/) steps to install it.

### Installation
#### AWS + Dynamodb app installation
1. Go to [AWS](https://aws.amazon.com), and in the search box, input **IAM**. In this section (we need an IAM administrator user, but that should be done if you did the AWS SAM CLI config), we'll go to **Users**, and select the user you configured your AWS SAM CLI to work with. Click on it, and add the permission policie **AmazonDynamoDBFullAccess**. This is all we need from AWS for now.
2. Clone the main repository to a local folder using the command line:

    ```
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```

3. From the command line, navigate to the folder **sections -> Databases -> aws-dynamodb**
4. **Create an AWS S3 bucket** in your desired region and give it a name:

    ```
    aws s3api create-bucket --bucket your-bucket-name --create-bucket-configuration LocationConstraint=eu-west-3
    ```

5. **Package the project** writing this:

    ```
    sam package --template-file template.yaml --s3-bucket your-bucket-name --output-template-file packaged-template.yaml
    ```

6. **Deploy the app** to generate automatically all the needed resources:

    ```
    sam deploy --template-file packaged-template.yaml --stack-name your-stack-name --capabilities CAPABILITY_IAM
    ```

7. Once you have deployed the app, you should have your endpoints in [Amazon API Gateway](console.aws.amazon.com/apigateway). There, you need to **select your stack (your-stack-name) -> Stages -> Prod**. There, get the **Invoke URL** (you will need it to make the requests).
8. But the important thing in this section is [DynamoDB](console.aws.amazon.com/dynamodb). Being there, press on **Tables**. You should see a table named **users**.
9. The installation is done!

### Use

With the **Invoke URL**, we will be able use our DynamoDB queries in the background. Here, you can see the endpoints to the API created in the lambda function:

#### (Example) invoke_url = https://xxxxx.execute-api.eu-west-3.amazonaws.com/Prod

##### GET endpoint
1. To get all the users:

    **Method**: GET <br/>
    **Route:** invoke_url + /users <br/>
    **Body parameters:** none <br/>

##### POST endpoint
1. To create a new user:

    **Method**: POST <br/>
    **Route:** invoke_url + /users <br/>
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
    **Route:** invoke_url + /users/:userid <br/>
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
    **Route:** invoke_url + /users/:userid <br/>
    **Body parameters:** none<br/>

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
DynamoDB has a **special namespacing-level**, different from the common approach. Usually, we can have many different database names, which each one could have tables/collections, and so on, but in DynamoDB, it works a little bit different. If you want, for example, have a different "database" with its own tables for different applications, you could do it following the [aws-region > aws-account-id > ] table form. That means that we could have, for example, another separated database if we use a different aws-account-id, or even the same account but in a different region.

Keeping the information above in mind, the way we should understand this kind of database, is the same. In our database, we have tables (just one this time, called **users**). And in each table, we have something called **Items**, that are, in fact, documents with a Json shape.

One noticeable thing in the **SAM template**, we only specified our primary key (userid). That's because when the first object is added to the table, it creates the rest of columns.

Another important thing is that DynamoDB **doesn't generate a generic id** for each Item by itself. We must take care of it, for example, using the package **uuid**, which allows us to create unique ids from different methods. We used **uuid.v1()**, that generates a hashed id having the date and time into account. This will avoid the userid's to collide.

To work with a DynamoDB client from our app we needed to give some policies to our lambda:

```yaml
Statement: 
    -   Effect: Allow
        Action:
            -   'dynamodb:Scan'
            -   'dynamodb:DeleteItem'
            -   'dynamodb:GetItem'
            -   'dynamodb:PutItem'
            -   'dynamodb:UpdateItem'
        Resource:
            'Fn::Join':
                -   ''
                -   -   'arn:aws:dynamodb:'
                    -   Ref: 'AWS::Region'
                    -   ':'
                    -   Ref: 'AWS::AccountId'
                    -   ':table/users'
```

You can imagine what it does. This policie, will allow our lambda to scan (used to get all the data from a table), delete, get, put and update in the table users, that is the resource url indicated at the end.

Also, to work with the database from our app code, we imported **aws-sdk**, which is perfect to create all kind of queries between our app and the database. It also needs to be configured, but it's really easy:

```javascript
const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: "https://dynamodb.eu-west-3.amazonaws.com"
});
```

With the code above, our app will know which database we are working with. But, we also need to initialize an object, which will be the client:

```javascript
const docClient = new AWS.DynamoDB.DocumentClient();
```

We can of course do the same we did with the MongoDB app, but in a slightly different way. The object we created (docClient), has the typical different queries:
- **scan(params, callback)**: This is used to get all the Items from a table. As much as the table gets very large, it will be become a **not very efficient** operation. For example:

```javascript
const getAllUsers = () => {
    const params = {
        TableName: table
    };

    return docClient.scan(params).promise();
};
```

- **put(params, callback)**: This method seems a bit tricky by its name (could be understood as an update, which is not its purpose), but it is just a method to **create a new Item** in our table:

```javascript
const addUser = (data) => {
    const params = {
        TableName: table,
        Item: {
            "userid": uuid.v1(),
            "name": data.name,
            "email": data.email,
            "age": data.age
        }
    };

    return docClient.put(params).promise();
};
```

- **update(params, callback)**: Of course, it is also possible to update an Item/Items. This needs more attributes in the params, to indicate which object and which fields we want to update:

```javascript
const updateUser = (data) => {
    const params = {
        TableName: table,
        Key: {
            "userid": data.userid
        },
        UpdateExpression: "set #na = :n, email = :e, age = :a",
        ExpressionAttributeNames: { // Used when there are reserved words in DynamoDB, like name
            "#na": 'name'
        },
        ExpressionAttributeValues: {
            ":n": data.name,
            ":e": data.email,
            ":a": data.age
        },
        ReturnValues: "ALL_OLD" // Returns the item content before it was updated
    };

    return docClient.update(params).promise();
};
```

In the attribute **UpdateExpression**, you can see we have some extrange things, for example, the **#na** and the **:e**. The first one (#na), is an ExpressionAttributeName. It is necessary because the word "name" is reserved in DynamoDB, and this way, we can let it know that we are not meaning the reserved one. In the other hand, we have the ExpressionAttributeValue (:e). This is just a way to tell that we will insert its value later, in the field called **ExpressionAttributeValues** as a key-value pair.
We can also customize the return value after updating the row, using the **ReturnValues** attribute.

- **delete(params, callback)**: We can use this method to delete an object/objects. This method needs a condition, to search the objects we want to delete, and give values to the condition in the **ExpressionAttributeValues**. The **ReturnValues** is also optional and we used it to return the deleted value:

```javascript
const deleteUser = (userid) => {
    const params = {
        TableName: table,
        Key: {
            "userid": userid
        },
        ConditionExpression: "userid = :userid",
        ExpressionAttributeValues: {
            ":userid": userid
        },
        ReturnValues: "ALL_OLD" // Returns the item content before it was deleted
    };

    return docClient.delete(params).promise();
};
```

### Summary
Both databases allow are really easy to work with. DynamoDB has **secondary indexes** that can help to search during the execution of a query, if the main index is not present. MongoDB doesn't have this. It depends on the principal index, and if it doesn't exist, it will need to search in every document of the collection.

The **deployment is painless** in both of them. But if you are working with AWS, it's highly recommended to use DynamoDB, because it has a lot of features that can be used among other AWS Services.

One thing that developers must pay attention to, is that if you don't select a good key scheme, **DynamoDB costs could increase relatively easy**. It's a good idea to follow DynamoDB's good patterns. On the other hand, if more **performance is needed**, it will scale without any problems. If we talk about **prices in MongoDB**, they don't vary as much as its competitor, so, you don't need to be afraid about this. 

Speaking about the **size of documents/items**, in **MongoDB**, each document has a max size of **16MB/document**, while in **DynamoDB**, a Item can only have **400KB** as much.

Also, **MongoDB can be deployed in a lot of environments**, while **DynamoDB, depends more on AWS's ecosystem**. It's less universal.