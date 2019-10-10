## Documentation of this example REST API
* This API provides the common methods to manage data. In this case, we can manage users.

### Requirements
- Nodejs [Download](https://nodejs.org/es/download/)
- A REST consumer app like POSTMAN [Download](https://www.getpostman.com/downloads/)

### Installation
1. Create a folder wherever you want the project to be and go inside it.
2. Go to console and begin in the previous folder route, write the following command to clone this repository (you can download it manually too):

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

    **Method**: GET
    **Route:** http://localhost:3000/users
    **Body parameters:** none

2. We are also able to **get one user by username** using the following format in our request:

    **Method**: GET
    **Route:** http://localhost:3000/user/:username
    **Body parameters:** none

#### POST requests
1. If you would like to **create a new user**, you can do it with this format:

    **Method**: POST
    **Route:** http://localhost:3000/user
    **Body parameters:**
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

    **Method**: PUT
    **Route:** http://localhost:3000/user
    **Body parameters:**
    ```
    {
        "username": "exampleusername",
        "password": "1234",
        "name": "myname",
        "lastname": "mylastname"
    }
    ```

#### DELETE requests
1. Of course, we also need a way to **delete an user**. Use the following format to achieve this:

    **Method**: DELETE
    **Route:** http://localhost:3000/user
    **Body parameters:**
    ```
    {
        "username": "exampleusername"
    }
    ```




