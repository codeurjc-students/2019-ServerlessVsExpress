## Comparative of Background Tasks/Processes in Node.js + Express VS AWS Lambda
### Projects installation

<details>
<summary>Node.js + Express + RabbitMQ</summary>
<p>

### Requirements
- **Node.js** [Download](https://nodejs.org/es/download/)
- **POSTMAN** or your prefered way to do HTTP requests to an API [Get POSTMAN](https://www.getpostman.com/downloads/)
- **RabbitMQ** server. You can follow these steps to install it:
    1. Type this command on the terminal:
        **Linux Systems**<br>
        ```
        sudo apt-get install rabbitmq-server
        ```

        **MacOS**<br>
        ```
        brew install rabbitmq
        ```

    2. Check the installation was correct typing:
        ```
        rabbitmq-server
        ```

        If everything is fine, you should see something like this:<br>

        ```
        ##  ##      RabbitMQ 3.8.1
        ##  ##
        ##########  Copyright (c) 2007-2019 Pivotal Software, Inc.
        ######  ##
        ##########  Licensed under the MPL 1.1. Website: https://rabbitmq.com

        Doc guides: https://rabbitmq.com/documentation.html
        Support:    https://rabbitmq.com/contact.html
        Tutorials:  https://rabbitmq.com/getstarted.html
        Monitoring: https://rabbitmq.com/monitoring.html

        Logs: /usr/local/var/log/rabbitmq/rabbit@localhost.log
                /usr/local/var/log/rabbitmq/rabbit@localhost_upgrade.log

        Config file(s): (none)

        Starting broker... completed with 6 plugins.
        ```

    3. To **access the UI** provided by RabbitMQ, you can **create an user** this way:
        ```
        rabbitmqctl add_user username userpass
        ```

    4. Then, you need to **make this user adminstrator**:
        ```
        rabbitmqctl set_user_tags username administrator
        ```

    5. **Access to this url** with the user credentials created above [http://localhost:15672](http://localhost:15672). This will be helpful if you want to see your queues in action!

### Installation

#### Node.js + express app installation
1. Clone the repository using the command line:

    ```
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```

2. Navigate to the folder **sections -> BackgroundTasks -> nodejs-express-rabbitmq**.

3. Write the following command to install the project dependencies:

    ```
    npm install
    ```

4. Start Node.js + express server:

    ```
    npm start
    ```

#### Use
As we use to in the other sections, i've created and endpoint in the url [http://localhost:3000/generatePdf](http://localhost:3000/generatePdf). This endpoint, in the background, will **create a task**. This task will be added to a queue called **pdfQueue**, to be treated in the background. To create the request, you need to use **POST Method** with this body's content:

```
{
	"pdfData": {
		"title": "mytitle",
		"content": "This is the pdf content"
	}
}
```

If everything is correct, the **pdf will be generated in a background process** (in your root folder). Queue status can be found in [http://localhost:15672/#/queues](http://localhost:15672/#/queues), where you'll be able to see a lot of information. Here, you can see an example:

![RabbitMQ UI queue data example](./img/rabbitmq-queue-status.png)

---

</p>
</details>

<details>
<summary>AWS Lambda + S3 + SQS</summary>
<p>


</p>
</details>

## Comparative

### Node.js + Express + RabbitMQ - Background Tasks
There are many famous libraries to manage background tasks in Node.js. One of the most famous is **RabbitMQ**, which is the one i've chosen for this example (the callback version). The working flow RabbitMQ uses depends on two main entities, **exchanges** and **queues**. Queues are where the **messages are stored**, and at the same time, are **binded to an exchange**. They are both connected by a **"Route"**, which decides whether to move forward the message to a queue or not, depending on the type of the exchange.

Exchanges can be of **different types**:

- **direct**: The message goes to the queues whose binding key matches the key of the message.
- **topic**:  It's the same than a direct type, but it is used to broadcast a message.
- **headers**: It can be used when we need to filter with something more than a routing key, which could be better in some cases.
- **fanout**: This is the "hardest" type. It can be used when we need the message to be forwarded to all queues, and can also be used for broadcasting.

To import the callback version of RabbitMQ, write this on your app:

```javascript
const amqp = require('amqplib/callback_api');
```

Once you've imported the library, make sure your RabbitMQ server is running (write **rabbitmq-server** on the terminal if isn't). Then, you need to connect to the RabbitMQ server (we used localhost):

```javascript
amqp.connect('amqp://localhost', (err, conn) => {
    if(err) {
        console.error(err);
        process.exit(1);
    }
    consumer(conn);
    publisher(conn, req.body.pdfData);
});
```

Inside the connect, you can see two functions (**consumer** and **publisher**). We need them to create a **communication channel**, where we'll **add messages** to a queue using the publisher, and the consumer will **get the messages** from the queue (they must both connect to the channel) and **process** them. It will send an **ACK** with the original message as parameter to indicate that it was received properly, and then delete it from the queue.

Here, you can see the code of the **publisher**:

```javascript
const publisher = (conn, pdfData) => {
    const queue = 'pdfQueue';
    conn.createChannel((err, channel) => {
        if(err) {
            console.error(err);
            process.exit(1);
        }
        channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(pdfData)), {persistent: true});
    });
};
```

You can also have a look at the **consumer** here:

```javascript
const consumer = (conn) => {
    const queue = 'pdfQueue';
    conn.createChannel((err, channel) => {
        if(err) {
            console.error(err);
            process.exit(1);
        }
        channel.assertQueue(queue, { durable: true }); // Durable: true makes the queue to persist even if connection has been closed
        channel.consume(queue, async (pdfData) => {
            try {
                let pdf = JSON.parse(pdfData.content.toString());
                let pdfGenerated = await generatePdf(pdf);
                if(pdfGenerated.error) {
                    console.log(pdfGenerated.error); 
                } else {
                    console.log(`The pdf has been generated in: ${pdfGenerated.response.filename}`);  
                }
                // Send back the ack to let it know that the bg task was completed
                channel.ack(pdfData);
            } catch(err) {
                console.log({error: err});
            }
             
        }, { noAck: false }); // This tells the server to not delete the message once it's delivered
    });
};
```

---

### AWS Lambda + S3 + SQS


### Summary