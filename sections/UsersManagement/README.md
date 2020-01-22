## Comparative between Users Management in Node.js + Express and AWS Cognito
### Projects installation
<details>
<summary>Node.js + Express</summary>
<p>

### Requirements
- **Node.js** [Download](https://nodejs.org/es/download/)
- **MongoDB Atlas** (You can see how to create and use a MongoDB Atlas database in [this section](https://github.com/codeurjc-students/2019-ServerlessVsExpress/tree/master/sections/Databases))

### Installation
#### Backend (Node.js and Express + MongoDB)
1. Clone the repository using the command line:

    ```
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```

2. From the command line, navigate to the folder **sections -> UsersManagement -> nodejs-express**
3. Write the following command to **install the packages**:

    ```
    npm install
    ```
4. Open the file inside the folder **src/config/config.js** and change the content with your own personal settings:

    ```javascript
    const MONGO_DB_NAME = "db_users_management";
    const MONGO_DB_USER = "mongodb_user";
    const MONGO_DB_PASSWORD = "your_mongo_db_password";

    // If your MongoDB is inside another cluster, the url may vary...
    module.exports = {
        SERVER_PORT: 4000,
        SECRET: "Aq.?*OxMe;",
        REFRESH_SECRET: "PLKK*;!",
        ACCOUNT_ACTIVATION_SECRET: "aAD?!",
        ACCESS_TOKEN_EXPIRATION_TIME: "5h",
        REFRESH_TOKEN_EXPIRATION_TIME: "20d",
        MONGO_DB_CONNECTION_URL: `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster0-oampc.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`
    };
    ```

5. The last step is **running the server**:

    ```
    npm start
    ```

#### Frontend (React + Redux)
1. As you should have cloned the repository in the steps above,  navigate to the folder **sections -> UsersManagement -> frontend-react-nodejs**
2. **Install the packages**:

    ```
    npm install
    ```

3. **Run the app**:

    ```
    npm start
    ```

### Use
If you have followed all the steps mentioned during the installation process, you should have run the **backend server**, which contains all the logic, endpoints, and the connection to the database and runs on port 4000 (you can change the port if needed), and also the **frontend SPA**, which will consume the backend and allow us to play with the functionality, and runs on the port 3000.

As we would like to have the frontend on hand, and interact with it, we should go to [http://localhost:3000](http://localhost:3000) to see our app working.

1. Once we first enter the app, we will be redirected to the login panel:

<p align="center">
  <img alt="Login panel" src="./img/node/login-panel.png">
</p>

2. There, as we don't have any users yet, we need to register our first user. To achieve that, click on the bottom of the login panel where the link says **"Don't have an account? Sign Up"**. Done this step, you will get the register panel, which you must complete to register the user:

<p align="center">
  <img alt="Register panel" src="./img/node/register-panel.png">
</p>

3. When your new user has been registered, you also need to **activate your account**. This step can be completed going to the email you have entered, and clicking on the url that has been sent. This url contains a **unique activation token**, that will activate the user once clicked:

<p align="center">
  <img alt="Activation url" src="./img/node/activation-url.png">
</p>

4. The next step would be going to the login panel again ([http://localhost:3000/login](http://localhost:3000/login)), and using the information you provided before.

5. By this time, you should be inside the app. Use the navigation menu to go to **Users** section. There, you will see all the users that have been registered in the app:

<p align="center">
  <img alt="Users registered - admin role" src="./img/node/users-admin-role.png">
</p>

6. As you have might noticed, at right on the top bar, there is your **email**, the **user role** associated and a **logout** link. I've created two different possible roles (**USER** and **ADMIN**). By default, when a user registers, the USER role is asigned to it. You can change the role directly on the mongodb database, writing "ADMIN" on your role field. If you log in with a user whose role is ADMIN, apart from seeing the users registered, you will also be able to **activate/deactivate** the users you want:

<p align="center">
  <img alt="Admin role example" src="./img/node/admin-role.png">
</p>

---

</p>
</details>

<details>
<summary>AWS Cognito</summary>
<p>

### Requirements
- **Nodejs** [Download](https://nodejs.org/es/download/)
- **AWS SAM CLI** (You need to have an **AWS account**). Follow these instructions to install it from the official docs: [Instructions](https://docs.aws.amazon.com/es_es/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- **AWS SDK for Javascript** Follow this two [Installation](https://aws.amazon.com/es/sdk-for-node-js/) steps.

### Installation
#### Backend (AWS Lambda + Cognito)
1. Clone the project in a folder you want it to be by writing this in your terminal:

    ```sh
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```
2. Navigate through the folders to **sections/UsersManagement/aws-cognito**.
3. Install required modules:

    ```sh
    npm install
    ````

4. Once you are inside this folder, write:

    ```sh
    npm run deploy-complete
    ```

    * This will create an AWS S3 bucket, package the template.yaml and deploy the app to the cloud.

5. When the deploy had finished, some outputs will appear. Copy the one that contains the API Endpoint. You will need it to connect the frontend and make it work. You don't need to do anything else for the moment.

#### Frontend (React + Redux)
1. Now, you need to navigate to **sections/UsersManagement/frontend-react-aws-cognito**.
2. Install the required modules writing:

    ```sh
    npm install
    ```

3. Open the folder **src/config/config.js** and update the value of `BASE_URL_API_BACKEND` with the API URL Endpoint you should have copied during the installation of the backend.
4. Now, you just need to run the app by writing:

    ```sh
    npm start
    ```

    * A browser window should open with **http://localhost:3000**, but if it doesn't, you can copy paste it manually in a browser.

### Use
As the functionality/frontend is the same than in the Node.js version, the images/steps are very similar. To avoid inserting duplicated images, you can follow the next steps:

1. Go to [http://localhost:3000](http://localhost:3000). There, as in the Node version, we can see the login panel. 
2. As we don't have any accounts yet, we can create one going to the register form, clicking in the url that says "Don't have an account? Sign Up". This will create and account. 
3. It still needs to be **verified** with the email that should have been sent to the email you used to sign up. 
4. Once you have verified the email, you can go back to the login panel and use it normally.
5. By default, the backend is configured to add all the new users to the **users group**. If you want to move a user to the **admins group**, you will need to go to [https://eu-west-2.console.aws.amazon.com/cognito/users](https://eu-west-2.console.aws.amazon.com/cognito/users), then, select the pool `UsersManagementUserPool`, click on `Users and Groups`, choose the tab that says `Groups` and then, remove the user from Users and add it to Admins. This will grant the user an extra functionality that normal users shouldn't have.
6. Once you have logged in, on the top bar, you should see a label close to your name which says the role the current logged user has (ADMIN or USER).
7. As in the Node.js version, the frontend shows the registered users in the app, the activation status, and if you have ADMIN role, you could also activate/deactivate other users, banning/forgiving them in the app. This would allow/deny the login of that user.
8. Logout can also be performed by clicking on the top-right corner.

---

</p>
</details>

## Comparative

### Node.js + Express
The backend is composed by a **MongoDB database**, **endpoints** to provide full functionality from the frontend side, **JSONWebtokens** to sign the tokens (access_token and refresh_token), and the module **nodemailer** to send activation links to the users registered.

To control the users registered in the app, we've created a Schema with this fields:

```javascript
const UserModelSchema = new Schema({
    user_id: Schema.Types.ObjectId,
    email: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: String,
    firstName: String,
    lastName: String,
    role: {
        type: String,
        enum: ['ADMIN', 'USER']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    activated: {
        type: String,
        enum: ["PENDING", "ACTIVE"],
        default: "PENDING"
    }
});
```

The email and password will let us login. The role will give us **access to some parts of the app** in case the user has the ADMIN role. Also, the activated field is used to **control whenever an user can log in** to the app or not.

The app contains some routes, which some of them have a **middleware** to control whether the endpoint can be accessed or not:

**User routes:**

```javascript
// Private routes
routes.get('/', [jwtCheck], UserController.getAllUsers);
routes.get('/:id([0-9]+)', [jwtCheck], UserController.getUser);

// Private routes with admin privileges
routes.get('/admins', [jwtCheck, roleCheck], UserController.getAdmins);
routes.put('/activate-user-from-admin', [jwtCheck, roleCheck], UserController.activateUserFromAdmin);

// Public routes
routes.post('/register', UserController.register);
routes.get('/activate?:activation_token', UserController.activate);
```

**Authentication routes:**

```javascript
routes.post('/login', AuthController.login);
routes.post('/refresh-token', AuthController.refreshToken);
routes.post('/check-valid-token', AuthController.checkValidToken);
```

This is the **tokens flow** diagram where you can see the process of login, and how the tokens are managed during their life:

![Users Management - Token flow](./img/node/users-management-token-flow.png)

When we perform a login action, **two tokens** are generated:
- **Access token:** It's the token used to maintain the session on the web. It usually has a short expiration time.
- **Refresh token:** This token is complementary to the first one. If the access token has expired, the refresh token (if it hasn't expired) allows to create a new access_token, and keep the session.

When both of them have expired, we force the user to log in again into the app. Every time the user logs in, the pair of tokens are **newly generated**.

With **JWT (JSONWebtokens)** we can easily sign and verify the tokens. For example, during a login action, we create and return the pair of tokens like this:

```javascript
const access_token = jwt.sign(jwtPayload, SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });
const refresh_token = jwt.sign(jwtPayload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });

res.send({
    email: user_db.email,
    role: user_db.role,
    access_token,
    refresh_token
});
```

Every token, has a **payload** with some information (Non confidential data, because it could be decoded), and a **secret** to sign it. The same secret will be used later to **verify the token**. Of course, we can also specify options, i.e. the expiration time.

When we want to verify the token, we can do:

```javascript
jwt.verify(access_token, SECRET, (err, decoded) => {
    if(err) {
        return res.status(401).send(err);
    }

    res.status(201).send({
        access_token
    });
});
```

If the token is wrong or has finished its expiration time, the callback error will be filled. Otherwise, we would obtain a decoded object, which is, indeed, the payload we passed when we signed the token!

Moreover, we have used JWT to create an activation token. We use it to send an email when a new user has been registered and we want him to activate its account:

**Creating/saving the user in the database:**

```javascript
newUser.save(async (err) => {
    if(err) {
        return res.status(400).send(err);
    }

    // The user has been created, but the account needs to be activated with a link! 
    // We'll use a fake smtp client/server for developing purposes
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'expressvsserverless@gmail.com',
            pass: 'expressvsserverless1234'
        }
    });

    const activation_token = jwt.sign({email: req.body.email}, config.ACCOUNT_ACTIVATION_SECRET, {expiresIn: "10m"});

    // send mail with defined transport object
    transporter.sendMail({
        from: '"Users management app" <expressvsserverless@gmail.com>', // sender address
        to: newUser.email, // receiver
        subject: "Welcome!", // Subject line
        text: "You are almost done, we just need you to click on this link:", // plain text body
        html: `<a href="http://localhost:${config.SERVER_PORT}/user/activate?activation_token=${encodeURI(activation_token)}">http://localhost:${config.SERVER_PORT}/user/activate?activation_token=${encodeURI(activation_token)}</a>` // html body
    }, (err, info) => {
        if(err) {
            console.log(err);
            return res.status(400).send(err);
        }
    });

    res.status(201).send({message: "User created. Check your email inbox to activate your account!"});
    
});
```

**Verifying the activation token when the user performs a click on the email link:**

```javascript
static activate = (req, res) => {
    const activation_token = req.query["activation_token"];

    if(!activation_token) {
        return res.status(401).send({message: 'The activation token has expired!'});
    }

    jwt.verify(activation_token, config.ACCOUNT_ACTIVATION_SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).send({message: 'Something went wrong during the activation.'});
        }
        
        UserModel.findOneAndUpdate({email: decoded.email}, {$set:{activated: "ACTIVE"}}, (err, doc) => {
            if(err) {
                return res.status(400).send();
            }
            res.status(200).send(`Your account has been activated! Click here to go to the login page <a href="http://localhost:3000/login">http://localhost:3000/login</a>`);
        });
    });
};
```

To play with the user role, we have implemented middlewares, which will allow the access to a controller, or deny it. A route example with a normal user role would look like this:

```javascript
routes.get('/', [jwtCheck], UserController.getAllUsers);
```

The middleware **"jwtCheck"** checks it the access_token is valid. In this case, we allow the access to all roles:

```javascript
const jwtCheck = (req, res, next) => {
    const array_access_token = req.headers.authorization;
    const access_token = array_access_token.split(" ")[1];

    if(!access_token) {
        return res.status(401).send('Unauthorized operation');
    }

    jwt.verify(access_token, SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).send(err);
        }
        res.locals.email = decoded.email;
        next();
    });
};
```

Sometimes, we want to use more than one middleware, and that's why it is inside an array. To pass arguments to the next middleware, we can use **res.locals.myVariableName**, and we will be able to get this data from the next middleware executed, accessing with the same name. For example, if we want also to check if the user role is ADMIN, we need to do this:

```javascript
routes.put('/activate-user-from-admin', [jwtCheck, roleCheck], UserController.activateUserFromAdmin);
```

The middleware **"roleCheck"** would look like this:

```javascript
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
```

The middlewares above are a good example of how multiple middlewares can **communicate between them sequentially**, adding **multiple filters** to a route.

### AWS Cognito
In this case, the backend has been done with an AWS SAM template. This template consists on a series of services provided by AWS, which we can connect and configure. To achieve our goals, we used services such an **Api**, a **User Pool** (this will be the main service to manage the authentication flow for the users), some **Lambda functions** with the necessary **events** containing the endpoints and **policies** that lambdas will need to execute certain actions, a **User Pool Client** to allow the communication between our app and AWS Services through the **AWS SDK**, and **User Pool Groups** (admins and users). We will tell some aspects about this services:

#### AWS SAM template specification
**CORS (Cross-origin resource sharing):**<br>
As we are going to use a frontend in localhost, we are going to need to deal with the typical Cors problem. To solve this, we need to tell our Api that we want to allow some methods, headers, origins and credentials. To do that, we need to add this in our SAM template, as follows:

```yaml
Globals:
  Api:
    Cors:
      AllowMethods: "'GET,POST,OPTIONS,PUT,DELETE'"
      AllowHeaders: "'content-type'"
      AllowOrigin: "'*'"
      AllowCredentials: "'*'"
