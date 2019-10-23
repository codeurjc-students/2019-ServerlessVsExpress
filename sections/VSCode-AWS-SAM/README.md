## Configuration of VSCode + AWS SAM

### Required
1. An **AWS Account** is needed. You can obtain an account going to this url: [Create an AWS Account](https://aws.amazon.com/)
2. You must have a supported OS (**Windows, Linux or macOS**).
3. It's necessary that you have installed the **SDK for the language you want** to use. In our case, we have installed **Node.js** SDK, that can be found here: [Install Node.js SDK](https://nodejs.org/en/download/). You just need to choose your OS and download its package.
4. **VSCode with a version >= 1.31.1** (If you have an older version, just update it pressing the "gear" button on the bottom-left side of VSCode and look if there is any available update in the options). Download VSCode if you don't have it: (VSCode download)[https://code.visualstudio.com/]
5. **AWS SAM CLI**. This will allow you to develop and test your serverless apps with SAM templates. Follow these instructions to install it: (Install AWS SAM CLI)[https://docs.aws.amazon.com/es_es/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html]
6. **Docker** is needed to work with AWS SAM CLI. It will allow us to work and test our templates locally, helping us with the resources needed to execute the app inside a container.

### Installation
1. Start **VSCode**.
2. Go to the **Activity Bar** on the left side.
3. **Click on extensions icon** (it's an icon with 4 squares).
    ![Extensions icon](./img/extensions-vscode-icon.png)
4. In the search box, write **AWS Toolkit for Visual Studio Code** and when it appears, click on it.
5. In the right pane, choose install.
6. It will show you a **Reload Required** option. Click it and it will reload VSCode to finish the installation.

### Configure the credentials
1. Get your AWS Access Keys. See how to do it in the official docs: (Get AWS Acess Keys)[https://docs.aws.amazon.com/es_es/toolkit-for-vscode/latest/userguide/obtain-credentials.html]
2. Once you have the Access Keys, you can connect with them from the command line writting (the input data is an example of AWS. You must use your own keys):
    ```
    aws configure
    AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
    AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    Default region name [None]: eu-west-3
    Default output format [None]: ENTER
    ```
3. Make sure you are connected to an AWS profile in VSCode. Open the **Command palette** (View -> Command Palette), and write AWS. Select the option **AWS: Connect to AWS**. There should open an option with your credential profiles, where you should select the one you're going to work with:
    ![Connect AWS Account profile](./img/connect-aws-account1.png)
    ![Connect AWS Account profile 2](./img/connect-aws-account2.png)

### Create a Serverless Application (using SAM) with the Toolkit for VSCode
1. Open VSCode, and then, open the **Command Palette** and write AWS. It will automatically display some options. Click the one that says **AWS:Create new SAM Application**.
    ![Create new sam app image](./img/create-new-sam-app.png)
2. Now, it ask to choose the Runtime we need for our app. Select **nodejs10.x**.
    ![Select runtime image](./img/select-runtime.png)
3. It will ask know for a folder to create our app. Select the one you preffer or create a new one choosing the option **There are no workspace folders open**.
    ![Select folder image](./img/select-folder.png)
4. Enter a **name for the project**, for example, "sam-vscode-test-project". The example project should have been created now! The project folder should look like this:
    ![SAM Project structure image](./img/sam-project-structure.png)