## Comparative between websockets in Node.js + Socket.io and AWS Lambda + API Gateway Websockets
### Projects installation
<details>
<summary>Node.js + Socket.io</summary>
<p>

### Requirements
- **Node.js** [Download](https://nodejs.org/es/download/)

### Node.js + Socket.io installation
1. Clone the repository using the command line:

    ```
    git clone https://github.com/codeurjc-students/2019-ServerlessVsExpress.git
    ```

2. From the command line, navigate to the folder **sections -> Notifications -> nodejs-socket-io**
3. Write the following command to **install the packages**, including socket.io:

    ```
    npm install
    ```

4. The last step is **running the server**:

    ```
    npm start
    ```

### Use
You can try this section using your browser. You just need to go to the url [http://localhost:3000](http://localhost:3000) after running the server. To be more realistic and simulate a **multiclient environment**, make sure to **open more than one browser window** with that url. A log should appear in your console everytime a new user/client connects to the server:

![Users connecting to the server](./img/users-connecting-server.png)

This project is an **auction simulator**, so, you should be able to **make a bid** from the different browser windows and the changes should be reflected in the rest of the windows. The changes can be seen in the **current max bid**, and the **bids history** on a right panel:

1. A first user makes a bid:

![First user makes a bid](./img/first-user-bid.png)

2. A second user sees changes reflected in his screen:

![Second user sees changes reflected](./img/second-user-changes-reflected.png)

3. The second user makes a new bid, surpassing the first one, and also, gets added to the history:

![Second user makes a new bid](./img/second-user-bid.png)

4. When the users close the window, they disconnect from the server:

![Users disconnect](./img/users-disconnect.png)

---

</p>
</details>

<details>
<summary>AWS Lambda + API Gateway Websockets</summary>
<p>

---

</p>
</details>

## Comparative

### Node.js + Socket.io
Socket.io is composed by two parts:
- A **server** that mounts on the **Node.js HTTP server** ([socket.io](https://github.com/socketio/socket.io)).
- A **client** that communicates with the server and loads in the browser side: ([socket.io-client](https://github.com/socketio/socket.io-client)).

#### Server side:
Socket.io needs an initialized instance to work. You can do that by passing the http server object in the require:

```javascript
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
```

Once we have the io object initialized, we can use io methods, for example, to listen for user connections:

```javascript
io.on('connection', (socket) => {
    console.log('User connected');
});
```

After that, we would have a socket object, which is, indeed the connection between the user and the server. This allows us to, for example, listen for a type of event from the client, which would include a JSON object containing the data:

```javascript
socket.on('incoming bid', (msg) => {
    console.log(JSON.stringify(msg));
});
```

There also exist **reserved events**, which are useful to control typical scenarios. To give you an example, we could know when an user has been disconnected:

```javascript
socket.on('disconnect', () => {
    console.log(`User ${socket.id} has been disconnected`);
});
```

But, what if we want to create a broadcast event to spread information to all the clients? Socket.io didn't forget about that, and let us do it by using the **emit** method:

```javascript
if(parseFloat(msg.amount) > parseFloat(currentBidAmount)) {
    currentBidAmount = msg.amount;
    // Broadcast the message to all the users connected
    io.emit('bid history', msg);
}
```

#### Client side:
On the client side, we can import the client socket.io version like this, in the html template (right before the "closing body" tag):

```html
    <!-- Rest of the html -->
    <script src="/socket.io/socket.io.js"></script>
</body>
```

Then, we need do create the **io object** to send events and listen them from the server side:

```html
<script>
    let socket = io();
</script>
```

To **send events** to the server, which is listening all the time to its connected clients by using sockets, we can use also the **emit event** from the io object:

```javascript
if(bid_amount !== "")
    socket.emit('incoming bid', {amount: bid_amount});
```

### AWS Lambda + AWS API Gateway Websockets


### Summary