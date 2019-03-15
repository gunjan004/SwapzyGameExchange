var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

mongoose.Promise = global.Promise;
var connection = mongoose.connect('mongodb://localhost:27017/swapzy_db', { useNewUrlParser: true });

var CounterSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);

// make this available in application
module.exports = mongoose;
module.exports = connection;
