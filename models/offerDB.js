// OfferDB – create the function “OfferDB” to store and get offer details into and from the database:
// addOffer(userID, itemCodeOwn, itemCodeWant, itemStatus) – this method adds an offer to the database. The userID here refers to the user that is making the offer and itemCodeOwn is the itemCode that this user owns and itemCodeWant is the item code they would like to get.
// updateOffer(offerID, itemStatus) – this method updates the status of the offer in the database.

var offer = require(path.join(__dirname + '/../models/offer.js'));

module.exports.addOffer = function(userId, itemCodeOwn, itemCodeWant, itemStatus){
    var ofr = new offer(userId, itemCodeOwn, itemCodeWant, itemStatus);

    ofr.save(function (err) {
        if(!err){
            //render to any page after successful save
        } else {
            //handle validations if any
            console.log("Error");
        }
    });
};

module.exports.updateOffer= function(offerId, itemStatus)  {

    offer.findOneAndUpdate(
        {'_id' : offerId}, // find a document with that filter
        {itemStatus : itemStatus},
        {upsert: false, new: true, runValidators: true}, // options
        function (err, doc) {  // callback
            if (err) {
                throw err;
            } else {
                //render or give some message
                console.log(doc);
                //res.redirect('back');
            }
        });
};