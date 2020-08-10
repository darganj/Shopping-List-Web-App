// JavaScript source code
//

var express = require('express');
var myConnection = require('./dbcon.js');
var connection = myConnection.connection;
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var express_enforces_ssl = require('express-enforces-ssl');
var ensureLoggedIn = require('connect-ensure-login');
const { route } = require('./shoppinglistovw.js');
var router = express.Router();



/*getUserAData Function
 * This function returns data for a specified userID
 * Input Params: - connection - existing mySQL connection to database
 *               - userID - userName
 * Returns:      - datablock of user data*/
function getUserData(connection, context, userID, complete, next) {

    var query = "SELECT * FROM Users Where userID = ?";

    connection.query(query, userID, function (err, results, fields) {
        if (err) {
            console.log("error");
            next(err);
            return;
        }
        context.userdata = results[0];
        complete();
    });
}

/*getShoppingListData Function
 * This function returns shopping list data for a specified shopping list
 * Input Params - connection - existing mySql connection to database
 *              - listID - ID of list to return
 *              - context - data is filled in here
 *               - complete - callback function
 * Returns      - block of list data in context.listdata*/
function getShoppingListData(connection, listID, context, complete, next) {

    var query = "SELECT * FROM Lists Where listID = ?";
    connection.query(query, listID, function (err, results, fields) {
        if (err) {
            console.log("query error");
            next(err);
            return;
        }
        context.listdata = results; //removed [0] from results[0]
        complete();
    });

}


function getItems(res, listID, connection, context, complete, next) {

    var query = 'SELECT List_of_Items.listOfItems, Lists.listID, Lists.nameList, List_of_Items.itemID, List_of_Items.quantity, List_of_Items.markStatus, List_of_Items.itemNote, Items.itemName FROM Lists LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID LEFT JOIN Items ON List_of_Items.itemID = Items.itemID WHERE Lists.listID = ?';
    connection.query(query, listID, function (err, results, fields) {
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
    res.locals.user = req.user;

    var context = {};

    var userID = res.locals.user.userID; // Pulled from session data
    var listID = req.query.listID

    var callbackCount = 0;
    

    getItems(res, listID, connection, context, complete, next);
    getUserData(connection, context, userID, complete, next);
    getShoppingListData(connection, listID, context, complete, next);
    function complete() {
        
        callbackCount++;
        if (callbackCount >= 3) {
            res.render('shoppinglist', context);
        }
    }
    

});

/* Add Item to list via Add Item Modal*/

router.post('/save', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;

    var itemID = req.body.itemID;
    var categoryID = req.body.categoryID;
    var itemName = req.body.itemName; 
    var listID = req.body.listID;
    var quantity = req.body.quantity;
    var markStatus = req.body.markStatus;
    var itemNote = req.body.itemNote;

    connection.query('INSERT INTO Items (`itemID`, `categoryID`, `itemName`) VALUES (?, 1, ?)', [itemID, categoryID, itemName], function (err, result) {
        if (err) {
            console.log("error");
            next(err);
            return;
        };
    });
    connection.query('INSERT INTO List_of_Items (`listID`, `itemID`, `quantity`, `markStatus`, `itemNote`) VALUES (?, ?, ?, 0, ?', [listID, itemID, quantity, markStatus, itemNote], function (err, result) {
        if (err) {
            console.log("error");
            next(err);
            return;
        };
    });

    res.redirect('shoppinglist');
        
});

/* Delete Item from list */

router.post('/delete', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;

    var itemID = req.body.itemID;
    var userID = res.locals.user.userID;

    var context = {};
    var callbackCount = 0;

    if (itemID) {
        getItems(res, listID, connection, context, complete, next);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                if (context.userlists[0]) {
                    var foundUserID = context.userlists[0].userID;

                    if (userID == foundUserID) {

                        connection.query("DELETE FROM Items WHERE itemID=?", [req.body.itemID], function (err, result) {
                            if (err) {
                                next(err);
                                return;
                            }
                        });
                    }
                    else {
                        console.log("user does not have item");
                    }
                }
                else {
                    console.log("item ID not found.");
                }
            }
        }
    }
    else {
        console.log("No itemID provided.");
    }
    res.redirect('/shoppinglist');
});

/*Edit/Update Item in List */

router.post('/update', function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;

    var itemID = req.body.itemID;
    var newItemQuantity = req.body.quantity;
    var newItemNote = req.body.itemNote;
    var userID = res.locals.user.userID;

    var context = {};
    var callbackCount = 0;
    if (itemID {
        getItems(res, listID, connection, context, complete, next);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                if (context.userlists[0]) {
                    var foundUserID = context.userlists[0].userID;

                    if (userID == foundUserID) {

                        if (!newItemQuantity) { newItemQuantity = context.userlists[0].quantity };
                        if (!newItemNote) { newItemNote = context.userlists[0].itemNote };

                        connection.query("UPDATE List_of_Items SET quantity=?, itemNote=? WHERE itemID=?", [newItemQuantity, newItemNote, itemID], function (err, result) {
                            if (err) {
                                next(err);
                                return;
                            }
                        });
                    }
                    else {
                        console.log("user does not have item");
                    }
                }
                else {
                    console.log("item ID not found.");
                }
            }
        }
    }
    else {
        console.log("No itemID provided.");
    }
    res.redirect('/shoppinglist');
});




module.exports = router;
