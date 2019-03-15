var mongoose = require('mongoose');

var offerSchema = new mongoose.Schema({
    userId: Number,
    itemCodeOwn: String,
    itemCodeWant: String,
    itemStatus: String
}, {collection: 'offer'});

module.exports = mongoose.model('offer', offerSchema);
