var path = require('path');
var item = require(path.join(__dirname + '/../models/item.js'));
var userDB = require(path.join(__dirname + '/../models/userDB.js'));
var itemDB = require(path.join(__dirname + '/../models/itemDB.js'));
var userItem = require(path.join(__dirname + '/../models/userItem.js'));

module.exports.fetchCategoriesAndItems = function(req, res, userObj, defaultUsr, userData) {

    var catalogCategory = req.query.catalogCategory;

    item.find({}, function(err, allItemsList) {
        if (err) throw err;
        if (allItemsList) {

            var categoryList = [];
            var catItems = new Map(); //put items in map according to categories

            for(let i = 0; i < allItemsList.length; i++){
                if(!categoryList.includes(allItemsList[i].catalogCategory)) { //add category only if its not already present in the array
                    categoryList.push(allItemsList[i].catalogCategory);
                }
            }

            for (let i = 0; i < allItemsList.length; i++) {
                let cat = allItemsList[i].catalogCategory;
                //add item to list if the category is already in map else add new cat and assign the item to new cat
                if(catItems.hasOwnProperty(cat)){
                    catItems[cat].push(allItemsList[i]);
                } else {
                    var arr = [];
                    arr.push(allItemsList[i]);
                    catItems[cat] = arr;
                }
            }

            if(categoryList.includes(catalogCategory)){
                //category specific items
                let catSpecificItems = { [catalogCategory] : catItems[catalogCategory]};
                res.render('categories', {catItems: catSpecificItems, userData : userData, sessionData : userObj, defaultUsr : defaultUsr});

            } else if(userObj != undefined && defaultUsr === "not default"){
                //code for user specific items -- check if user is signed in or not... if not --> display all items
                return userDB.getUserItems(req, res, userObj, userData, defaultUsr, catItems);

            } else {
                //else { if user is not signed in then display all the category items }
                res.render('categories', {catItems : catItems, userData : userData, sessionData : userObj, defaultUsr : defaultUsr});
            }
        } else {
            console.log("Error in fetching data from database: No data found");
        }
    });
};

module.exports.fetchItemsSwapsPage = function(req, res, userObj, defaultUsr, userData){

    var itemId =  req.query.itemCode;
    item.find({}, function(err, allItemsList) {
        if (err) throw err;
        if (allItemsList) {
            let catItems = new Map(); //put items in map according to categories

            for (let i = 0; i < allItemsList.length; i++) {
                let cat = allItemsList[i].catalogCategory;

                //add item to list if the category is already in map else add new cat and assign the item to new cat
                if (catItems.hasOwnProperty(cat)) {
                    catItems[cat].push(allItemsList[i]);
                } else {
                    var arr = [];
                    arr.push(allItemsList[i]);
                    catItems[cat] = arr;
                }
            }

            let itemCodeList = [];
            for(let category in catItems) {
                for (let i = 0; i < catItems[category].length; i++) {
                    itemCodeList.push(catItems[category][i].itemCode);
                }
            }

            //Validate itemId is valid
            if(itemCodeList.includes(itemId)){
                item.findOne({itemCode: itemId}, function(err, itemById) {
                    if (err) throw err;
                    if (itemById) {

                        return userDB.getDataSwaps(req, res, itemById, userData, userObj, defaultUsr);

                    } else {
                        console.log("Error in fetching data from database: No data found for given itemCode");
                    }
                });
            }  else {
                res.render('categories', {catItems : catItems, userData : userData, sessionData : userObj, defaultUsr : defaultUsr});
            }
        } else {
            console.log("Error in fetching data from database: No data found");
        }
    });

};

