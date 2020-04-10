const express = require('express');
const Route = express.Router();
// const middleware = require('./../middlewares');

const UserCtrl= require('./../controllers/user.ctrl');

Route.get('/', UserCtrl.index);
Route.get('/:id', UserCtrl.show);
Route.post('/', UserCtrl.store);
Route.patch('/:id', UserCtrl.update);
Route.delete('/:id', UserCtrl.destroy);


module.exports = Route;