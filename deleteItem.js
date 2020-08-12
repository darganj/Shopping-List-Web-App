var express = require('express');
var myConnection = require('./dbcon.js');
var connection = myConnection.connection;
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var express_enforces_ssl = require('express-enforces-ssl');
var ensureLoggedIn = require('connect-ensure-login');
// const { route } = require('./shoppinglist.js');
var router = express.Router();

router.post('/deleteItem', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    context.userID = res.locals.user.userID;
    context.userName = res.locals.user.userName;
    var context = {};
    var itemID = req.body.itemID;
    
    // FIND THE CARD
    connection.query("SELECT itemID FROM Items WHERE itemID=?", [req.body.itemID], function(err, result){
        if(err){
            next(err);
            console.log("ERROR: SELECT QUERY TO DELETE");
            return;
        }
        console.log("SELECT QUERY SUCCESSFUL");
    
        // DELETE
        
        connection.query("DELETE FROM List_of_Items WHERE List_of_Items.itemID=?", [context.itemID], function(err, result){
            if(err){
                next(err);
                console.log("ERROR: DELETE QUERY TO DELETE");
                return;
            }
            console.log("DELETE QUERY SUCCESSFUL");
            res.render('/deleteItem_confirmed');
            });
        });
});
