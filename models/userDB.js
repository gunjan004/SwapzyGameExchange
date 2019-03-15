var path = require('path');
var itemDB = require(path.join(__dirname + '/../models/itemDB.js'));
var userItem = require(path.join(__dirname + '/../models/userItem.js'));
var user = require(path.join(__dirname + '/../models/user.js'));
var userDB = require(path.join(__dirname + '/../models/userDB.js'));
const url = require('url');

/*  RENDER ACCORDING TO DEFAULT USER */
module.exports.getDefaultUser = function (req, res, userObj, path){

    user.findOne({userId: 0}, function (err, doc) {
        if (err) throw err;
        if (doc) {

            var defaultUsr = "default";
            var userData = doc.firstName;

            if(path === '/' || path === 'index') {
                res.render('index', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr});
            } else if(path === 'signIn'){
                res.render('signIn', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr, usr : ''});
            } else if(path === 'about'){
                res.render('about', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr});
            } else if(path === 'contact'){
                res.render('contact', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr});
            } else if(path === 'categories'){
                return itemDB.fetchCategoriesAndItems(req, res, userObj, defaultUsr, userData);
            } else if(path === 'swaps'){
                return itemDB.fetchItemsSwapsPage(req, res, userObj, defaultUsr, userData);
            } else if(path === 'mySwaps'){
                return itemDB.mySwapsFunction(req, res, userObj, defaultUsr, userData);
            } else if(path === 'myItems'){
                return userDB.getItemsForMyGames(req, res, userObj, defaultUsr, userData);
            } else if(path === 'item'){
                return userDB.getItem(req, res, userObj, defaultUsr, userData);
            } else if(path === 'register') {
                res.render('register', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr, usr: ''});
            }   else if(path === 'addNewItem') {
                res.render('addNewItem', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr, usr: ''});
            } else if(path === 'confirmSwap'){
                return itemDB.confirmSwapMethod(req, res, userObj, defaultUsr, userData);
            } else if(path === 'feedback'){
                return itemDB.feedBackMethod(req, res, userObj, defaultUsr, userData);
            } else if(path === 'feedbackPost'){
                return itemDB.feedBackPost(req, res, userObj, defaultUsr, userData);
            } else {
                res.send('404 URL not found!! Please provide proper URL.');
            }
        } else {
            console.log(err);
        }
    });
};

/*  RENDER ACCORDING TO SIGNED IN USER */
module.exports.getUserData = function(req, res, userObj, path){

    user.findOne({userId: userObj.userId}, function (err, doc) {
        if (err) throw err;

        if (doc) {
            var defaultUsr;
            if (req.session.defaultUser === undefined) {
                defaultUsr = "default";
            } else {
                defaultUsr = "not default";
            }
            var userData = doc.firstName;

            if(path === '/' || path === 'index') {
                res.render('index', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr});
            } else if(path === 'signIn'){
                res.render('signIn', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr, usr : ''});
            } else if(path === 'about'){
                res.render('about', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr});
            } else if(path === 'contact'){
                res.render('contact', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr});
            }else if(path === 'categories'){
                return itemDB.fetchCategoriesAndItems(req, res, userObj, defaultUsr, userData);
            } else if(path === 'swaps'){
                return itemDB.fetchItemsSwapsPage(req, res, userObj, defaultUsr, userData);
            } else if(path === 'mySwaps'){
                return itemDB.mySwapsFunction(req, res, userObj, defaultUsr, userData);
            } else if(path === 'myItems'){
                return userDB.getItemsForMyGames(req, res, userObj, defaultUsr, userData);
            } else if(path === 'item'){
                return userDB.getItem(req, res, userObj, defaultUsr, userData);
            } else if(path === 'register') {
                res.render('register', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr, usr: ''});
            }  else if(path === 'addNewItem') {
                res.render('addNewItem', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr, usr: ''});
            } else if(path === 'confirmSwap'){
                return itemDB.confirmSwapMethod(req, res, userObj, defaultUsr, userData);
            } else if(path === 'feedback'){
                return itemDB.feedBackMethod(req, res, userObj, defaultUsr, userData);
            } else if(path === 'feedbackPost'){
                return itemDB.feedBackPost(req, res, userObj, defaultUsr, userData);
            } else {
                res.send('404 URL not found!! Please provide proper URL.');
            }

        } else {
            return userDB.getDefaultUser(req, res, userObj, path);
        }
    });
};

