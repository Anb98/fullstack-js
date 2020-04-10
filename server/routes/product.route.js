const express = require('express');
const Route = express.Router();
// const middleware = require('./../middlewares');

const ProductCtrl= require('./../controllers/product.ctrl');

Route.get('/', ProductCtrl.index);
Route.get('/:id', ProductCtrl.show);
Route.post('/', ProductCtrl.store);
Route.patch('/:id', ProductCtrl.update);
Route.delete('/:id',ProductCtrl.destroy);


module.exports = Route;