```


**Api:**<br />
To **protect** some of the routes in our backend, we need to use some kind of filter. We can do that by indicating in the Api resource that we need to use an **Authorizer**, and that the authorizer will check if the request has been done by a user that belongs to our User Pool:

```yaml
UsersManagementApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: "dev"
      Cors: "'*'"
      Auth:
        DefaultAuthorizer: UsersManagementAuthorizer
        Authorizers:
          UsersManagementAuthorizer:
            UserPoolArn: !GetAtt UsersManagementUserPool.Arn
```


**Endpoints:**<br />
With the code above, we can connect the endpoints of our lambdas to that Api and choose whether they should be protected or not:

```yaml
# This block of code is contained inside the lambda functions
Events:
    CreateUser:
        Type: Api
        Properties:
        RestApiId: !Ref UsersManagementApi
        Path: /auth/register
        Method: POST
        Auth:
            Authorizer: NONE
    # ...
```

As you can see, in that endpoint, we are telling the Api not to use the authorizer. If we want to protect the endpoint, we just simply don't put that lines of code:

```yaml
Events:
    GetAllUsers:
        Type: Api
        Properties:
        RestApiId: !Ref UsersManagementApi
        Path: /user
        Method: GET
    GetUserInfo:
        Type: Api
        Properties:
        RestApiId: !Ref UsersManagementApi
        Path: /user/info
        Method: POST
    # ...