/* CATEGORIES PAGE LOAD - User Specific Data*/
module.exports.getUserItems = function(req, res, userObj, userData, defaultUsr, catItems){

    var itemNameList = [];
    var newCatItems = {};

    userItem.find({userId: userObj.userId}, function (err, userItems) {
        if (err) throw err;

        if (userItems) {

            for(let s = 0; s < userItems.length; s++) {
                itemNameList.push(userItems[s].item);
            }

            for(let category in catItems) {
                for (let i = 0; i < catItems[category].length; i++) {
                    if (!itemNameList.includes(catItems[category][i].itemName)) {
                        if (newCatItems.hasOwnProperty(category)) {
                            newCatItems[category].push(catItems[category][i]);
                        } else {
                            newCatItems[category] = [catItems[category][i]];
                        }
                    }
                }
            }

            res.render('categories', {catItems : newCatItems, userData : userData, sessionData : userObj, defaultUsr : defaultUsr});

        } else {
            console.log("Error");
        }
    });
};

/* MY SWAPS PAGE LOAD - Default User */
module.exports.getDefUserItemsMySwapsPg = function(req, res, userObj, userData, defaultUsr){

    //call default items if no user is logged in
    userItem.find({userId: 0}, function (err, userItems) {
        if (err) throw err;

        if (userItems) {

            res.render('mySwaps', {userData : userData, sessionData : userObj, myUserItemList : userItems, defaultUsr : defaultUsr, updateStat : ''});
        } else {
            res.render('mySwaps', {userData : userData, sessionData : userObj, myUserItemList : undefined, defaultUsr : defaultUsr, updateStat : ''});
            console.log("Error");
        }
    });

};

/* MY SWAPS PAGE LOAD - SignedIn User */
module.exports.getUserItemsMySwapsPg = function(req, res, userObj, userData, defaultUsr, updateStat){

    //call mySwaps items for logged in user
    userItem.find({userId: userObj.userId}, function (err, userItems) {
        if (err) throw err;

        if (userItems) {
            res.render('mySwaps', {userData : userData, sessionData : userObj, myUserItemList : userItems, defaultUsr : defaultUsr, updateStat : updateStat});
        } else {
            //if no user in db of that user id then call default items
            return getDefUserItemsMySwapsPg(req, res, userObj, userData, defaultUsr);
        }
    });
};

/* MY SWAPS PAGE ACCEPT ACTION */
module.exports.acceptButtonAction = function(req, res, userObj, userData, defaultUsr, itemOnUI){

    userItem.findOneAndUpdate(
        {item : itemOnUI}, // find a document with that filter
        {status : 'Swapped'},
        {upsert: false, new: true, runValidators: true}, // options
        function (err, doc) {  // callback
            if (err) {
                throw err;
            } else {
                //render or give some message
                console.log(doc);

                //res.redirect('back');
                return res.redirect(url.format({
                    pathname:"mySwaps",
                    query: {
                        "statusUpdate":"Accepted successfully! Status changed to 'Swapped'."
                    }
                }));
            }
        });
};

/* MY SWAPS PAGE REJECT/WITHDRAW ACTION */
module.exports.rejectWithdrawButtonAction = function(req, res, userObj, userData, defaultUsr, itemOnUI){
    userItem.findOneAndUpdate(
        {item : itemOnUI}, // find a document with that filter
        {status : 'Available', swapItem : '', swapItemRating: '', swapperRating : ''},
        {upsert: false, new: true, runValidators: true}, // options
        function (err, doc) {  // callback
            if (err) {
                throw err;
            } else {
                //render or give some message
                //console.log(doc);
                return res.redirect(url.format({
                    pathname:"mySwaps",
                    query: {
                        "statusUpdate":"Rejected/Withdrawn Successfully! Status changed to 'Available'."
                    }
                }));
            }
        });
};

/* MY GAMES PAGE - DELETE ACTION */
module.exports.deleteButtonAction = function(req, res, userObj, userData, defaultUsr){

    userItem.findOneAndRemove(
        {item : req.query.itemName},
        function (err, doc) {
            if (err) {
                throw err;
            } else {
                console.log(doc);
                //render back to updated items page after deletion: set action back to empty so that it does not come back to delete action
                req.query.action = "";
                return userDB.getItemsForMyGames(req, res, userObj, userData, defaultUsr);

            }
        }
    );
};

/* MY GAMES PAGE LOAD AND ACTION */
module.exports.getItemsForMyGames = function(req, res, userObj, defaultUsr, userData){

    if(req.query.action == "delete") {
        return userDB.deleteButtonAction(req, res, userObj, defaultUsr, userData);
    }

    //load page myGames normally : fetch user items of logged in user -- on load
    if (userObj === undefined) {
        return userDB.myItemsLoadDefault(req, res, userObj, defaultUsr, userData);
    } else {
        return userDB.myItemsLoad(req, res, userObj, defaultUsr, userData);
    }
};

