const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();
const connection = require("./db");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// database connection
connection();


app.use('/', router);

app.use((req, res) =>{
   res.status(400).send({ status: false, message: 'invalid URL' })
})



app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});