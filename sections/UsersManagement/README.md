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

![Login panel](./img/node/login-panel.png)

2. There, as we don't have any users yet, we need to register our first user. To achieve that, click on the bottom of the login panel where the link says **"Don't have an account? Sign Up"**. Done this step, you will get the register panel, which you must complete to register the user:

![Register panel](./img/node/register-panel.png)

3. When your new user has been registered, you also need to **activate your account**. This step can be completed going to the email you have entered, and clicking on the url that has been sent. This url contains a **unique activation token**, that will activate the user once clicked:

![Activation url](./img/node/activation-url.png)

4. The next step would be going to the login panel again ([http://localhost:3000/login](http://localhost:3000/login)), and using the information you provided before.

5. By this time, you should be inside the app. Use the navigation menu to go to **Users** section. There, you will see all the users that have been registered in the app:

![Users registered - admin role](./img/node/users-admin-role.png)

6. As you have might noticed, at right on the top bar, there is your **email**, the **user role** associated and a **logout** link. I've created two different possible roles (**USER** and **ADMIN**). By default, when a user registers, the USER role is asigned to it. You can change the role directly on the mongodb database, writing "ADMIN" on your role field. If you log in with a user whose role is ADMIN, apart from seeing the users registered, you will also be able to **activate/deactivate** the users you want:

![Admin role example](./img/node/admin-role.png)

---

</p>
</details>

<details>
<summary>AWS + Cognito</summary>
<p>

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

