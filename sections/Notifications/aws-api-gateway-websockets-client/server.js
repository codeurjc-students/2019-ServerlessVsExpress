const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (err, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(4000, () => console.log(`Server running on port 4000`));