const express = require('express');
const Route = express.Router();
const resourceObject = require('./../middlewares/resourceObject');
const { verifyAuth } = require('./../middlewares/auth');

const ProductCtrl= require('./../controllers/product.ctrl');

Route.get('/', ProductCtrl.index);
Route.get('/:id', ProductCtrl.show);
Route.post('/', resourceObject, verifyAuth, ProductCtrl.store);
Route.patch('/:id', resourceObject, verifyAuth, ProductCtrl.update);
Route.delete('/:id', verifyAuth, ProductCtrl.destroy);


module.exports = Route;