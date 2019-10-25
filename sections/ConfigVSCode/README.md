## Configuration of VSCode + Node.js

### Required
1. Visual Studio Code: [Download](https://code.visualstudio.com/download)
2. Node.js runtime: [Download](https://nodejs.org/)
    - Although VSCode has support for **JavaScript** and **TypeScript**, this is needed in order to run the node.js application.
    - **Node Package Manager** (npm) is included in the Node.js distribution.

### Create a Node.js application using VSCode
1. In your working directory, create a folder. That's where we are going to create the node example app: <br/>
    ![Create folder in VSCode](./img/vscode-create-folder.png)

2. Create a new file by pressing the **New file** button and call it **app.js**: <br/>
    ![Create new file in VSCode](./img/vscode-create-file.png)

3. Create another new file called **package.json** in the same directory. This file will allow us to indicate what packages should be installed in our node application when we execute the command **npm install**, as well as it will make easier to share our app with other developers. Its content should look similar to this:

    ```json
    {
        "name": "nodejs-vscode-test-package",
        "version": "1.0.0",
        "scripts": {
            "start": "node app.js"
        }
    }
    ```

4. (Optional) Install the **npm extension** to execute typical npm commands (install, run script, show output...). 
    - You can do it clicking on the extensions button: <br/>
        ![Extensions icon](./img/extensions-vscode-icon.png)

    - Then, write npm in the search box: <br/>
        ![Write npm in the extensions search box](./img/vscode-npm-extension.png)

    - Click where it says install: <br/>
        ![Install extension](./img/vscode-install-extension.png)

5. Restart VSCode.
6. Write some JavaScript code in app.js file and save it, for example:
    ```javascript
    let sayHello = "Hello!";
    console.log(sayHello);
    ```
7. From the VSCode nav menu, select **View -> Command palette**.
8. Write **npm** on it, and the common npm scripts will appear: <br/>
    ![Write npm in the palette](./img/vscode-command-palette-npm.png)

9. First, select the option **npm: Install Dependencies**. It will install all the packages that appear in our package.json (none in our case).

10. Secondly, select the one that says **npm: Start** to run our app.js file, and see the result in the vscode console!: <br/>
    ![npm start result](./img/npm-start-result.png)

* Steps from 4 to 10 are optional. Installing npm extension just helps to reproduce the **common npm scripts**, but this can be achieved writing the instructions directly in the command line.


## Configuration of VSCode + AWS SAM

### Required
1. An **AWS Account** is needed. You can obtain an account going to this url: [Create an AWS Account](https://aws.amazon.com/)
2. You must have a supported OS (**Windows, Linux or macOS**).
3. It's necessary that you have installed the **SDK for the language you want** to use. In our case, we have installed **Node.js** SDK, that can be found here: [Install Node.js SDK](https://nodejs.org/en/download/). You just need to choose your OS and download its package.
4. **VSCode with a version >= 1.31.1** (If you have an older version, just update it pressing the "gear" button on the bottom-left side of VSCode and look if there is any available update in the options). Download VSCode if you don't have it: [VSCode download](https://code.visualstudio.com/)
5. **AWS SAM CLI**. This will allow you to develop and test your serverless apps with SAM templates. Follow these instructions to install it: [Install AWS SAM CLI](https://docs.aws.amazon.com/es_es/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
6. **Docker** is needed to work with AWS SAM CLI. It will allow us to work and test our templates locally, helping us with the resources needed to execute the app inside a container.

### Installation
1. Start **VSCode**.
2. Go to the **Activity Bar** on the left side.
3. **Click on extensions icon** (it's an icon with 4 squares). <br/>
    ![Extensions icon](./img/extensions-vscode-icon.png)
4. In the search box, write **AWS Toolkit for Visual Studio Code** and when it appears, click on it.
5. In the right pane, choose install.
6. It will show you a **Reload Required** option. Click it and it will reload VSCode to finish the installation.

### Configure the credentials
1. Get your **AWS Access Keys**. See how to do it in the official docs: [Get AWS Acess Keys](https://docs.aws.amazon.com/es_es/toolkit-for-vscode/latest/userguide/obtain-credentials.html)

2. Once you have the Access Keys, you can **connect** with them from the command line writting (the input data is an example of AWS. You must use your own keys):
    ```
    aws configure
    AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
    AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    Default region name [None]: eu-west-3
    Default output format [None]: ENTER
    ```

3. Make sure you are connected to an AWS profile in VSCode. Open the **Command palette** (View -> Command Palette), and write AWS. Select the option **AWS: Connect to AWS**. There should open an option with your credential profiles, where you should select the one you're going to work with: <br/>
    ![Connect AWS Account profile 2](./img/connect-aws-account2.png)


### Create a Serverless Application (using SAM) with the Toolkit for VSCode
1. Open VSCode, and then, open the **Command Palette** and write AWS. It will automatically display some options. Click the one that says **AWS:Create new SAM Application**. <br/>
    ![Create new sam app image](./img/create-new-sam-app.png)

2. Now, it ask to choose the Runtime we need for our app. Select **nodejs10.x**. <br/>
    ![Select runtime image](./img/select-runtime.png)

3. It will ask know for a folder to create our app. Select the one you preffer or create a new one choosing the option **There are no workspace folders open**. <br/>
    ![Select folder image](./img/select-folder.png)

4. Enter a **name for the project**, for example, "sam-vscode-test-project". The example project should have been created now! The project folder should look like this: <br/>
    ![SAM Project structure image](./img/sam-project-structure.png)


## Comparative

**Configuring Node.js for VSCode has been easier** than doing it for AWS SAM. While in Node.js we didn't need any credentials configuration, in AWS SAM we had to use them to connect our environment with the right access. If you had **AWS SAM CLI** installed before, it's a little easier to configure it, but if you hadn't, it can be harder to get this done.

But this isn't the only thing we can compare, of course. The **tools provided by AWS Toolkit are very powerful**. They allow us to **start a complex project** really quick (creating a template.yaml, test requests, etc.), and **deploy** it directly in a local server using Docker, or even to the AWS Cloud.