```


**Policies:**<br />
To execute certain actions from our app with the help of the AWS SDK, we need to add policies to the lambdas in charge of doing the actions:

```yaml
Policies:
    - Version: "2012-10-17"
        Statement:
        - Effect: "Allow"
            Action:
            - 'cognito-idp:listUsers'
            - 'cognito-idp:AdminEnableUser'
            - 'cognito-idp:AdminDisableUser'
            Resource:
            'Fn::Join':
                - ''
                - - 'arn:aws:cognito-idp:'
                - Ref: 'AWS::Region'
                - ':'
                - Ref: 'AWS::AccountId'
                - ':userpool/*'
```


**User Pool:**<br />
To create the User Pool, AWS allows us to **customize** many things in terms of **confirming new registered users** (by email, sms, code, etc). We can also choose the **Policies for passwords**, for example, we chose them to be longer than five characters, to require numbers and to have a temporary password validity of 1 day.

By default, AWS User Pools provide a field for username and password, but we can add more custom fields, for example the firstname, lastname... and even if they are required or not. You can see a piece of our example here:

```yaml
UsersManagementUserPool:
    Type: AWS::Cognito::UserPool
    Properties:
        UserPoolName: !Ref CognitoUserPoolName
        VerificationMessageTemplate:
          DefaultEmailOption: CONFIRM_WITH_LINK
          EmailSubject: 'Activation link'
          EmailSubjectByLink: Click on the link to activate your account
        Policies:
            PasswordPolicy:
              TemporaryPasswordValidityDays: 1
              MinimumLength: 6
              RequireNumbers: true
        UsernameAttributes:
          - email
        AutoVerifiedAttributes:
          - email
        Schema:
          - AttributeDataType: String
            Name: email
            Required: true
          - AttributeDataType: String
            Name: firstname
            Required: false
          - AttributeDataType: String
            Name: lastname
            Required: false
