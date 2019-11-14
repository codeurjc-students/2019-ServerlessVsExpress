# 2019-ServerlessVsExpress [![GitHub license](https://img.shields.io/github/license/codeurjc-students/2019-ServerlessVsExpress)](https://github.com/codeurjc-students/2019-ServerlessVsExpress/blob/master/LICENSE)
Comparative between serverless stacks (AWS Lambda) and Express in Node.js to create full fledged CRUD Web applications

# Development process

### The development process will be divided in the following sections

- [x] **REST in (Nodejs + express) VS AWS Lambda**
    * Comparative between using REST in a common Nodejs stack and a Serverless.
        1. [Comparative](sections/REST)
        2. [REST (Node.js + express)](sections/REST/nodejs-express)
        3. [REST (AWS Lambda + AWS API Gateway)](sections/REST/aws-lambda)

- [x] **Configuration of Visual Studio Code to use it with Node.js and AWS SAM**
    * In this section, we will see how to configure VSCode IDE and prepare it to be used with Node.js and with AWS SAM.
        1. [Comparative](sections/ConfigVSCode)
        2. [Config VSCode for Node.js](sections/ConfigVSCode/nodejs-vscode-test-project)
        3. [Config VSCode for AWS SAM](sections/ConfigVSCode/sam-vscode-test-project)

- [x] **Static web (SPA) - How to deploy a regular Single Page Application the common way VS Amazon S3**
    * How to deploy a static web normally and how it is done in an Amazon S3 bucket.
        1. [Comparative](sections/SPADeployment)
        2. [React SPA app](sections/SPADeployment/spa-react)

- [x] **Files**
    * Managing files in different environments (nodejs and AWS Lambda).
        1. [Comparative](sections/FilesManagement)
        2. [File handling in Node.js](sections/FilesManagement/nodejs-express)
        3. [File handling in AWS + S3](sections/FilesManagement/aws-s3)

- [x] **Databases**
    * Using (Nodejs + MongoDB) VS (AWS Lambda + DynamoDB).
        1. [Comparative](sections/Databases)
        2. [Database with MongoDB + Node.js](sections/Databases/node-mongodb)
        3. [Database with DynamoDB + AWS](sections/Databases/aws-dynamodb)

- [ ] **Background tasks**
    * Use of background tasks (i.e. generate pdfs...) in both environments.

- [ ] **Notifications**
    * Creating notifications for users making use of Websockets

- [ ] **Users Management**
    * Users management using a typical authentication system in Nodejs and how to do it using "Cognito" instead.

- [ ] **Average cost having chosen one of this stacks**
    * Aproximation to the cost of using a typical stack VS using a Serverless one, having the same parameters. We will see when it's prefferable to use one or another in a short/long term based on AWS prices.