# Complete Mini App comparative
### Projects installation
<details>
<summary>Node.js + Express</summary>
<p>

### Requirements
- **Node.js** [Download](https://nodejs.org/es/download/)
- **MongoDB Atlas** (You can see how to create and use a MongoDB Atlas database in [this section](https://github.com/codeurjc-students/2019-ServerlessVsExpress/tree/master/sections/Databases))
- **A Gmail account** configured to allow "Less secure apps". This will be used as SMTP server to send the activation links.
- **RabbitMQ** server. Follow this steps to install it:
    1. Type this in the terminal:

    **Linux version:**
    ```sh
    sudo apt-get install rabbitmq-server
    ```

    **MacOS version:**
    ```sh
    brew install rabbitmq
    ```

    2. Run the RabbitMQ server to see if it was installed successfully:

    ```sh
    rabbitmq-server
    ```

    3. RabbitMQ provides a local UI. To access this UI, first, create a new user:

    ```sh
    rabbitmqctl add_user username userpass
    ```

    4. Make this user **administrator**:
    ```sh
    rabbitmqctl set_user_tags username administrator
    ```

    5. Access to the UI providing the above credentials. Click here: [http://localhost:15672](http://localhost:15672). You will be able to see the queues working.

### Installation
#### Backend (Node.js and Express + MongoDB)

1. Clone the repository:

    ```sh
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```

2. From the terminal, navigate to the folder **sections -> CompleteMiniApp -> node-express-app -> backend**
3. Install all the modules:

    ```sh
    npm install
    ```

4. Copy the file called .env.example and rename it to .env in the root folder of /backend:

    ```sh
    cp .env.example .env
    ```

5. Fill that file with the right information for your configuration.
6. You could can also modify (optionally) the config file in **src/config/config.js**. This file contains things like the tokens expiration time, the server port, etc. You can see the fields here:

    ```javascript
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

7. Run the server:

    ```sh
    npm start
    ```

8. Optionally, you can open another terminal, navigate again to **sections -> CompleteMiniApp -> node-express-app -> backend** and execute all the tests by running this command:

    ```sh
    yarn test
    ```

    This will run all the test to check if everything is working as expected. If it is, this message should appear in your terminal:

    <p align="center">
    <img alt="Tests passed" src="./backend/img/tests-passed.png">
    </p>

9. Run the RabbitMQ server (in another terminal window, keeping it alive) if you didn't to allow the generation of pdfs in the background:

    ```sh
    rabbitmq-server
    ```

#### Frontend (React + Redux)

1. If you are here, you should have already cloned the repository. Do it if you didn't. Then, from the terminal, navigate to the folder **sections -> CompleteMiniApp -> node-express-app -> frontend**
2. From there, run the app with the following command:

    ```sh
    npm start
    ```

### Use
After reproducing all the steps from above, you should be able to start playing with the application. The **backend** server is running on the port 4000, but you only need to worry about the frontend right now, which will be the one you will interact with. To access to the frontend, make sure you go to this url: [http://localhost:3000](http://localhost:3000).

There, you will be placed in the login panel. Follow this steps to try all the functionality:

1. In the login panel, click on the bottom link that says "Don't have an account? Sign Up" to create a new account, since you will not have one at the first moment:

<p align="center">
    <img alt="Login panel" src="https://github.com/codeurjc-students/2019-ServerlessVsExpress/blob/develop/sections/UsersManagement/img/node/login-panel.png">
</p>

2. Once you are in the Sign Up panel, enter all the information you are going to be asked for:

<p align="center">
  <img alt="Register panel" src="https://github.com/codeurjc-students/2019-ServerlessVsExpress/blob/develop/sections/UsersManagement/img/node/register-panel.png">
</p>

3. Now, if everything happened the right way, you should receive an activation link in your **email** to activate your account:

<p align="center">
  <img alt="Activation url" src="https://github.com/codeurjc-students/2019-ServerlessVsExpress/blob/develop/sections/UsersManagement/img/node/activation-url.png">
</p>

4. When you do a click on this link, your account will be **activated** in the database, allowing you to perform a login action with the credentials used when you signed up. Go to this url to do it: [http://localhost:3000/login](http://localhost:3000/login)

5. Entering the main page, you will see that an **alert** has appeared on the right-top side. This alert shows itself everytime the number of admins connected at the same time change (with the help of **websockets**). It shows the emails of all the admins connected at that moment:

<p align="center">
  <img alt="Admins connected alert websockets" src="./backend/img/image-admins.png">
</p>

6. From the menu, navigate clicking the link that says **Users**.

7. In the users section, you will be able to see these **two different views** (depending if your role is "ADMIN" or "USER"). To asign the role "ADMIN" to an user, you must go to your mongodb collection and do it manually. By default, every new user has the role "USER":

**User view:**

<p align="center">
  <img alt="Users section (from user role view)" src="./backend/img/users-user-view.png">
</p>

**Admin view:**

<p align="center">
  <img alt="Users section (from admin role view)" src="./backend/img/users-admin-view.png">
</p>

8. If you are an admin, you can activate/deactivate other non-admin accounts to allow/ban them from the application.

9. Over the users table, on the right side, you will find a button that says "print". It will create a pdf on a **background process** and will save it in a pdfs folder that can be found in the backend in the route **/backend/pdfs/**:

**Button to print the users:**

<p align="center">
  <img alt="Print users button" src="./backend/img/print-users-button.png">
</p>

**Folder with the pdfs generated:**

<p align="center">
  <img alt="pdfs folder" src="./backend/img/pdfs-folder.png">
</p>

---

</p>
</details>

<details>
<summary>AWS Stack</summary>
<p>

---

</p>
</details>

## Comparative

### Node.js + Express