```


**User Pool Client:**<br />
In this resource, we can specify the authentication flow we want to use (they allow many actual flows, i.e. Oauth2). In our case, we are using 2 (`ALLOW_USER_PASSWORD_AUTH` and `ALLOW_REFRESH_TOKEN_AUTH`). You can set the refresh_token validity explicitly and even check to throw an error when a user exists, for example, checking the emails:

```yaml
UsersManagementCognitoUserPoolClient:
    Type: AWS::Cognito::UserPoolClient
    Properties:
      UserPoolId: !Ref UsersManagementUserPool
      ClientName: !Ref CognitoUserPoolClientName
      GenerateSecret: false
      PreventUserExistenceErrors: ENABLED
      RefreshTokenValidity: 20
      ExplicitAuthFlows: 
        - ALLOW_USER_PASSWORD_AUTH
        - ALLOW_REFRESH_TOKEN_AUTH
```


**User Pool Domain:**<br />
AWS Cognito makes use of a domain for many use cases. For example, when a user clicks on the confirmation link that has been sent after the sign up, it will be redirected to this domain and will be shown a message telling him if the confirmation was ok, or went wrong:

```yaml
UserPoolDomain:
    Type: AWS::Cognito::UserPoolDomain
    Properties:
      Domain: !Sub '${UserpoolDomainPrefix}'
      UserPoolId: !Ref UsersManagementUserPool
