// JavaScript source code

var express = require('express');
var router = express.Router();


function getItems(res, listName, connection, context, complete) {

    var query = 'SELECT List_of_Items.itemID, List_of_Items.quantity, Items.itemName FROM Lists LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID LEFT JOIN Items ON List_of_Items.itemID = Items.itemID WHERE Lists.nameList = ?';

    connection.query(query, listName, function (err, results, fields) {
        if (err) {
            console.log("error");
            next(err);
            return;
        }
        context.listitems = results;
        complete();
    });


}



router.get('/', function (req, res, next) {
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



module.exports = router;