// JavaScript source code

var express = require('express');
var myConnection = require('./dbcon.js');
var connection = myConnection.connection;
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var express_enforces_ssl = require('express-enforces-ssl');
var ensureLoggedIn = require('connect-ensure-login');
var router = express.Router();



/*function transform (arr) {
    var result = [], temp = [];
    console.log("starting transform function");
    arr.forEach(function(elem, i) {
        if (i > 0 && i % 3 === 0) {
            result.push(temp);
            temp = [];
        }
        temp.push(elem);
    });
    console.log("finished forEa Loop");
    if (temp.length > 0) {
        result.push(temp);
    }
    return result;
}
//data = transform(context.userlists);
*/

/*getUserAData Function
 * This function returns data for a specified userName
 * Input Params: - connection - existing mySQL connection to database
 *               - userName - userName
 * Returns:      - datablock of user data*/
function getUserData(connection, context, userID, complete) {

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



/*getShopping Lists
    * This function returns the shopping lists in JSON form in the context variable
Input Params: - res containing server response to call
                - userID - userID of user to retrieve shopping lists
                - connection - existing mySQL connection to database
                - context - to be populated with shopping list info
                - complete - callback function
Returns: context is filled with all info on user Shopping Lists*/
function getShoppingLists(res, userID, connection, context, complete) {

    var query = 'SELECT listID, nameList, listCreated FROM Users LEFT JOIN Lists ON Lists.userID = Users.userID WHERE Users.userID=?';

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

/*getSpecificShoppingList
    * This function returns a shopping list row based on a listID
Input Params: -  res containing server response to call
                - listID - listID of shoppingList
                - connection - existing mySQL connection to database
                - context - to be populated with shopping list info
                - complete - callback function
Returns: context is filled with all info on user Shopping Lists*/
function getShoppingListByID(res, listID, connection, context, complete) {


    //var query = 'SELECT listID, userID, date(listCreated), nameList FROM Lists WHERE Lists.listID = ?';

  var query = 'SELECT listID, nameList, listCreated FROM Lists WHERE Lists.listID=?';


    connection.query(query, listID, function (err, results, fields) {
        if (err) {
            console.log("error");
            next(err);
            return;
        }
        context.userlists = results;
        complete();
    });


}


/* Function that takes in an array (lists) and creates a grid for the lists, 3 lists per row
To Do: Get lists into array to pass through transform function

function transform (arr) {
    var result = [], temp = [];
    console.log("starting transform function");
    arr.forEach(function(elem, i) {
        if (i > 0 && i % 3 === 0) {
            result.push(temp);
            temp = [];

/*deleteListByID
 * This function deletes a shopping list based on a listID
 * Input Params -
 *              - listID - list to be deleted
 *              - connection - existing DB connection
 * Returns      - none
 */
function deleteListByID(listID, connection) {

    var deleteQuery = "DELETE FROM Lists WHERE listID=?";

    connection.query(deleteQuery, listID, function (err, result) {
        if (err) {
            console.log("Error Deleting List ID:" + listID);
            next(err);
            return;

        }
        console.log("Deleted List ID:" + listID);
    });

}

/*updateListByID
 * This function updates a shopping list based on a listID
 * Input Params -
 *              - listID - list to be deleted
 *              - connection - existing DB connection
 *              - newName - new name for the list
 *              - newDate - new date for the list
 * Returns      - none
 */
function updateListByID(listID, connection, newName, newDate) {

    var updateQuery = "UPDATE Lists SET nameList =?, listCreated =? WHERE listID =?";


    connection.query(updateQuery, [newName, newDate, listID], function (err, result) {
        if (err) {
            console.log("Error Updating List ID:" + listID);
            next(err);
            return;
        }
        console.log("Updated List ID:" + listID);
    });
}

/*createNewList
 * This function adds a new list into the database
 * Input Params -
 *              - userID - user Owner of the DB
 *              - connection - existing DB connection
 *              - name - name of the database
 *              - date - date for the database
 * Returns      - none
 */
function createNewList(userID, connection, name, date) {


    var insertQuery = 'INSERT INTO Lists (userID, listCreated, nameList) VALUES (?, ?, ?)';

    connection.query(insertQuery, [userID, date, name], function (err, result) {

        if (err) {
            console.log("Error creating New List for User ID:" + userID);
            next(err);
            return;
        };

        console.log("New List " + name + " created for User ID:" + userID);
    });

}


/*Router Function for Deleting an existing Shopping List from a Users Shopping Lists
 * Input params - req, required data in req:
 * userID - User ID, needed to render users shopping lists
 * listID - ID of shopping list to be deleted*/
router.post('/delete', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;


    var listID = req.body.listID;
    var userID = res.locals.user.userID; // Pulled from session data

    /*Ensure the list is owned by  the user*/
    var context = {};


    if (listID) { //Verify that a listID was input in the Form
        

        getShoppingListByID(res, listID, connection, context, complete); //Function grabs a specified shopping list
        function complete() {

            if (context.userlists[0]) {  // Check if a value was returned from SELECT query

                var foundUserID = context.userlists[0].userID; // Compare the userID owner found and session userID
                                       
                if (userID == foundUserID) { 

                    //Delete list, cascades and will delete list references in list_of_items table


                    deleteListByID(listID, connection);

                        

                } else {
                       
                    console.log("user doesn't own list");

                }



            } else {
                    
                console.log('shopping list id not found');

            }

        }
    } else {
        console.log("No listID provided");

    }


    res.redirect('/shoppinglistovw'); //Reroute user back to shopping list ovw



    
});


/*Router Function for Updating an Existing Shopping List Name and/or Date for a User.
 * Uses PUT method.
 * Input params - req, required data in req body:
 * listID - ID of Shopping list to be updated
 * name - name of Shopping List, edit if it will be updated
 * date - date of Shopping list, edit if it will be updated
 * userID - user ID, needed to render users lists*/
router.post('/update', function (req, res, next) {

    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;


    var listID = req.body.listID;
    var newListName = req.body.nameList;
    var newListDate = req.body.date;
    var userID = res.locals.user.userID; // Pulled from session data

       

    /*Ensure the list is owned by  the user*/
    var context = {};

    if (listID) { //Verify that a listID was input in the Form


        getShoppingListByID(res, listID, connection, context, complete); //Function grabs a specified shopping list
        function complete() {



            if (context.userlists[0]) {  // Check if a value was returned from SELECT query

                var foundUserID = context.userlists[0].userID; // Compare the userID owner found and session userID

                if (userID == foundUserID) {

                    //If data not input, do not change
                    if (!newListName) { newListName = context.userlists[0].nameList };
                    if (!newListDate) { newListDate = context.userlists[0].listCreated };


                    updateListByID(listID, connection, newListName, newListDate);

                } else {
                    console.log("user doesn't own list");
                }

            } else {

                console.log('shopping list id not found');
            }

        }
    } else {
        console.log("No listID provided");
    }

    res.redirect('/shoppinglistovw'); //Reroute user back to shopping list ovw

});




/*Router Function for Adding a new empty Shopping List to a Users Shopping Lists
 * Input params - req, required data in req:
 * userID: ID of User 
 * nameList - name of the list
 * Optional data in req
 * Date - Date of new Database, if left empty will use current date*/

router.post('/', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;


    var nameList = req.body.nameList; // Required ARgument
    var userID = res.locals.user.userID; // Pulled from session data
    var date = req.body.date; // Not required


    if (date == "") { // if date not provided by user, enter current date into database
        var current_date = new Date();
        var formatted_date = JSON.stringify(current_date).slice(1, 11);
        date = formatted_date;
    };

    //Assert userID, nameList input

    if (userID == "") {
        console.log("Error no userID provided");
        //TODO: Send notification to user of error
        return;
    }
    if (nameList == "") {
        console.log("Error, no nameList provdied");
        //TODO: Send notification to user of error
        return;
    }


    createNewList(userID, connection, nameList, date);
    
    res.redirect('/shoppinglistovw'); //Route back to users shopping lists


});

/*Router Function for Shopping List Overview
    * This route will display the shopping list overview for a provided user. The GET Method must contain
    * the user ID in the URL*/
router.get('/', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {

    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;

    var context = {};
    var callbackCount = 0;
    var userID = res.locals.user.userID; // Pulled from session data


    if (userID) {


        getShoppingLists(res, userID, connection, context, complete);
        getUserData(connection, context, userID, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                console.log(context);
                console.log(context.userData);
                res.render('shoppinglistovw', context);
            }
        }
    } else {
        console.log("No user ID provided");
        res.render('shoppinglistovw'); //if no userID is provided render basic view.
    }



});





module.exports = router;