/* MY GAMES PAGE LOAD - Default User */
module.exports.myItemsLoadDefault = function(req, res, userObj, defaultUsr, userData){

    //call default items if no user is logged in
    userItem.find({userId: 0}, function (err, itemLst) {
        if (err) throw err;

        if (itemLst) {
            res.render('myItems',  {myItemsList : itemLst, userData : userData, sessionData : userObj, defaultUsr : defaultUsr});
        } else {
            res.render('myItems',  {myItemsList : undefined, userData : userData, sessionData : userObj, defaultUsr : defaultUsr});
            console.log("Error");
        }
    });
};

/* MY GAMES PAGE LOAD - signedIn User */
module.exports.myItemsLoad = function(req, res, userObj, defaultUsr, userData){
    //call mySwaps items for logged in user
    userItem.find({userId: userObj.userId}, function (err, itemLst) {
        if (err) throw err;

        if (itemLst) {
            //call items and render page
            res.render('myItems',  {myItemsList : itemLst, userData : userData, sessionData : userObj, defaultUsr : defaultUsr});
        } else {
            //if no user in db of that user id then call default items
            return myItemsLoadDefault(req, res, userObj, defaultUsr, userData);
        }
    });
};

/* INDIVIDUAL ITEM PAGE LOAD AND UPDATE(CLicked from MyGames Page) ACTION*/
module.exports.getItem = function(req, res, userObj, defaultUsr, userData){

    if(req.query.action === 'update'){

        if(req.query.itemStatus === 'Available' || req.query.itemStatus === 'Swapped'){
            //redirect to individual item page
            req.query.action = '';
            return itemDB.loadItemPage(req, res, userObj, defaultUsr, userData);

        } else {
            var itemName = req.query.itemName;
            //if Pending then redirect to My Swaps page with that particular item only
            userItem.find({item : itemName}, function (err, userItems) {
                if (err) throw err;

                if (userItems) {

                    res.render('mySwaps', {
                        userData: userData,
                        sessionData: userObj,
                        myUserItemList: userItems,
                        defaultUsr: defaultUsr,
                        updateStat : ''
                    });
                } else {
                    console.log("Error");
                }
            });
        }
    } else {
        return itemDB.loadItemPage(req, res, userObj, defaultUsr, userData);
    }
};


module.exports.getDataSwaps = function(req, res, itemById, userData, userObj, defaultUsr){

    if(userObj === undefined) {
        userItem.find({status: 'Available', userId: 0}, function (err, userItems) {
            if (err) throw err;

            if (userItems) {

                res.render('swaps', {
                    data: itemById,
                    userData: userData,
                    sessionData: userObj,
                    defaultUsr: defaultUsr,
                    availableItem: userItems
                });
            } else {
                res.render('swaps', {
                    data: itemById,
                    userData: userData,
                    sessionData: userObj,
                    defaultUsr: defaultUsr,
                    availableItem: undefined
                });
            }
        });
    } else {
        userItem.find({status: 'Available', userId: userObj.userId}, function (err, userItems) {
            if (err) throw err;

            if (userItems) {

                    res.render('swaps', {
                    data: itemById,
                    userData: userData,
                    sessionData: userObj,
                    defaultUsr: defaultUsr,
                    availableItem: userItems
                });
            } else {
                res.render('swaps', {
                    data: itemById,
                    userData: userData,
                    sessionData: userObj,
                    defaultUsr: defaultUsr,
                    availableItem: undefined
                });
            }
        });
    }
};

// UserDB - Refactor the function “UserDB” to get users from the database:
// addUser(firstName, lastName, email, address1, address2, city, state, zipcode, String country - adds a user with the provided values as the user attributes.
// Note: That the userId is not provided as this should be auto incremented to ensure each user ID is unique.
// addUser (User user) - this method adds a user with the attribute values from the provided User object
// getAllUsers() - this method returns a collection/list of all the users in the User table
// getUser(userID) - this method returns a User object for the provided user ID

module.exports.getAllUsers = function(){
    user.find({}, function (err, allUsers) {
        if (err) throw err;

        if (allUsers) {
            console.log(allUsers);
        } else{
            console.log("Error: " + err);
        }
    });
};

module.exports.getUser = function(userId){
    user.find({userId : userId}, function (err, usr) {
        if (err) throw err;

        if (usr) {
            console.log(usr);
        } else{
            console.log("Error: " + err);
        }
    });
};