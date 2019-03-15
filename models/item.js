var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    itemCode: {
        type:String,
        required: 'Please provide Item Code.'
    },
    itemName: {
        type:String,
        required: 'Please provide Item Name.'
    },
    catalogCategory: {
        type:String,
        required: 'Please provide Catalog Category.'
    },
    description: String,
    rating: String,
    imageUrl: String
}, {collection: 'item'});

var item = mongoose.model('item', itemSchema);

module.exports = item;
