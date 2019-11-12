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
The **fs** module also allows us to, for example, append new content to a file (if the file doesn't exist, it creates a new one):

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
