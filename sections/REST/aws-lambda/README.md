## Documentation of this example REST API
* This API provides the common methods to manage data. In this case, we can manage users.

### Requirements
- Nodejs [Download](https://nodejs.org/es/download/)
- A REST consumer app like POSTMAN [Download](https://www.getpostman.com/downloads/)
- AWS SAM CLI (You will need to have an AWS account). Follow this instructions to install it: [Instructions](https://docs.aws.amazon.com/es_es/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

### Installation
1. Create a folder wherever you want the project to be and go inside it.

2. Go to console and begin in the previous folder route, write the following command to clone this repository (you can download it manually too):

    ```
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```

3. From the console, navigate to the folder "sections/REST/aws-lambda".

4. To install the necessary dependencies for this project, write:
```
npm install
```
At this point, we should have express modules installed automatically.

5. Now that you installed the modules required for this app (just uuid, in this case), we will need to create an AWS S3 bucket.

    If you have read the requirements of this project and have installed AWS SAM CLI, you will also be able to use AWS CLI. To create the bucket, use this command:
    ```
    aws s3api create-bucket --bucket my-bucket --region eu-west-3
    ```
    With this command, we have created a bucket named "my-bucket" in the region "eu-west-3". It's important to keep in mind the region you have chosen because you'll need to use the same region if you're going to use other AWS services(i.e. a DynamoDB database) to make it work.

6. Having created a AWS S3 bucket where our files will be deployed, we need to package our SAM template (this needs to be done before deploying). We can achieve this step by writing this command:
    ```
    sam package --template-file template.yaml --s3-bucket my-bucket --output-template-file packaged-template.yaml
    ```

7. The last step to begin using this Api is the deploy. We must deploy our packaged files to a stack. To do it, just type the following command:
    ```
    sam deploy --template-file packaged-template.yaml --stack-name mystack --capabilities CAPABILITY_IAM
    ```
    The stack is also really important because it will be where all our services exist, and will allow us to see how everything is connected and even use Amazon CloudWatch logs to check if there has been any error.

** Steps from 5 to 7 will be reflected in AWS console. You just need to login to the AWS console and search for them in the "Services" tab. **


### Use

To see the route to make the api requests, we first need to go to AWS console in the browser, and then search for ** Services -> API Gateway -> Select your stack name (in this case, mystack) -> Stages -> Open the Prod or Stage arrow**. There, we need to copy the ** INVOKE url **, which will be something similar to this: https://xxxxxxx.execute-api.eu-west-3.amazonaws.com/Prod


#### GET requests
1. We can ask our API to **get all the users** existing in our database using the following format in our request:

    **Method**: GET <br/>
    **Route:** https://xxxxxxx.execute-api.eu-west-3.amazonaws.com/Prod/users <br/>
    **Body parameters:** none <br/>

2. We are also able to **get one user by username** using the following format in our request:

    **Method**: GET <br/>
    **Route:** https://xxxxxxx.execute-api.eu-west-3.amazonaws.com/Prod/user/{username} <br/>
    **Body parameters:** none <br/>

#### POST requests
1. If you would like to **create a new user**, you can do it with this format:

    **Method**: POST <br/>
    **Route:** https://xxxxxxx.execute-api.eu-west-3.amazonaws.com/Prod/user <br/>
    **Body parameters:** <br/>
    ```
    {
        "username": "exampleusername",
        "password": "1234",
        "name": "myname",
        "lastname": "mylastname"
    }
    ```

#### PUT requests
1. You might want to **update an user**. You can do it this way:

    **Method**: PUT <br/>
    **Route:** https://xxxxxxx.execute-api.eu-west-3.amazonaws.com/Prod/user <br/>
    **Body parameters:** <br/>
    ```
    {
        "userId": "2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d-example",
        "username": "exampleusername",
        "password": "1234",
        "name": "myname",
        "lastname": "mylastname"
    }
    ```

#### DELETE requests
1. Of course, we also need a way to **delete an user**. Use the following format to achieve this:

    **Method**: DELETE <br/>
    **Route:** https://xxxxxxx.execute-api.eu-west-3.amazonaws.com/Prod/user <br/>
    **Body parameters:** <br/>
    ```
    {
        "userId": "2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d-example"
    }
    ```




