const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/users', require('./routes/user.route'));
app.use('/products', require('./routes/product.route'));
app.use('/auth', require('./routes/auth.route'));


module.exports = app;