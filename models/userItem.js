var mongoose = require('mongoose');

var userItemSchema = new mongoose.Schema({
    item: String,
    rating: String,
    status: String,
    swapItem: String,
    swapItemRating: String,
    swapperRating: String,
    category: String,
    userId: Number
}, {collection: 'userItem'});

var userItem = mongoose.model('userItem', userItemSchema);

module.exports = userItem;
