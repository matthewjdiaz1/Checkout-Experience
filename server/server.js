// Build your Express app inside server.js and your client app inside the 
// client folder.
const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('client/dist'));

app.get('/', (req, res) => res.send('Hello World, from server.'));

app.listen(port, () => console.log(`Example app listening on port: ${port}!`));