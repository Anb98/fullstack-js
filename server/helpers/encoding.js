const sha256 = require('js-sha256');
const jwt = require('jsonwebtoken');
const { salt, token } =require('./../config');

module.exports = {
	encodePass(pass){
		return sha256(pass + salt)
	},
	encodeToken(value){
        return jwt.sign(value, token, { expiresIn: '1d'});
    }
}