```


**User Pool Groups:**<br />
To **separate roles**, we can use groups. We have created two (Admins and Users) for our application, but you could create as many as you want. From the application, at the time we sign up a user, we can add it directly to the **default group**, that would be Users group. Here, you can see the creation of both groups:

```yaml
UserPoolGroupUsers:
    Type: AWS::Cognito::UserPoolGroup
    Properties:
      Description: Group for basic roles
      GroupName: Users
      UserPoolId: !Ref UsersManagementUserPool

  UserPoolGroupAdmins:
    Type: AWS::Cognito::UserPoolGroup
    Properties: 
      Description: Group for admin roles
      GroupName: Admins
      UserPoolId: !Ref UsersManagementUserPool
```


#### Lambda handlers using Node.js and AWS SDK
To make use of the resources mentioned above, we have created some handlers that will give us the required functionality.

**Cors:**<br />
To allow our endpoints to communicate with the client, we need to set some headers in the response. This will avoid all the red error messages in the console:

```javascript
const sendResponse = (statusCode, message, callback) => {
    const res = {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials' : true, // Required for cookies
        },
        body: JSON.stringify(message)
    };
    callback(null, res);
};
```

Also, as we are not doing **Simple Requests** (check this [link](https://docs.aws.amazon.com/es_es/apigateway/latest/developerguide/how-to-cors.html) to know what i'm talking about), every request needs a **preflight request** that will always be executed before the real one. It will be made with an special HTTP Method called **OPTIONS**. To make this work properly, we need to "create one endpoint using the method OPTIONS for our real endpoints in the AWS SAM template", and also, to handle this preflight requests, setting some headers:

```yaml
# Code for AWS SAM template
Events:
    GetAllUsers:
        Type: Api
        Properties:
        RestApiId: !Ref UsersManagementApi
        Path: /user
        Method: OPTIONS
        Auth:
            Authorizer: NONE
