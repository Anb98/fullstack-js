const express = require('express');
const Route = express.Router();
const { login } = require('./../middlewares/auth');


Route.post('/login', login);

module.exports = Route;