
## Documentation
<details>
<summary>Nodejs + Express</summary>
<p>

## Documentation: Nodejs + Express
* This API provides the common methods to manage data. In this case, we can manage users.

### Requirements
- **Nodejs** [Download](https://nodejs.org/es/download/)
- A REST consumer app like **POSTMAN** [Download](https://www.getpostman.com/downloads/)

### Installation
1. Create a folder wherever you want the project to be and go inside it.
2. Go to console and, in the previous folder route, write the following command to **clone this repository** (you can download it manually too):

    ```
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```

3. From the console, navigate to the folder "sections/REST/nodejs-express".
4. To install the necessary dependencies for this project, write:
    ```
    npm install
    ```
    At this point, we should have express module installed automatically, which is going to allow us to set the server and routes.

### Use
We just need to run the server and make requests. We can do that by typing:
```
node index.js
```
After doing this, a window should pop up from our default browser, but if it doesn't, you can access manually in [http://localhost:3000](http://localhost:3000). This is our REST API entry point.

#### GET requests
1. We can ask our API to **get all the users** existing in our database using the following format in our request:

    **Method**: GET <br/>
    **Route:** http://localhost:3000/users <br/>
    **Body parameters:** none <br/>

</p>
</details>

<details>
<summary>AWS Lambda</summary>
<p>

## Documentation: AWS Lambda + AWS API Gateway
* This API provides the common methods to manage data. In this case, we can manage users.

### Requirements
- **Nodejs** [Download](https://nodejs.org/es/download/)
- A REST consumer app like **POSTMAN** [Download](https://www.getpostman.com/downloads/)
- **AWS SAM CLI** (You will need to have an **AWS account**). Follow this instructions to install it: [Instructions](https://docs.aws.amazon.com/es_es/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

### Installation
1. Create a folder wherever you want the project to be and go inside it.

2. Go to console and, in the previous folder route, write the following command to clone this repository (you can download it manually too):

    ```
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```

3. From the console, navigate to the folder **"sections/REST/aws-lambda"**.

4. To install the necessary dependencies for this project, write:
    ```
    npm install
    ```
    At this point, we should have node modules installed automatically.

5. Now that you installed the modules required for this app (just **"uuid"**, in this case, to use unique ids), we will need to create an **AWS S3 bucket**.

    If you have read the requirements of this project and have installed **AWS SAM CLI**, you will also be able to use **AWS CLI**. To create the bucket, use this command:
    ```
    aws s3api create-bucket --bucket my-bucket --region eu-west-3
    ```
    With this command, we have created a **bucket named "my-bucket"** in the **region "eu-west-3"**. It's important to keep in mind the region you have chosen because you'll need to use the same region if you're going to use other AWS services(i.e. **DynamoDB database**) to make it work.

6. Having created an AWS S3 bucket where our files will be deployed, we need to **package our SAM template** (this needs to be done before deploying). We can achieve this step by writing this command:
    ```
    sam package --template-file template.yaml --s3-bucket my-bucket --output-template-file packaged-template.yaml
    ```

7. The last step to begin using this API is the **deploy**. We must deploy our packaged files to a **stack**. To do it, just type the following command:
    ```
    sam deploy --template-file packaged-template.yaml --stack-name mystack --capabilities CAPABILITY_IAM
    ```
    The stack is also really important because it will be where all our services exist, and will allow us to see **how everything is connected**. You can even use **Amazon CloudWatch** logs to check if there has been any error in one of your lambda functions.

**Steps from 5 to 7 will be reflected in AWS console. You just need to login to the AWS console and search for them in the "Services" tab.**


### Use

To see the route to make the api requests, we first need to go to AWS console in the browser, and then search for **Services -> API Gateway -> Select your stack name (in this case, mystack) -> Stages -> Open the Prod or Stage arrow**. There, we need to copy the **INVOKE url**, which will be something similar to this: https://xxxxxxx.execute-api.eu-west-3.amazonaws.com/Prod


#### GET requests
1. We can ask our API to **get all the users** existing in our database using the following format in our request:

    **Method**: GET <br/>
    **Route:** https://xxxxxxx.execute-api.eu-west-3.amazonaws.com/Prod/users <br/>
    **Body parameters:** none <br/>

</p>
</details>

## Comparative

### Differences based on the implementation
In Nodejs, we just need to define a GET resource in our Express app variable, where we will either serve our data, or return an error. The return object, can be customized the way we want. In our code, we have an example:

```javascript
app.get('/users', (req, res) => {
    services.getAllUsers()
    .then((users) => {
        res.send({
            error: false,
            code: 200,
            message: 'Users fetched successfully',
            data: users
        });
    })
    .catch((err) => {
        res.send({
            error: true,
            code: 200,
            message: err
        });
    });
    
});
```

If we try to do the same thing with AWS Lambda, the way to do it changes. We must define a **handler** for every Lambda function we have. In our case, in our **template.yaml** file, we have a function called **usersFunction**, where the handler points to **index.usersHandler**. We can define our handler like this, in our index file:

```javascript
exports.usersHandler = (event, context, callback) => {
    switch (event.httpMethod) {
        case 'GET':
            getAllUsers(callback);
            break;
        default:
            sendResponse(400, `Unsupported method ${event.httpMethod}`, callback);
    }
};
```

One more noticeable difference is that in **AWS Lambda**, we must return always a **response with two attributes**, a statusCode (integer), and a body (it must be a JSON object):

```javascript
const sendResponse = (statusCode, message, callback) => {
    const res = {
        statusCode: statusCode,
        body: JSON.stringify(message)
    };
    callback(null, res);
};
```

We can also see that instead of a send method, as the one we had in Express, we have now a **callback()**, where the response is sent in the second parameter.

### Differences based on the functionality
When it comes to functionality, they behave kind of different. They both serve the data if requested, but if there is a use case where the server has to **attend too many requests**, the nodejs stack could lead to a **bottleneck**, stopping some of its functionality, while in the AWS Lambda stack, as we have our **endpoint wrapped in a Lambda function**, it could **scale easily**, replicating the lambda if necessary, allowing us to keep our event listeners working. 

The Lambda functions behaviour also implies that if we need to save something in non-persistent memory, this **data will not exist once the lambda is replicated**, because it would run under a **different Runtime environment**. That means, if we would like to create a full CRUD API, we would need a database to keep or data safe.