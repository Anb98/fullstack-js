const sha256 = require('js-sha256');
const { salt } =require('./../config');

module.exports = {
	encodePass(pass){
		return sha256(pass + salt)
	}
}