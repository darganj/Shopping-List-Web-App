// JavaScript source code

var express = require('express');
var router = express.Router();


function getItems(res, userID, connection, context, complete) {

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



router.get('/', function (req, res, next) {
    var context = {};
    var connection = req.app.get('connection');
    var listName = 'Guacamole'; //Hard coded for testing
    // var listName = req.body; //Required arguments (listName to display list)
    var sql = "SELECT List_of_Items.itemID, List_of_Items.quantity, Items.itemName FROM Lists LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID LEFT JOIN Items ON List_of_Items.itemID = Items.itemID WHERE Lists.nameList = 'Guacamole'";

    connection.query(sql, listName, function (err, results, fields) {
        if (err) {
            console.log(err);
            next(err);
            return;
        };
        context = results;
        console.log(context);
        res.render('shoppinglist', { context: context });
    });




});



module.exports = router;