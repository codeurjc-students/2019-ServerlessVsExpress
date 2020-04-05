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
    <img alt="Tests passed" src="./node-express-app/img/tests-passed.png">
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
  <img alt="Admins connected alert websockets" src="./node-express-app/img/image-admins.png">
</p>

6. From the menu, navigate clicking the link that says **Users**.

7. In the users section, you will be able to see these **two different views** (depending if your role is "ADMIN" or "USER"). To asign the role "ADMIN" to an user, you must go to your mongodb collection and do it manually. By default, every new user has the role "USER":

**User view:**

<p align="center">
  <img alt="Users section (from user role view)" src="./node-express-app/img/users-user-view.png">
</p>

**Admin view:**

<p align="center">
  <img alt="Users section (from admin role view)" src="./node-express-app/img/users-admin-view.png">
</p>

8. If you are an admin, you can activate/deactivate other non-admin accounts to allow/ban them from the application.

9. Over the users table, on the right side, you will find a button that says "print". It will create a pdf on a **background process** and will save it in a pdfs folder that can be found in the backend in the route **/backend/pdfs/**:

**Button to print the users:**

<p align="center">
  <img alt="Print users button" src="./node-express-app/img/print-users-button.png">
</p>

**Folder with the pdfs generated:**

<p align="center">
  <img alt="pdfs folder" src="./node-express-app/img/pdfs-folder.png">
</p>

---

</p>
</details>

<details>
<summary>AWS Stack</summary>
<p>

### Requirements
- **Nodejs** [Download](https://nodejs.org/es/download/)
- **AWS SAM CLI** (You need to have an **AWS account**). Follow these instructions to install it from the official docs: [Instructions](https://docs.aws.amazon.com/es_es/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- **AWS SDK for Javascript** Follow this two [Installation](https://aws.amazon.com/es/sdk-for-node-js/) steps.

### Installation
#### Backend (AWS)
1. Clone the project writing this in your terminal:

  ```sh
  git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
  ```

2. Install the modules to be zipped for your lambdas, navigating to the folder **sections/CompleteMiniApp/aws-app/backend** and executing the following command:

  ```sh
  npm install
  ```

3. Create a new AWS S3 bucket named **complete-miniapp-pdf-bucket**. This will be needed to host the pdfs generated by the app. Use this AWS CLI command to create it:

  ```sh
  aws s3api create-bucket --bucket complete-miniapp-pdf-bucket --create-bucket-configuration LocationConstraint=eu-west-2
  ```

4. Once you have done all the steps before, you will be able to package and deploy the app. All that can be done by executing a custom script that you can see deeply in the **package.json** file, called "deploy-complete". Here, you can see how to execute it (**important note:** if you want to deploy it again, you must delete the bucket called "complete-mini-app-bucket" first):

  ```sh
  npm run deploy-complete
  ```

5. Then, the app should have been deployed to AWS CloudFormation, with all its components connected between them. Now, we need to get a few important URLs that will help us to connect the backend and the frontend. To get them, go to the [AWS API Gateway section](console.aws.amazon.com/apigateway) inside AWS Console, and get the four we need. It should look like this:

  <p align="center">
    <img alt="API Gateway URLs" src="./aws-app/img/api-gateway-urls.png">
  </p>

6. Optionally, you can run the tests to see if everything is working as expected:

  ```sh
  npm test
  ```

  <p align="center">
    <img alt="AWS backend tests" src="./aws-app/img/aws-backend-tests.png">
  </p>

#### Frontend (AWS - React + Redux)
1. At this point, you should have cloned the repository. Navigate to the folder **sections/CompleteMiniApp/aws-app/frontend** and run this to install the modules:

  ```sh
  npm install
  ```

2. Open the file **./src/config/config.js** and write the urls you got from the last step in the installation of the backend. Here, you can see a correspondence of the variables with the urls (to get this urls, make sure you enter inside each of them and the the endpoint from the stages):

  Correspondence by name:
  ```javascript
  export const BASE_URL_API_BACKEND = '<complete-miniapp-stack-UsersManagementResources-xxxxxxxxx>';
  export const BASE_URL_API_CONNECTION = '<complete-miniapp-stack-DatabaseResources-xxxxxxxxxx>';
  export const BASE_URL_PDF_API = '<complete-miniapp-stack-PdfQueueResources--xxxxxxxxxx>';
  export const URL_WEBSOCKETS_API = '<WebSocketApi>';
  ```

  Example filled:
  ```javascript
  export const BASE_URL_API_BACKEND = 'https://decxo7c0ga.execute-api.eu-west-2.amazonaws.com/dev';
  export const BASE_URL_API_CONNECTION = 'https://g0osoidwl3.execute-api.eu-west-2.amazonaws.com/Prod';
  export const BASE_URL_PDF_API = 'https://8erqyumgvf.execute-api.eu-west-2.amazonaws.com/Prod';
  export const URL_WEBSOCKETS_API = 'wss://4jp9znrjc7.execute-api.eu-west-2.amazonaws.com/dev';
  ```

3. Go to **sections/CompleteMiniApp/aws-app/frontend** and run the app:

  ```sh
  npm start
  ```

### Use
The use is identical to the Non-serverless stack, but there is one different thing, which is where the files (pdfs) are being hosted. Once you press the button to save the users in a pdf, this file is uploaded to an AWS S3 bucket, which is the one we created before. Here, you can see the pdfs inside the bucket:

  <p align="center">
    <img alt="AWS S3 pdfs bucket" src="./aws-app/img/aws-s3-pdfs-bucket.png">
  </p>

Moreover, since the users management is being done with Cognito, to make use of the database, we've added a table to save information about the device everytime a user connects to the app. Here is an example:

  <p align="center">
    <img alt="Table of connections" src="./aws-app/img/table-connections.png">
  </p>

---

</p>
</details>

## Comparative
### Node.js + Express
The process of creating the whole app with this stack has been longer (but not harder) because everything needed to be done step by step. This is not a bad thing, since we have all the control over the app. Joining all the parts together has been easy, since in each of the sections done before have been built incrementally. We have made use of a **REST API**, calling a lot of endpoints. We have also use a **database**, in this case, MongoDB Atlas, to save the information of all the users. We have also **handled files** to write pdfs, and to achieve this, we added them to a queue to be proccessed as a **background task**. In addition, we used **websockets** to notify when an admin connects to the app (checking their role in the database). To see all of the above, we needed to create a **users management** system, to allow the access to all of the functionality, that can be controlled from a **SPA**(Single Page Application).

### AWS Lambda + AWS Stack
In this case, it has been harder to achieve the same goals. As you know, in this project we have been using **AWS SAM** templates to generate the main structures of our stack and connect/configure them. The problem came when i wanted to re-use this templates. I needed to do some research and found something called **"Nested Applications"**, which consisted on handling each of the templates/resources as separated applications. Doing this, we would be able to create a parent template to orchestrate everything from the top to the bottom, passing even custom parameters if it was needed. Here, you can see the folder structure for the templates, and the parent template:

  **Folder structure (aws folder):**
  <p align="center">
    <img alt="AWS SAM folder structure" src="./aws-app/img/aws-sam-structure.png">
  </p>

  **Parent template (app.yaml):**
  
  ```yml
  AWSTemplateFormatVersion: '2010-09-09'
  Transform: AWS::Serverless-2016-10-31
  Description: Complete MiniApp to test the capabilities of AWS Serverless services

  Resources:
    UsersManagementResources:
      Type: AWS::Serverless::Application
      Properties:
        Location: ./aws/users-management.yaml

    DatabaseResources:
      Type: AWS::Serverless::Application
      Properties:
        Location: ./aws/database.yaml

    PdfQueueResources:
      Type: AWS::Serverless::Application
      Properties:
        Location: ./aws/queue-sqs.yaml
        Parameters:
          pdfBucketName: 'complete-miniapp-pdf-bucket'

    WebsocketsResources:
      Type: AWS::Serverless::Application
      Properties:
        Location: ./aws/websockets.yaml
        Parameters:
          websocketsTableName: 'websockets_table'
          webSocketApiName: 'WebSocketApi'
  ```

There was also a problem with some node.js modules. When packaging and deploying the app, some of the node modules weren't being uploaded along with the lambda functions. To solve this, i found out that there was a nice feature called **"lambda layers"**. Creating a new folder, and inside this one, a folder with the name **"nodejs"** (this is required), and creating there its own package.json with the modules we need, we can specify in each function the modules (layer) we want our lambda to work with. Here, you can see an example:

  **Folder structure (lambda-layers folder):**
  <p align="center">
    <img alt="AWS lambda layers folder" src="./aws-app/img/aws-lambda-layers-folder.png">
  </p>

  **Lambda layer in a function (database.yaml):**
  <p align="center">
    <img alt="AWS lambda layer" src="./aws-app/img/aws-lambda-layer.png">
  </p>

In addition, the **CORS** started giving some errors. But in this case, i only needed to add more lambda functions to allow the http method **OPTIONS**, which is used to make a preflight request for each of the endpoints we have in our app.

Having this into account, and knowing that all this happened because i still need to learn a lot, the rest was really easy (even more than with the Non-serverless stack). **REST APIs** could be done in a few steps creating api resources in lambda functions. The database i used was **DynamoDB**, which was fully configured from a SAM template. **File handling** was done with the sdk provided by AWS (aws-sdk). AWS also let us use queues for **background tasking** (SQS). One thing i think they need to improve are the **websockets**. They are a bit confusing (maybe because they had been launched recently), and i needed to do them almost from scratch (Using API Gateway V2, for websockets). **Cognito** service was great. While i needed to do all the implementation for **users management** in the Non-serverless stack, this service allowed the to have a complete Oauth2 flow almost with zero effort.

---

### Summary
AWS provides almost all the necessary services to create large scale applications. The learning curve can be a bit hard at the begining, but once you start to understand how the services flow works, you will be able to create complicated this in less steps than with the Non-serverless stack. Of course, with Node.js + Express you can customize the entire flow, while AWS would be like a black box. You can imagine how it works, but you don't need to go too deep. And this doesn't mean that it will limit you! Indeed, they provide a really huge amount of functionalities that in certain cases, will be handy. For Node.js + Express stack there is more documentation, but if you search enough, you will mostly find everything for AWS too, as it is getting more affluence of people every day. If you want to learn Serverless and in general, cloud stacks, it is definitely a good choice.

Extra: 
[Demostrative video](https://youtu.be/V4CjZ1vMYS4)
