## Comparative of files handling in Node.js + Express VS AWS Lambda + S3
### Projects installation

<details>
<summary>Node.js + Express</summary>
<p>

### Requirements
- **Node.js** [Download](https://nodejs.org/es/download/)
- **POSTMAN** or your prefered way to do HTTP requests to an API [Get POSTMAN](https://www.getpostman.com/downloads/)

### Installation

#### Node.js + express app installation
1. Clone the repository using the command line:

    ```
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```

2. From the command line, navigate to the folder **sections -> FilesManagement -> nodejs-express**

3. Write the following command to install the necessary dependencies:

    ```
    npm install
    ```

4. We can now run the server writing this command:

    ```
    npm start
    ```

#### Use
To test file handling in our node.js app, i've created an API where use a **json file** to hold the data we'll be working with. With this little API, we'll be able to add an user and also, read all the file (users). To test **fs** deeper, i've created two extra endpoints to create and delete a file (which are basic operations too).

Most of the File System operations can be done **synchronously** and **asynchronously**. I've done two synchronous operations, and the rest asynchronous (which are in general better, because they're non-blocking and will let the system do other tasks without waiting for them):

##### GET endpoints
1. To get all the users **reading user.json file synchronously**:

    **Method**: GET <br/>
    **Route:** http://localhost:3000/sync/users <br/>
    **Body parameters:** none <br/>

2. To get all the users **reading user.json file asynchronously**:

    **Method**: GET <br/>
    **Route:** http://localhost:3000/async/users <br/>
    **Body parameters:** none <br/>

##### POST endpoints
1. To create a new user **writing user.json file synchronously**:

    **Method**: POST <br/>
    **Route:** http://localhost:3000/sync/users <br/>
    **Body parameters:** <br/>
     ```json
     {
         "name": "John Doe",
         "email": "john23@gmail.com",
         "age": 40
     }
     ```

2. To create a new user **writing user.json file asynchronously**:

    **Method**: POST <br/>
    **Route:** http://localhost:3000/async/users <br/>
    **Body parameters:** <br/>
     ```json
     {
         "name": "John Doe",
         "email": "john23@gmail.com",
         "age": 40
     }
     ```

3. To create a new file **asynchronously**:

    **Method**: POST <br/>
    **Route:** http://localhost:3000/async/create <br/>
    **Body parameters:** <br/>
     ```json
     {
         "fileName": "YourFileName.extension"
     }
     ```

##### PUT endpoints
1. To append data to a file **asynchronously**:

    **Method**: PUT <br/>
    **Route:** http://localhost:3000/async/append <br/>
    **Body parameters:** <br/>
     ```json
     {
         "fileName": "YourFileName.extension",
         "appendData": "Your text"
     }
     ```

2. To rename a file **asynchronously**:

    **Method**: PUT <br/>
    **Route:** http://localhost:3000/async/rename <br/>
    **Body parameters:** <br/>
     ```json
     {
         "oldFileName": "YourOldFileName.extension",
         "newFileName": "YourNewFileName.extension"
     }
     ```
    
    
##### DELETE endpoint
1. To delete a file **asynchronously**:

    **Method**: POST <br/>
    **Route:** http://localhost:3000/async/delete <br/>
    **Body parameters:** <br/>
     ```json
     {
         "fileName": "YourFileName.extension"
     }
     ```

---

</p>
</details>

<details>
<summary>AWS Lambda + S3</summary>
<p>

### Requirements
- **Nodejs** [Download](https://nodejs.org/es/download/)
- A REST consumer app like **POSTMAN** [Download](https://www.getpostman.com/downloads/)
- **AWS SAM CLI** (You will need to have an **AWS account**). Follow these instructions to install it from the official docs: [Instructions](https://docs.aws.amazon.com/es_es/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- **AWS SDK for Javascript** Follow this two [Installation](https://aws.amazon.com/es/sdk-for-node-js/) steps to install it.

### Installation

#### AWS Lambda + S3 app installation
1. Clone the repository using the command line:

    ```
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```

2. From the command line, navigate to the folder **sections -> FilesManagement -> aws-s3**
3. Type this to create a new bucket in your region:

    ```
    aws s3api create-bucket --bucket my-bucket --create-bucket-configuration LocationConstraint=eu-west-3
    ```

4. **Package the project** with SAM:

    ```
    sam package --template-file template.yaml --s3-bucket my-bucket --output-template-file packaged-template.yaml
    ```

5. **Deploy the project** to create the CloudFormation Stack in AWS:

    ```
    sam deploy --template-file packaged-template.yaml --stack-name file-handling-stack --capabilities CAPABILITY_IAM
    ```

#### Use
In order to use the functionality this project provides, you must go to **AWS Console**. There, click on **Services** and, in the Search box, write **API Gateway**. Select your Stack name (in our case, file-handling-stack), and go to **Stages -> Prod**. Once you get there, all the endpoints will appear (all used with the Invoke URL). The Invoke URL should look similar to this (i've created these endpoints to handle files in the background, which is the real deal here):

```
https://xxxxxx.execute-api.eu-west-3.amazonaws.com/Prod
```

Now that you have your **Invoke Url** available, let's try all the endpoints:

##### GET endpoint
1. To get a file by its name, you can create this request:

    **Method**: GET <br/>
    **Route:** INVOKE_URL/getFile/{yourfile.extension} <br/>
    **Body parameters:** none <br/>

##### POST endpoint
1. To create a new file, we need also a request body containing this:

    **Method**: POST <br/>
    **Route:** INVOKE_URL/writeFile <br/>
    **Body parameters:** <br/>
     ```json
     {
         "fileName": "testFile.txt",
         "data": "Your file content"
     }
     ```

##### PUT endpoint
1. To update a file, we need the same body we used in the POST request

    **Method**: POST <br/>
    **Route:** INVOKE_URL/writeFile <br/>
    **Body parameters:** <br/>
     ```json
     {
         "fileName": "testFile.txt",
         "data": "Your file updated content"
     }
     ```

##### DELETE endpoint
1. To delete a file/object from our bucket, we just need the fileName in our path param:

    **Method**: GET <br/>
    **Route:** INVOKE_URL/deleteFile/{yourfile.extension} <br/>
    **Body parameters:** none <br/>


If you want to see the code to handle all the files in each respective request, go to the **Comparative** section, that can be found below.

---

</p>
</details>

## Comparative

### Node.js + Express files handling
To handle files in Node.js, there is a great library/module called **"fs" (Fyle System)**. This library allows us to **read**, **create**, **update**, **delete** and **rename** files easily and choose to do it in **synchronous** or **asynchronous** mode. For our project, i've created only two synchronous operations and used the rest as asynchronous.

To use **"fs"** library, we imported it in our app like this:

```javascript
const fs = require('fs');
```

With that object imported, we can use its methods, which i'm going to describe below:

#### Reading files
In this case, we created the same functionality sync and async:

**Sync form:**

```javascript
app.route('/sync/users').get((req, res) => {
    try {
        let readData = fs.readFileSync('users.json', 'utf-8');
        responseObject(null, readData, res);
    } catch(err) {
        responseObject(err, {}, res);
    }
});
```

The sync version, needs to be wrapped in a **try-catch block**, because it's the only way we can handle if there has been an error (file doesn't exist, etc). We can also specify the **character encoding** (utf-8, for example). Once the data is read, it'll be saved in readData object.

**Async form:**
```javascript
app.route('/async/users').get((req, res) => {
    fs.readFile('users.json', 'utf-8', (err, data) => {
        responseObject(err, data, res);
    }); 
});
```

We can read the file also with the code above, but as it is asynchronous, we have a **callback** to control our errors, and we wouldn't need to wrap our code in a try-catch.


#### Creating files
There are also two options to do the same thing with the rest of operations. In this case, we can add an user to our users.json file sync and async:

**Sync form:**
```javascript
app.route('/sync/users').post((req, res) => {
    try {
        let readData = fs.readFileSync('users.json', 'utf-8');
        readData = JSON.parse(readData);

        readData.users.push({
            name: req.body.name ? req.body.name : "",
            email: req.body.email ? req.body.email : "",
            age: req.body.age ? req.body.age : -1
        });
        
        readData = JSON.stringify(readData);
        fs.writeFileSync('users.json', readData);
        responseObject(null, readData, res);
    } catch(err) {
        responseObject(err, {}, res);
    }
});
```

With this code, we **first get the content of users.json**, parse it to be able to add a new user, and convert it to string again to write the new content. Again, as it is a sync operation, we have wrapped it in a try-catch.

In the code below, we can see the same operation, with the async variation:

**Async form:**
```javascript
app.route('/async/users').post((req, res) => {
    fs.readFile('users.json', 'utf-8', (err, data) => {
        if(!err) {
            data = JSON.parse(data);
            data.users.push({
                name: req.body.name ? req.body.name : "",
                email: req.body.email ? req.body.email : "",
                age: req.body.age ? req.body.age : -1
            });
            
            data = JSON.stringify(data);
            fs.writeFile('users.json', data, err => {
                responseObject(err, data, res);
            });
        }
    }); 
});
```

In addition, we have also the possibility to create a custom file with the desired extension:

```javascript
app.route('/async/create').post((req, res) => {
    if(req.body.fileName) {
        fs.writeFile(req.body.fileName, `File's name: ${req.body.fileName}`, err => {
            responseObject(err, JSON.stringify({}), res);
            console.log("Created file!");
        });
    } else {
        const error = {
            code: 503,
            path: ''
        };
        responseObject(error, {}, res);
    }
});
```

#### Updating files
The "**fs**" module also allows us to, for example, append new content to a file (if the file doesn't exist, it creates a new one):

```javascript
app.route('/async/append').put((req, res) => {
    if(req.body.fileName && req.body.appendData) {
        fs.appendFile(req.body.fileName, req.body.appendData, err => {
            responseObject(err, JSON.stringify({}), res);
            console.log("Appended data!");
        });
    } else {
        const error = {
            code: 503,
            path: ''
        };
        responseObject(error, {}, res);
    }
});
```

Inside this updating section, we added also the possibility to rename a file, passing the old file name and the new one as parameters:

```javascript
app.route('/async/rename').put((req, res) => {
    if(req.body.oldFileName && req.body.newFileName) {
        fs.rename(req.body.oldFileName, req.body.newFileName, err => {
            responseObject(err, JSON.stringify({}), res);
            console.log("File renamed!");
        });
    } else {
        const error = {
            code: 503,
            path: ''
        };
        responseObject(error, {}, res);
    }
});
```

#### Deleting files
Of course, we can also delete a file providing its name:

```javascript
app.route('/async/delete').delete((req, res) => {
    if(req.body.fileName) {
        fs.unlink(req.body.fileName, err => {
            responseObject(err, JSON.stringify({}), res);
            console.log("Deleted file!");
        });
    } else {
        const error = {
            code: 503,
            path: ''
        };
        responseObject(error, {}, res);
    }
});
```

#### Error handling
To handle the errors that might happen when we try to achieve some of the operations above, i've added a **"responseObject"** method where, in case of an error, it creates a custom message depending on the code:

```javascript
res.send({
    status: 404,
    data: {},
    error: ErrorsDescriber.fileError(error.code, error.path)
});
```

---

### AWS Lambda + AWS S3 bucket file handling
AWS becomes very interesting when it comes to handle files. Indeed, **files are really objects**, which is what i'm going to refer to files from now on. This objects, can be uploaded to an **AWS S3 bucket**. Let's say we have created a bucket, and we want to read/create/delete files on it. We have many ways to do that, but of course, some of them are simpler than the others. In our case, we used **aws-sdk** module, which can be imported in our app like this:

```javascript
const AWS = require('aws-sdk');
```

We imported this sdk because it **contains helpers** to work with AWS services in a painless way. For example, we can **create a S3 object** to use some of its available methods (getObject, putObject, and more!):

```javascript
const S3 = new AWS.S3({apiVersion: '2006-03-01'});
```

In the code above, we have added an attribute to indicate that we'll use the S3 API's functionality dated in '2006-03-01', which is the only one at the moment. Now that we have our S3 object ready to go, we can use it to start working with objects/files. It has many methods you could use [Available S3 Methods](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html), but in this section, we will focus in two of them to compare it to the Node.js version, **getObject and putObject**.

#### Reading files
We can get an object, specifying the **required params** (Bucket and Key) and also, **optional params** that can help us search given a condition, for example, we could search for an object whose version has changed during its life. You can see an example here:


```javascript
const getObject = (fileName, callback) => {
    const params = {
        Bucket: bucket,
        Key: fileName
    };

    return S3.getObject(params, (err, dataObject) => {
        if(err) {
            console.log(err, err.stack);
            sendResponse(500, `Error trying to get the file ${fileName}`, callback);
        } else {
            console.log(dataObject);
            // As the data returned from getObject contains a lot of meta-data and
            // the body is buffered, we must parse it to whatever we need, in our case, a string
            sendResponse(200, {content: dataObject.Body.toString('utf-8')}, callback);
        }
    });
};
```

As you can see, there are only **two params required**, but we could have also added optionals, like **VersionId: 'vid'**, that helps us get the version we preffer of the object.

#### Creating files
To create files, our S3 object gives us the **putObject** method. We can use it to create an object, indicating the **Bucket**, a **Key** (which is the name of the object), and a **Body** (the object's content). Of course, it allows us to give more extra info to the object using the params, for example, we could add custom metadata, tags, server-side encryption, etc:

```javascript
const writeObject = (data, callback) => {
    const params = {
        Bucket: bucket,
        Key: data.fileName,
        Body: data.data,
        Metadata: {
            "metadata1": "value1", 
            "metadata2": "value2"
            },
        ServerSideEncryption: "AES256"
    };

    return S3.putObject(params, (err, dataObject) => {
        if(err) {
            console.log(err, err.stack);
            sendResponse(500, `Error trying to add the file ${data.fileName}`, callback);
        } else {
            console.log(dataObject);
            sendResponse(201, `File/Object ${data.fileName} was created/updated successfully`, callback);
        }
    });
};
```

#### Updating files
S3 also gives us the option to update and object, but... it is, in fact, the same we did to create it. In the background, it also uses the **putObject** method to update it. You only need to specify the **same Bucket and Key**, and modify the data or the optional params, and it should work! Doing this, it will update the last modification datetime of the object.

#### Deleting files
With the method **deleteObject**, and using as params a bucket and a key, we can delete an object:

```javascript
const deleteObject = (fileName, callback) => {
    const params = {
        Bucket: bucket,
        Key: fileName
    };

    return S3.deleteObject(params, (err, dataObject) => {
        if(err) {
            console.log(err, err.stack);
            sendResponse(500, `Error trying to delete the file ${fileName}`, callback);
        } else {
            console.log(dataObject);
            sendResponse(200, `Object with name ${fileName} couldn't be deleted`, callback);
        }
    });
};
```

A common thing in all this methods is their structure. It always has the form "**method(params, callback)**", and let us work with it very easily!

#### Error handling
In above's paragraph, we mentioned that each method has a callback. This callback consists in an error as the first argument, and the data returned in the second one. If there hasn't been any error during the execution of the method, the **error will get a null value**. On the contrary, if something went wrong, the **error variable will contain the necessary information** to clarify what happened.

#### Policies to give our app access to the bucket
The last step, but i would say, the most important to get this working, is to apply the right policies to our app. This is necessary because by default, all permissions are revoked in order to protect the resources. In our example, we wrote this Policies to let our application manage the bucket:

```yml
Policies:
    -   Version: '2012-10-17'
        Statement:
            # Policy needed to use GetObject with right permissions (it needs to list the objects)
        -   Sid: ListObjectsInBucket
            Effect: Allow
            Action: 
            -   s3:ListBucket
            Resource:
            -   arn:aws:s3:::franrobles8-filehandling-bucket
            # Policy needed to allow all operations in objects with right permissions
        -   Sid: AllObjectActions
            Effect: Allow
            Action: s3:*Object
            Resource:
            -   arn:aws:s3:::franrobles8-filehandling-bucket/*
```

As you can read in the template comments, the first policy allow the app to list the objects from the bucket. This is required if you want to **read/get any object**. Also, in the second policy, we are allowing all the actions to all the objects. This will help us with **writing** and **deleting** the objects we want.

---

### Summary
Handling files has always been very important. With Node.js, we can handle files just importing a module. In AWS, we need to do a few more steps (SAM CLI installation, etc) before doing this, but once we get everything done, we can do the same, or **even more** ([See all methods of S3](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)). There is also one thing i missed from AWS. **It's not possible to append data** (we don't have any operation to do that directly) to an existent object, and if you want to do it, you first need to get the object, modify it, and then write it again to the bucket, which is **less efficient** than a real append operation.

Nonetheless, we need to look further. The main difference i've encountered is that **AWS has a great protection layer** that **secures files/objects** from being compromised. You can also do that with Node.js, but it can be harder to achieve the same results that, by default, AWS provides.