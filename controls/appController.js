var express = require('express');
var path = require('path');
var itemDB = require(path.join(__dirname + '/../models/itemDB.js'));
var userDB = require(path.join(__dirname + '/../models/userDB.js'));
var mongoose = require(path.join(__dirname + '/../controls/mongoose.js'));
var user = require(path.join(__dirname + '/../models/user.js'));
var item = require(path.join(__dirname + '/../models/item.js'));
const { check, validationResult} = require('express-validator/check');
var sanitizer = require('sanitize')();


//to handle post requests
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended : false});

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/../views'));
app.use('/resources', express.static(path.join(__dirname + '/../resources')));

//Require controller modules.
var profileController = require(path.join(__dirname + '/ProfileController'));
app.use(profileController);

var userObj;
var defaultUsr;

/* INDEX PAGE */
app.get('/', function(req, res){
    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, '/');
    } else {
        return userDB.getUserData(req, res, userObj, '/');
    }
});

/* INDEX PAGE */
app.get('/index', function(req, res){
    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'index');
    } else {
        return userDB.getUserData(req, res, userObj, 'index');
    }
});

/* CATEGORIES PAGE */
app.get('/categories', function(req, res){

    userObj = req.session.theUser;
    defaultUsr = req.session.defaultUser;

    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'categories');
    } else {
        return userDB.getUserData(req, res, userObj, 'categories');
    }
});

/* CONTACT PAGE */
app.get('/contact', function(req, res){
    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'contact');
    } else {
        return userDB.getUserData(req, res, userObj, 'contact');
    }
});

/* SWAPS PAGE */
app.get('/swaps', function(req, res){

    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'swaps');
    } else {
        return userDB.getUserData(req, res, userObj, 'swaps');
    }

});

/* MYSWAPS PAGE */
app.get('/mySwaps', function(req, res) {

    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'mySwaps');
    } else {
        return userDB.getUserData(req, res, userObj, 'mySwaps');
    }
});

/* SIGN IN PAGE */
app.get('/signIn', function(req, res) {
    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'signIn');
    } else {
        return userDB.getUserData(req, res, userObj, 'signIn');
    }
});

/* ABOUT PAGE */
app.get('/about', function(req, res){
    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'about');
    } else {
        return userDB.getUserData(req, res, userObj, 'about');
    }
});

/* SIGN OUT PAGE */
app.get('/signOut', function(req, res){

    //destroy the session
    req.session.destroy();
    return itemDB.fetchCategoriesAndItems(req, res, undefined, 'default', undefined);
});

/* REGISTER PAGE */
app.get('/register', function(req, res){
    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'register');
    } else {
        return userDB.getUserData(req, res, userObj, 'register');
    }
});

/* POST: REGISTER PAGE */
//userDB -------- method addUser
app.post('/register', urlEncodedParser,  [
    check('password').isLength({ min: 5 }).withMessage('Password length must be minimum 5'),
    check('emailAddress').isEmail().normalizeEmail().withMessage('Invalid Email-ID'),
    check('firstName').trim().escape().matches(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/, "i").withMessage('First Name cannot contain special characters.'),
    check('lastName').trim().escape().matches(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/, "i").withMessage('Last Name cannot contain special characters.')
], function(req, res){

    var usr = new user({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        emailAddress : req.body.emailAddress,
        password : req.body.password,
        address1Field : req.body.address1Field,
        address2Field : req.body.address2Field,
        city :  req.body.city,
        state :  req.body.state,
        postCode :  req.body.postCode,
        country :  req.body.country
    });

    var errors = validationResult(req);
    if (!errors.isEmpty()) {

        console.log(errors.array());

        for(var e = 0; e < errors.array().length; e++) {
            if(errors.array()[e].param == 'password'){
                req.body['passwordError'] = errors.array()[e].msg;
            }
            if(errors.array()[e].param == 'firstName'){
                req.body['firstNameError'] = errors.array()[e].msg;
            }
            if(errors.array()[e].param == 'lastName'){
                req.body['lastNameError'] = errors.array()[e].msg;
            }
            if(errors.array()[e].param == 'emailAddress'){
                req.body['emailError'] = errors.array()[e].msg;
            }
        }

        res.render("register", {
            viewTitle: "Register User",
            usr: req.body,
            userData: undefined,
            sessionData: undefined,
            defaultUsr: 'default'
        });

    } else {
        usr.save(function (err) {
            if (!err) {
                res.render('signIn', {
                    userData: undefined,
                    sessionData: undefined,
                    defaultUsr: 'default',
                    usr: 'User registered successfully. Please sign In.'
                });
            } else {

                if (err.name == 'ValidationError') {

                    handleValidationError(err, req.body);

                    //console.log(req.body);

                    res.render("register", {
                        viewTitle: "Register User",
                        usr: req.body,
                        userData: undefined,
                        sessionData: undefined,
                        defaultUsr: 'default'
                    });
                }
                else {
                    console.log('Error during record insertion : ' + err);
                }
            }
        });
    }
});