```

```javascript
// Preflight requests events handler
exports.optionsHandler = async (event, context, callback) => {
    const res = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
        },
        body: JSON.stringify('Headers for cors accepted')
    };
    callback(null, res);
};
```


**Register a user:**<br />
To register a user, we can use the method signUp() of the object `cognitoidentityserviceprovider`, which we can get from the AWS SDK. We would need to pass some required parameters as params, for example, the **ClientId** (we are sending the env variable from the lambda function), a **Password**, a **Username**, etc. We can choose to check that the email is not already in the User Pool.

```javascript
exports.register = (data) => {
    return new Promise((resolve, reject) => {
        const params = {
            ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
            Password: data.password,
            Username: data.email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: data.email
                }
            ],
            ValidationData: [
                {
                    Name: 'email',
                    Value: data.email
                }
            ]
        };

        cognitoidentityserviceprovider.signUp(params, async (err, dataSignUp) => {
            if(err) {
                reject(err);
            } else {
                // Add user to group 'users group'
                try {
                    await addUserToGroup(params.Username);
                    resolve(dataSignUp);
                } catch(err) {
                    reject(err);
                }
                
            }
        });
```

You may have noticed that we call to the method **addUserToGroup(username)**. We are doing this to insert the new users by default in Users group. You can see how to implement it here:

```javascript
const addUserToGroup = (username) => {
    return new Promise((resolve, reject) => {
        const params = {
            GroupName: process.env.COGNITO_DEFAULT_USER_GROUP_NAME,
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: username
        };
        
        cognitoidentityserviceprovider.adminAddUserToGroup(params, function(err, data) {
            if (err) {
                console.log("Error adding user to group");
                reject(err);
            } else {
                console.log("Success adding user to group");
                resolve(data);
            }
        });
    });
};
```


**Login a user:**<br />
To login a user, the process is similar, but we don't need to add it to any group and need less params:

```javascript
exports.login = (data) => {
    return new Promise((resolve, reject) => {
        if(!data || !data.email || !data.password) {
            reject({statusCode: 400, message: 'email or password is missing'});
        }

        const params = {
            ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
            AuthFlow: 'USER_PASSWORD_AUTH',
            AuthParameters: {
                USERNAME: data.email,
                PASSWORD: data.password
            }
        };

        cognitoidentityserviceprovider.initiateAuth(params, (err, dataLogin) => {
            if(err) {
                reject(err);
            } else {
                resolve(dataLogin);
            }
        });
    });
};
```

We have chosen to use the AuthFlow: `USER_PASSWORD_AUTH`, and that is why we must provide the username and password to follow this standar.


**Refresh token:**<br />
To refresh the tokens, AWS Cognito uses the same function used for the login (initiateAuth()), but instead of choosing the AuthFlow to be the one used above, we set it to be `REFRESH_TOKEN_AUTH`:

```javascript
const params = {
    ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    AuthParameters: {
        REFRESH_TOKEN: data.refresh_token
    }
};
```


**Get user info:**<br />
To test if the access_token is valid, we can use this function:

```javascript
exports.getUserInfo = (data) => {
    return new Promise((resolve, reject) => {
        if(!data || !data.access_token) {
            reject({statusCode: 401, message: 'You must provide an access_token!'});
        }

        const params = {
            AccessToken: data.access_token
        };

        cognitoidentityserviceprovider.getUser(params, (err, dataUser) => {
            if(err) {
                reject(err);
            } else {
                resolve(dataUser);
            }
        });
    });
};
```

In case the token is not valid, it will return a specific error.


**Getting all the users from the User Pool:**<br />
To have the same example of the Node.js version of this section, we can get all the users as follow:

```javascript
exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const params = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID
        };

        cognitoidentityserviceprovider.listUsers(params, (err, users) => {
            if(err) {
                reject(err);
            } else {
                resolve(users);
            }
        });
    });
};
```


**Enable/Disable user as admin:**<br />
In the frontend, when we are logged in, we can know if we are a normal user or an administrator (checking the group to which it belongs). As an special functionality that only can be done if you have an admin role, you can **enable/disable** other users. This will allow/deny them to perform a login:

```javascript
exports.activateUserFromAdmin = (data) => {
    return new Promise((resolve, reject) => {
        const params = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: data.username
        };

        if(data.activate) {
            cognitoidentityserviceprovider.adminEnableUser(params, (err, users) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });
        } else {
            cognitoidentityserviceprovider.adminDisableUser(params, (err, users) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });
        }
    });
};
```
---


### Summary
While in the version made with Node.js + Express, we have had to **handle by ourselves** the middlewares, validate the tokens, create the refresh actions, using a database, and more, with AWS Cognito it becomes really easy. Once you understand how Cognito works, it is like a **black box**. You send the required data, prepare the right configuration to make it work as you expect and use the AWS SDK that has almost everything you need to manage users. You don't need to worry about how to create the middleware to add a security layer for the endpoints, as you will have it automatically from the **API Authorizer**. I would recommend to use it if you want a quick/easy to maintain users management system!
