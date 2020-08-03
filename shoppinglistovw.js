// JavaScript source code

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var router = express.Router();




/*getShopping Lists
    * This function returns the shopping lists in JSON form in the context variable
Input Params: - res containing server response to call
                - userID - userID of user to retrieve shopping lists
                - connection - existing mySQL connection to database
                - context - to be populated with shopping list info
                - complete - callback function
Returns: context is filled with all info on user Shopping Lists*/
function getShoppingLists(res, userID, connection, context, complete) {

    var query = 'SELECT * FROM Users LEFT JOIN Lists ON Lists.userID = Users.userID WHERE Users.userID = ?';

    connection.query(query, userID, function (err, results, fields) {
        if (err) {
            console.log("error");
            next(err);
            return;
        }
        
        context.userlists = results;
             complete();
    });


}



/*Router Function for Shopping List Overview
    * This route will display the shopping list overview for a provided user. The GET Method must contain
    * the user ID in the URL*/
router.get('/', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    var context = {};
    var callbackCount = 0;
    var userID = req.query.userID;
    console.log('userID is');
    console.log(userID);
    if (userID) {
        var connection = req.app.get('connection');

        getShoppingLists(res, userID, connection, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                console.log(context.userlists);
                res.render('shoppinglistovw', { context: context.userlists });
            }
        }
    } else {
        console.log("No user ID provided");
        res.render('shoppinglistovw'); //if no userID is provided render basic view.
    }



});




/*This ROUTE Currently doesn't work, connection is broken, commenting out*/


/*Router Function for Adding a new empty Shopping List to a Users Shopping Lists
 * Input params - req, required data in req:
 * userID: ID of User 
 * nameList - name of the list
 * Optional data in req
 * Date - Date of new Database, if left empty will use current date*/

/*

router.post('/', function (req, res, next) {


    var connection = req.app.get('connection');
    var { date, userID, nameList } = req.body; // required front-end args: userID (user's ID), nameList (name for new empty list)

    if (date == "") { // if date not provided by user, enter current date into database
        var current_date = new Date();
        var formatted_date = JSON.stringify(current_date).slice(1, 11);
        date = formatted_date;
    };

    //Assert userID, nameList input

    if (userID = "") {
        console.log("Error no userID provided");
        //TODO: Send notification to user of error
        return;
    }
    if (nameList = "") {
        console.log("Error, no nameList provdied");
        //TODO: Send notification to user of error
        return;
    }
    console.log("POST: Server received" + date + ", " + nameList + ", " + userID);
    // add new list for user
    connection.query('INSERT INTO Lists (userID, listCreated, nameList) VALUES (?, ?, ?)', [userID, date, nameList], function (err, result) {

        if (err) {
            //TODO: Send notification to user of error
            next(err);
            return;
        };
    });

    // fetch & render all lists for user including newly added list
    var context = {};
    var callbackCount = 0;
    getShoppingLists(res, userID, connection, context, complete);

    function complete() {
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('shoppinglistovw', { context: context.userlists });
        }
    }

    
});


*/


/*Router Function for Deleting an existing Shopping List from a Users Shopping Lists
 * Input params - req, required data in req:
 * userID - User ID, needed to render users shopping lists
 * listID - ID of shopping list to be deleted*/
router.delete('/', function (req, res, next) {


    console.log('using the js route');
    console.log('');

    var connection = req.app.get('connection');
    var { listID, userID } = req.body;
    console.log(listID);
    console.log("delete shopping list route");

    //TODO - Assure List Requested to be deleted exists

    connection.query("DELETE FROM Lists WHERE listID=?", [req.body.listID], function (err, result) {
        if (err) {
            next(err);
            return;
        }
    });
    // fetch & render all remaining lists for user after deletion
    var context = {};
    var callbackCount = 0;
    getShoppingLists(res, userID, connection, context, complete);

    function complete() {
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('shoppinglistovw', { context: context.userlists });
        }
    }
});


/*Router Function for Updating an Existing Shopping List Name and/or Date for a User.
 * Uses PUT method.
 * Input params - req, required data in req body:
 * listID - ID of Shopping list to be updated
 * name - name of Shopping List, edit if it will be updated
 * date - date of Shopping list, edit if it will be updated
 * userID - user ID, needed to render users lists*/
router.put('/', function (req, res, next) {

    var connection = req.app.get('connection');
    var { name, date, listID, userID } = req.body;

    connection.query("UPDATE Lists SET nameList=?, listCreated=? WHERE listID=? ", [name, date, listID], function (err, result) {
        if (err) {
            next(err);
            return;
        }
    });

    // fetch & render all remaining lists for user after deletion
    var context = {};
    var callbackCount = 0;
    getShoppingLists(res, userID, connection, context, complete);

    function complete() {
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('shoppinglistovw', { context: context.userlists });
        }
    }
});








module.exports = router;
