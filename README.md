# 2019-ServerlessVsExpress [![GitHub license](https://img.shields.io/github/license/codeurjc-students/2019-ServerlessVsExpress)](https://github.com/codeurjc-students/2019-ServerlessVsExpress/blob/master/LICENSE)
Comparative between serverless stacks (AWS Lambda) and Express in Node.js to create full fledged CRUD Web applications

# Development process

### The development process will be divided in the following sections

- [x] **REST in (Nodejs + express) VS AWS Lambda**
    * Comparative between using **REST** in a common Nodejs stack and a Serverless.
        1. [Comparative](sections/REST)
        2. [REST (Node.js + express)](sections/REST/nodejs-express)
        3. [REST (AWS Lambda + AWS API Gateway)](sections/REST/aws-lambda)

- [x] **Configuration of Visual Studio Code to use it with Node.js and AWS SAM**
    * In this section, we will see how to **configure VSCode IDE** and prepare it to be used with Node.js and with AWS SAM.
        1. [Comparative](sections/ConfigVSCode)
        2. [Config VSCode for Node.js](sections/ConfigVSCode/nodejs-vscode-test-project)
        3. [Config VSCode for AWS SAM](sections/ConfigVSCode/sam-vscode-test-project)

- [x] **Static web (SPA) - How to deploy a regular Single Page Application the common way VS Amazon S3**
    * How to deploy a **Single Page Application** normally and how it is done in an Amazon S3 bucket.
        1. [Comparative](sections/SPADeployment)
        2. [React SPA app](sections/SPADeployment/spa-react)

- [x] **Files**
    * **Managing files** in different environments (nodejs and AWS Lambda).
        1. [Comparative](sections/FilesManagement)
        2. [File handling in Node.js](sections/FilesManagement/nodejs-express)
        3. [File handling in AWS + S3](sections/FilesManagement/aws-s3)

- [x] **Databases**
    * Using (Nodejs + **MongoDB**) VS (AWS Lambda + **DynamoDB**).
        1. [Comparative](sections/Databases)
        2. [Database with MongoDB + Node.js](sections/Databases/node-mongodb)
        3. [Database with DynamoDB + AWS](sections/Databases/aws-dynamodb)

- [x] **Background tasks**
    * Use of **background tasks** (i.e. generate pdfs...) in both environments.
        1. [Comparative](sections/BackgroundTasks)
        2. [Background Tasks with Node.js + Express + RabbitMQ](sections/BackgroundTasks/nodejs-express-rabbitmq)
        3. [Background Tasks with AWS + S3 + SQS](sections/BackgroundTasks/aws-s3-sqs)

- [x] **Notifications/Websockets**
    * Creating notifications for users making use of **Websockets**.
        1. [Comparative](sections/Notifications)
        2. [Notifications with Node.js + Socket.io (server and client)](sections/Notifications/nodejs-socket-io)
        3. [Notifications with AWS + API Gateway V2 (server)](sections/Notifications/aws-api-gateway-websockets)
        4. [Notifications with AWS + API Gateway V2 (client)](sections/Notifications/aws-api-gateway-websockets-client)

- [x] **Users Management**
    * Users management using a typical **authentication system** in Node.js and how to do it using "AWS Cognito" instead.
        1. [Comparative](sections/UsersManagement)
        2. [Users Management with Node.js + Express (Backend)](sections/UsersManagement/nodejs-express)
        3. [Users Management React SPA (Frontend for Node.js + Express version)](sections/UsersManagement/frontend-react-nodejs)
        4. [Users Management with AWS Cognito (Backend)](sections/UsersManagement/aws-cognito)
        5. [Users Management React SPA (Frontend for AWS Cognito version)](sections/UsersManagement/frontend-react-aws-cognito)

- [x] **Average cost having chosen one of this stacks**
    * Aproximation to the cost of using a typical stack VS using a Serverless one. We will see when it's prefferable to use one or another in a short/long term based on AWS prices.
        1. [Comparative](sections/CostEstimation)

- [x] **Complete Mini App using all the features above (+ testing)**
    * Creation of a complete small app using all the features above in both stacks, also adding tests for both implementations.
        1. [Comparative](sections/CompleteMiniApp)
        2. [Complete Miniapp Node.js + Express](sections/CompleteMiniApp/node-express-app)
        3. [Complete Miniapp Node.js + Express](sections/CompleteMiniApp/aws-app)