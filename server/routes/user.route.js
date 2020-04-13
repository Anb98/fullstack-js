const express = require('express');
const Route = express.Router();
const resourceObject = require('./../middlewares/resourceObject');
const { verifyAuth } = require('./../middlewares/auth');
const { validateSave, validateUpdate} = require('./../middlewares/user.middleware');

const UserCtrl= require('./../controllers/user.ctrl');

Route.get('/', UserCtrl.index);
Route.get('/:id', UserCtrl.show);
Route.post('/', resourceObject, verifyAuth, validateSave, UserCtrl.store);
Route.patch('/:id', resourceObject, verifyAuth, validateUpdate, UserCtrl.update);
Route.delete('/:id', verifyAuth, UserCtrl.destroy);


module.exports = Route;