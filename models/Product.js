const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    img : {
        type : String,
        required : true,
    },
    categories : {
        type : Array,
        required : true,
    },
    size : {
        type : Array,
    },
    color : {
        type : Array,
    },
    price : {
        type : Number,
        required : true,
    },
    inStock : {
        type : Boolean
    }
}, {timestamps : true});

module.exports = mongoose.model('Product', productSchema);