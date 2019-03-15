var mongoose = require('mongoose');

var feedbackUserSchema = new mongoose.Schema({
    offerId: {
        type: String, required: true
    },
    userId: {
        type: String, required: true
    },
    swapUserId: {
        type: String, required: true
    },
    rating: {
        type: String, required: true
    },
    feedback: {
        type: String, required: true
    }
});

var feedbackuser = mongoose.model('userFeedBack', feedbackUserSchema);

var feedbackItemSchema = new mongoose.Schema({
    code: {
        type: String, required: true
    },
    userId: {
        type: String, required: true
    },
    rating: {
        type: String, required: true
    },
    feedback: {
        type: String, required: true
    }
});

var feedbackitem = mongoose.model('itemFeedBack', feedbackItemSchema);


module.exports.addOfferFeedbackByUser = function(code, userId, rating, feedback){
    var feedItem = new feedbackitem(code, userId, rating, feedback);

    feedItem.save(function (err) {
        if (!err) {
            console.log("Saved successfully");
        } else {
            console.log('Error during record insertion : ' + err);
        }
    });
};

module.exports.addOfferFeedback = function(offerId, userId, swapUserId, rating, feedback) {
    var userFeedback = new feedbackuser(offerId, userId, swapUserId, rating, feedback);

    userFeedback.save(function (err) {
        if (!err) {
            console.log("Saved successfully");
        } else {
            console.log('Error during record insertion : ' + err);
        }
    });
};