module.exports.mySwapsFunction = function(req, res, userObj, defaultUsr, userData) {

    var updateStat = req.query.statusUpdate;
    var swapStatus = req.query.swapStatus;
    var buttonClicked = req.query.click;

    //console.log(updateStat);

    if(swapStatus != undefined && buttonClicked != undefined){
        console.log("Hey! Clicked accept/reject/withdraw");
        var itemOnUI = req.query.item;

        if(buttonClicked === "accept"){
            return userDB.acceptButtonAction(req, res, userObj, userData, defaultUsr, itemOnUI);
        } else {
            //reject/withdraw click action
            return userDB.rejectWithdrawButtonAction(req, res, userObj, userData, defaultUsr, itemOnUI);
        }
    }

    //fetch user items of logged in user -- on load
    if (userObj === undefined) {
        return userDB.getDefUserItemsMySwapsPg(req, res, userObj, userData, defaultUsr);
    } else {
        return userDB.getUserItemsMySwapsPg(req, res, userObj, userData, defaultUsr, updateStat);
    }
};

module.exports.loadItemPage = function(req, res, userObj, defaultUsr, userData){
    var itemId =  req.query.itemCode;
    var itemName = req.query.itemName;

    if(itemId != undefined) {
        item.findOne({itemCode: itemId}, function (err, item) {
            if (err) throw err;
            if (item) {

                //TODO: RECHECK - START
                userItem.findOne({item: item.itemName},function(err, result){
                    if(err) throw err;
                    if (result) {
                        res.render('item', {data: item, userData: userData, sessionData: userObj, defaultUsr: defaultUsr, status: result.status});
                    }else{
                        res.render('item', {data: item, userData: userData, sessionData: userObj, defaultUsr: defaultUsr, status: undefined});
                    }
                });
                //TODO: RECHECK - END
                //res.render('item', {data: item, userData: userData, sessionData: userObj, defaultUsr: defaultUsr});
            } else {
                console.log("Error");
                //render to categories page if item not found in DB
                return itemDB.fetchCategoriesAndItems(req, res, userObj, defaultUsr, userData);
            }
        });
    } else {
        item.findOne({itemName: itemName}, function (err, item) {
            if (err) throw err;
            if (item) {
                //TODO: RECHECK - START
                userItem.findOne({item: item.itemName},function(err, result){
                    if(err) throw err;
                    if (result) {
                        res.render('item', {data: item, userData: userData, sessionData: userObj, defaultUsr: defaultUsr, status: result.status});
                    }else{
                        res.render('item', {data: item, userData: userData, sessionData: userObj, defaultUsr: defaultUsr, status: undefined});
                    }
                });
                //TODO: RECHECK - START
                //res.render('item', {data: item, userData: userData, sessionData: userObj, defaultUsr: defaultUsr, status: undefined});
            } else {
                console.log("Error");
            }
        });
    }
};

module.exports.confirmSwapMethod = function(req, res, userObj, defaultUsr, userData) {
    if(userObj != undefined) {
        console.log(req.body.myData);
        var uItm = new userItem({
            item: req.body.myData,
            rating: '',
            status: 'Pending',
            swapItem: req.body.radioItem,
            swapItemRating: '',
            swapperRating: '',
            category: '',
            userId: userObj.userId
        });

        uItm.save(function (err) {
            if (!err) {
                console.log("Saved");
                //redirect to mySwaps page
                userItem.find({userId: userObj.userId}, function (err, userItems) {
                    if (err) throw err;

                    if (userItems) {

                        res.render('mySwaps', {userData : userData, sessionData : userObj, myUserItemList : userItems, defaultUsr : defaultUsr, updateStat : ''});
                    } else {
                        console.log("Error in saving details");
                    }
                });

            } else {
                console.log("Error in inserting data");
            }
        });
    } else {
        console.log("User must login before confirming");
    }
};

