const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// Routes
app.use('/users', require('./routes/user.route'));
app.use('/products', require('./routes/product.route'));


module.exports = app;