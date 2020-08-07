// JavaScript source code
//

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var express_enforces_ssl = require('express-enforces-ssl');
var ensureLoggedIn = require('connect-ensure-login');
var router = express.Router();


function getItems(res, listName, connection, context, complete) {

    var query = 'SELECT List_of_Items.listOfItems, Lists.listID, Lists.nameList, List_of_Items.itemID, List_of_Items.quantity, List_of_Items.markStatus, Items.itemName FROM Lists LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID LEFT JOIN Items ON List_of_Items.itemID = Items.itemID WHERE Lists.nameList = ?';
    connection.query(query, listName, function (err, results, fields) {
        if (err) {
            console.log("error");
            next(err);
            return;
        }
        context.listitems = results;
        console.log(context);
        complete();
    });


}



router.get('/', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    var context = {};
    var connection = req.app.get('connection');
    var listName = req.query.nameList
    var callbackCount = 0;
    

    getItems(res, listName, connection, context, complete);
    function complete() {
        console.log('made it to callback');
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('shoppinglist', { context: context.listitems });
        }
    }
    

});

router.post('/', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {
    res.locals.login = req.isAuthenticated();

    // marking an item
    if (req.body.Unchecked) { // include "markItem" value in submit element to indicate option 1
        console.log("check item reached");
        var {listID, listOfItems} = req.body; // required front-end args: listID, itemID, quantity
        connection.query('UPDATE List_of_Items SET markStatus=1 WHERE listID=? AND listOfItems=?', [listID, listOfItems], function (err, result) {
            if (err) {
                next(err);
                return;
            };
        });

        // fetch & re-render updated list of items
        var context = {};
        var connection = req.app.get('connection');
        var listName = req.query.nameList
        var callbackCount = 0;


        getItems(res, listName, connection, context, complete);
        function complete() {
            console.log('made it to callback');
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('shoppinglist', { context: context.listitems });
            }
        }
    }

    // unmarking an item
    else if (req.body.Checked) {
        console.log("uncheck item reached");
        var { listID, listOfItems } = req.body; // required front-end args: listID, itemID, quantity
        connection.query('UPDATE List_of_Items SET markStatus=0 WHERE listID=? AND listOfItems=?', [listID, listOfItems], function (err, result) {
            if (err) {
                next(err);
                return;
            };
        });

        // fetch & re-render updated list of items
        var context = {};
        var connection = req.app.get('connection');
        var listName = req.query.nameList
        var callbackCount = 0;


        getItems(res, listName, connection, context, complete);
        function complete() {
            console.log('made it to callback');
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('shoppinglist', { context: context.listitems });
            }
        }

    }

    else {

        var { listID, itemID, quantity } = req.body;
        connection.query('INSERT INTO List_of_Items (`listID`, `itemID`, `quantity`, `markStatus`) VALUES (?, ?, ?, 0)', [listID, itemID, quantity], function (err, result) {
            if (err) {
                next(err);
                return;
            };
        });

        console.log(req.body);

        //Render the shopping list view with correct items

        var context = {};
        var connection = req.app.get('connection');
        var listName = req.query.nameList
        var callbackCount = 0;


        getItems(res, listName, connection, context, complete);
        function complete() {
            console.log('made it to callback');
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('shoppinglist', { context: context.listitems });
            }
        }

    };

});





module.exports = router;
