const express = require('express');
const Route = express.Router();
const resourceObject = require('./../middlewares/resourceObject');
const { validateSave, validateUpdate} = require('./../middlewares/user.middleware');

const UserCtrl= require('./../controllers/user.ctrl');

Route.get('/', UserCtrl.index);
Route.get('/:id', UserCtrl.show);
Route.post('/', resourceObject, validateSave, UserCtrl.store);
Route.patch('/:id', resourceObject, validateUpdate, UserCtrl.update);
Route.delete('/:id', UserCtrl.destroy);


module.exports = Route;