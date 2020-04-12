const express = require('express');
const Route = express.Router();
const { login, verifyAuth } = require('./../middlewares/auth');


Route.post('/login', login);
Route.post('/verifyToken', verifyAuth, (req, res)=>{
	res.status(200).send({
		result: 'valid token'
	})
});

module.exports = Route;