module.exports.feedBackMethod = function(req, res, userObj, defaultUsr, userData) {

    //display only item for which feedback button was clicked
    //if Pending then redirect to My Swaps page with that particular item only
    userItem.find({item : req.query.itemName}, function (err, userItems) {
        if (err) throw err;

        if (userItems) {

            res.render('feedBack', {
                userData: userData,
                sessionData: userObj,
                defaultUsr: defaultUsr,
                userItems: userItems,
                usr: ''
            });
        } else {
            console.log("Error");
        }
    });

    //Display only swapped items
    // if(userObj != undefined) {
    //     userItem.find({status: 'Swapped', userId: userObj.userId}, function (err, userItems) {
    //         if (err) throw err;
    //         if (userItems) {
    //             console.log(userItems);
    //             res.render('feedBack', {
    //                 userData: userData,
    //                 sessionData: userObj,
    //                 defaultUsr: defaultUsr,
    //                 userItems: userItems,
    //                 usr: ''
    //             });
    //
    //         } else {
    //
    //             res.render('feedBack', {
    //                 userData: userData,
    //                 sessionData: userObj,
    //                 defaultUsr: defaultUsr,
    //                 userItems: undefined,
    //                 usr: ''
    //             });
    //         }
    //     });
    // } else {
    //     res.render('feedBack', {userData: userData, sessionData: userObj, defaultUsr: defaultUsr, userItems: undefined, usr: ''});
    // }
};

module.exports.feedBackPost = function(req, res, userObj, defaultUsr, userData) {

    userItem.find({item: req.body.item}, function (err, userItems) {
        if (err) throw err;
        if (userItems) {
            if(req.body.itemRatingError != undefined || req.body.swapItemRatingError != undefined || req.body.swapperRatingError != undefined) {

                //if errors present render with errors
                res.render('feedBack', {
                    userData: userData,
                    sessionData: userObj,
                    defaultUsr: defaultUsr,
                    userItems: userItems,
                    usr: req.body
                });
            } else {

                //if no validation errors then update and render
                userItem.findOneAndUpdate(
                    {item : req.body.item},
                    {$set:{rating: req.body.itemRating, swapItemRating: req.body.swapItemRating, swapperRating: req.body.swapperRating}},// find a document with that filter
                    {upsert: false, new: true, runValidators: true}, // options
                    function (err, doc) {  // callback
                        if (err) {
                            throw err;
                        } else {
                            res.render('feedBack', {
                                userData: userData,
                                sessionData: userObj,
                                defaultUsr: defaultUsr,
                                userItems: userItems,
                                usr: 'Feedback Sent!'
                            });
                        }
                    });
            }
        } else {

            if(req.body.itemRatingError != undefined || req.body.swapItemRatingError != undefined || req.body.swapperRatingError != undefined) {
                res.render('feedBack', {
                    userData: userData,
                    sessionData: userObj,
                    defaultUsr: defaultUsr,
                    userItems: undefined,
                    usr: req.body
                });
            } else  {
                res.render('feedBack', {
                    userData: userData,
                    sessionData: userObj,
                    defaultUsr: defaultUsr,
                    userItems: undefined,
                    usr: ''
                });
            }
        }
    });
};
// ItemDB - Refactor function “ItemDB” to get items from the database:
// addItem(itemCode, itemName, categoryCode, catalogCategory, description, imageUrl) - creates an item with the provided values and calls addItem(Item item)
// addItem(Item item) - method adds an item with the attribute values from the provided Item object to the database
// getAllItems() - this method returns an array of Item objects of all the items in the items table from the database
// getItem(itemCode) - this method returns an Item object for the provided item code

module.exports.addItem = function(itemCode, itemName, catalogCategory, description, rating, imageUrl){
    var itm = new item(itemCode, itemName, catalogCategory, description, rating, imageUrl);

    itm.save(function (err) {
        if(!err){
            //render to any page after successful save
        } else {
            //handle validations if any
        }
    });
};

module.exports.getAllItems = function(){
    item.find({}, function (err, allItems) {
        if (err) throw err;

        if (allItems) {
            console.log(allItems);
        } else{
            console.log("Error: " + err);
        }
    });
};

module.exports.getItem = function(itemCode){

    item.find({itemCode : itemCode}, function (err, itemData) {
        if (err) throw err;

        if (itemData) {
            console.log(itemData);
        } else{
            console.log("Error: " + err);
        }
    });
};