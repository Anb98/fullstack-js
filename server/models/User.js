const mongoose = require('mongoose');
const schema   = mongoose.Schema;

const userSchema= schema({
	nombre: { 
		type: String,
		trim: true
	},
    telefono: Number,
    username: {
		type: String,
		unique: true,
		index:true,
		trim:true,
	},
    fecha_nacimiento: Date,
    email: {
		type: String,
		lowercase: true,
		trim:true,
		unique: true,
		index:true,
	},
    password: {type: String, select:false},
    created_at: {type: Date, default: Date.now},
    updated_at: Date

});

module.exports = mongoose.model('User',userSchema);