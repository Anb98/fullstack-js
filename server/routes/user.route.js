const express = require('express');
const Route = express.Router();
const resourceObject = require('./../middlewares/resourceObject');

const UserCtrl= require('./../controllers/user.ctrl');

Route.get('/', UserCtrl.index);
Route.get('/:id', UserCtrl.show);
Route.post('/', resourceObject, UserCtrl.store);
Route.patch('/:id', resourceObject, UserCtrl.update);
Route.delete('/:id', UserCtrl.destroy);


module.exports = Route;