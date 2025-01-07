require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');

var cors = require('cors');
var app = express();
var auth = require('./src/routes/auth');
connectToMongo(); 
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
app.use('/api/auth',auth);

app.listen(port, () => {
  console.log(`App listening on localhost:${port}`)
})
