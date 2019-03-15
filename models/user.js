var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    firstName: {
        type:String,
        required: 'Please provide First Name.'
    },
    lastName: {
        type:String,
        required: 'Please provide Last Name.'
    },
    emailAddress: {
        type:String,
        required: 'Please provide Email Address.'
    },
    password: {
        type:String,
        required: 'Please provide Password.'
    },
    address1Field: String,
    address2Field: String,
    city: String,
    state: String,
    postCode: String,
    country: String
    }, {collection: 'user'});

autoIncrement.initialize(mongoose.connection);

userSchema.plugin(autoIncrement.plugin, {model : 'user', field : 'userId', startAt : 1, incrementBy : 1});
//var u = mongoose.connection.model('user', userSchema);

// Custom validation for email
// userSchema.path('emailAddress').validate((val) => {
//     var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// return emailRegex.test(val);
// }, 'Invalid e-mail.');


module.exports = mongoose.model('user', userSchema);
