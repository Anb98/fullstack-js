const mongoose = require('mongoose');
const schema   = mongoose.Schema;

const productSchema= schema({
    SKU        : String,
    nombre     : String,
    cantidad   : {type: Number, min  : 0},
    precio     : {type: Number, min  : 0},
    descripcion: String,
    imagen     : String,
    created_at : {type: Date, default: Date.now},
    updated_at : Date

});

module.exports = mongoose.model('Product',productSchema);