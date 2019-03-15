var express = require('express');
var app = module.exports = express();
var path = require('path');
var userDB = require(path.join(__dirname + '/../models/userDB.js'));
var user = require(path.join(__dirname + '/../models/user.js'));
const { check, validationResult} = require('express-validator/check');
var sanitizer = require('sanitize')();

var session = require('express-session');

//to handle post requests
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended : false});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/../views'));
app.use('/resources', express.static(path.join(__dirname + '/../resources')));
app.use(session({secret: "Secret!"}));

var userObj;
var defaultUsr;

/* MYITEMS PAGE */
app.get('/myItems', function(req, res){

    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'myItems');
    } else {
        return userDB.getUserData(req, res, userObj, 'myItems');
    }
});

/* ITEM PAGE */
app.get('/item', function(req, res) {

    userObj = req.session.theUser;
    if (userObj === undefined) {
        return userDB.getDefaultUser(req, res, userObj, 'item');
    } else {
        return userDB.getUserData(req, res, userObj, 'item');
    }
});

/* POST REQUEST FOR SIGN IN PAGE */
app.post('/signIn', urlEncodedParser,  [
    check('userId').trim().isLength({ min: 1 }).withMessage('Please enter User ID'),
    check('userId').trim().isNumeric().withMessage('Incorrect User ID format, Please enter numeric value.'),
    check('password').trim().isLength({ min: 1 }).withMessage('Please enter Password')
], function(req, res){
    var theUser;
    var defaultUser;

    req.session.theUser = req.body;
    var userDetails;
    var errors = validationResult(req);
    if (!errors.isEmpty()) {

        console.log(errors.array());

        for (var e = 0; e < errors.array().length; e++) {
            if (errors.array()[e].param == 'password') {
                req.body['passwordError'] = errors.array()[e].msg;
            }

            if (errors.array()[e].param == 'userId') {
                req.body['userIdError'] = errors.array()[e].msg;
            }

            return res.render('signIn', {
                userData: 'Invalid or No User/password provided',
                sessionData: req.session.theUser, defaultUsr: "not default", usr: req.body
            });
        }
    } else {
        user.findOne({
            userId: req.session.theUser.userId,
            password: req.session.theUser.password
        }, function (err, userDet) {
            if (err) throw err;
            if (userDet) {
                userDetails = userDet;

                req.session.defaultUser = "not default";
                defaultUsr = req.session.defaultUser;
                res.render('signIn', {
                    userData: userDetails.firstName,
                    sessionData: req.session.theUser, defaultUsr: defaultUsr, usr: ''
                });

            } else {
                res.render('signIn', {
                    userData: 'Invalid or No User/password provided',
                    sessionData: req.session.theUser, defaultUsr: "not default", usr: ''
                });
                //console.log("Error");
            }
        });
    }
});