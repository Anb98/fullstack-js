const express = require('express');
const Route = express.Router();
const uploadImg = require('./../middlewares/uploadImg');
const resourceObject = require('./../middlewares/resourceObject');
const { verifyAuth } = require('./../middlewares/auth');
const { validateSave, validateUpdate } = require('./../middlewares/product.middleware');

const ProductCtrl= require('./../controllers/product.ctrl');

Route.get('/', ProductCtrl.index);
Route.get('/:id', ProductCtrl.show);
Route.post('/', resourceObject, verifyAuth, validateSave, uploadImg, ProductCtrl.store);
Route.patch('/:id', resourceObject, verifyAuth, validateUpdate, uploadImg, ProductCtrl.update);
Route.delete('/:id', verifyAuth, ProductCtrl.destroy);


module.exports = Route;