function handleValidationError(err, body) {

    for (field in err.errors) {
        switch (err.errors[field].path) {

            case 'firstName':
                body['firstNameError'] = err.errors[field].message;
                break;
            case 'emailAddress':
                body['emailError'] = err.errors[field].message;
                break;
            case 'lastName':
                body['lastNameError'] = err.errors[field].message;
                break;
            case 'password':
                body['passwordError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

/* ADD NEW ITEM PAGE */
app.get('/addNewItem', function(req, res){
    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'addNewItem');
    } else {
        return userDB.getUserData(req, res, userObj, 'addNewItem');
    }
});

/* POST: ADD NEW ITEM PAGE */
app.post('/addNewItem', urlEncodedParser, [
    check('itemCode').trim().escape().matches(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/, "i").withMessage('Item Code cannot contain special characters.'),
    check('itemName').trim().escape().matches(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/, "i").withMessage('Item Name cannot contain special characters.')], function(req, res){
    console.log(req.body);
    var itm = new item({
        itemCode : req.body.itemCode,
        itemName : req.body.itemName,
        catalogCategory : req.body.catalogCategory,
        description : req.body.description,
        rating : req.body.rating,
        imageUrl : req.body.imageUrl
    });

    var errors = validationResult(req);
    if (!errors.isEmpty()) {

        console.log(errors.array());

        for(var e = 0; e < errors.array().length; e++) {
            if(errors.array()[e].param == 'itemCode'){
                req.body['itemCodeError'] = errors.array()[e].msg;
            }

            if(errors.array()[e].param == 'itemName'){
                req.body['itemNameError'] = errors.array()[e].msg;
            }
        }

        res.render("addNewItem", {
            viewTitle: "Add New Item",
            usr: req.body,
            userData: undefined,
            sessionData: undefined,
            defaultUsr: 'default'
        });

    } else {

        itm.save(function (err) {
            if (!err) {
                res.render('addNewItem', {
                    userData: undefined,
                    sessionData: undefined,
                    defaultUsr: 'default',
                    usr: 'Item added successfully.'
                });
            } else {
                if (err.name == 'ValidationError') {

                    handleValidationErrorNewItem(err, req.body);

                    res.render("addNewItem", {
                        viewTitle: "Add New Item",
                        usr: req.body,
                        userData: undefined,
                        sessionData: undefined,
                        defaultUsr: 'default'
                    });
                }
                else {
                    console.log('Error during record insertion : ' + err);
                }
            }
        });
    }
});


function handleValidationErrorNewItem(err, body) {

    for (field in err.errors) {
        switch (err.errors[field].path) {

            case 'itemCode':
                body['itemCodeError'] = err.errors[field].message;
                break;
            case 'itemName':
                body['itemNameError'] = err.errors[field].message;
                break;
            case 'catalogCategory':
                body['catalogCategoryError'] = err.errors[field].message;
                break;

            default:
                break;
        }
    }
}

app.post('/confirmSwap', urlEncodedParser, function(req, res){
    //console.log("Confirm Swap Clicked");
    userObj = req.session.theUser;
    if(userObj != undefined) {
        return userDB.getUserData(req, res, userObj, 'confirmSwap');
    } else {
        return userDB.getDefaultUser(req, res, userObj, 'confirmSwap');
    }
});

/* FEEDBACK PAGE */
app.get('/feedBack', function(req, res){
    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'feedback');
    } else {
        return userDB.getUserData(req, res, userObj, 'feedback');
    }
});

app.post('/feedBack', urlEncodedParser, [
    check('itemRating').trim().isNumeric().withMessage('Please enter numeric value.'),
    check('swapItemRating').trim().isNumeric().withMessage('Please enter numeric value.'),
    check('swapperRating').trim().isNumeric().withMessage('Please enter numeric value.'),
    check('itemRating').trim().isLength({min: 1}).withMessage('Please enter item rating.'),
    check('swapItemRating').trim().isLength({min: 1}).withMessage('Please enter swap item rating.'),
    check('swapperRating').trim().isLength({min: 1}).withMessage('Please enter swapper rating.'),
    check('itemRating').trim().isInt({ gt: 0, lt: 6 }).withMessage('Please enter value between 1 to 5'),
    check('swapItemRating').trim().isInt({ gt: 0, lt: 6 }).withMessage('Please enter value between 1 to 5'),
    check('swapperRating').trim().isInt({ gt: 0, lt: 6 }).withMessage('Please enter value between 1 to 5')], function(req, res){

    userObj = req.session.theUser;
    var errors = validationResult(req);
    if (!errors.isEmpty()) {

        console.log(errors.array());

        for(var e = 0; e < errors.array().length; e++) {
            if(errors.array()[e].param == 'itemRating'){
                req.body['itemRatingError'] = errors.array()[e].msg;
            }

            if(errors.array()[e].param == 'swapItemRating'){
                req.body['swapItemRatingError'] = errors.array()[e].msg;
            }

            if(errors.array()[e].param == 'swapperRating'){
                req.body['swapperRatingError'] = errors.array()[e].msg;
            }
        }

        if(userObj != undefined) {
            return userDB.getUserData(req, res, userObj, 'feedbackPost');
        } else {
            return userDB.getDefaultUser(req, res, userObj, 'feedbackPost');
        }
    } else {
        if(userObj != undefined) {
            return userDB.getUserData(req, res, userObj, 'feedbackPost');
        } else {
            return userDB.getDefaultUser(req, res, userObj, 'feedbackPost');
        }
    }

    if(userObj != undefined) {
        return userDB.getUserData(req, res, userObj, 'feedbackPost');
    } else {
        return userDB.getDefaultUser(req, res, userObj, 'feedbackPost');
    }
});

app.get('/downloadUserManual', function(req, res){
    var file = __dirname + '/../resources/User_Manual_Swapzy.docx';
    res.download(file); // Set disposition and send it.
});

/* ERROR PAGE */
app.get('*', function(req, res){
    res.send('404 URL not found!! Please provide proper URL.');
});

app.listen(8080, function() {
    console.log("Listening on port 8080")
});