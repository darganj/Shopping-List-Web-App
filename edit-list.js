// JavaScript source code



var express = require('express');
var router = express.Router();



router.get('/', function (req, res, next) {

    var connection = req.app.get('connection');

    if (req.query.ascending) { // if sort by category in ascending order (test userID=3,listID=3)
        var sql = "SELECT Users.userName, Categories.categoryName, Lists.nameList, List_of_Items.quantity, Items.itemName" +
            " FROM Users" +
            " LEFT JOIN Lists ON Lists.userID = Users.userID" +
            " LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID" +
            " LEFT JOIN Items ON List_of_Items.itemID = Items.itemID" +
            " LEFT JOIN Categories ON Items.itemID = Categories.categoryID" +
            " WHERE Users.userID=3 AND Lists.listID=3" +
            " ORDER BY Categories.categoryName ASC";
        connection.query(sql, function (err, results) {
            if (err) {
                console.log(err);
                next(err);
                return;
            };
            var context = results;
            console.log(context);
            res.render('edit-list', {
                context: context
            });

        });
    }

    else if (req.query.descending) { // if sort by category in descending order (test userID=3,listID=3)
        var sql = "SELECT Users.userName, Categories.categoryName, Lists.nameList, List_of_Items.quantity, Items.itemName" +
            " FROM Users" +
            " LEFT JOIN Lists ON Lists.userID = Users.userID" +
            " LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID" +
            " LEFT JOIN Items ON List_of_Items.itemID = Items.itemID" +
            " LEFT JOIN Categories ON Items.itemID = Categories.categoryID" +
            " WHERE Users.userID=3 AND Lists.listID=3" +
            " ORDER BY Categories.categoryName DESC";
        connection.query(sql, function (err, results) {
            if (err) {
                console.log(err);
                next(err);
                return;
            };
            var context = results;
            console.log(context);
            res.render('edit-list', {
                context: context
            });

        });
    }

    else {
        var context = {};
        var sql = "SELECT List_of_Items.itemID, List_of_Items.quantity, Items.itemName FROM Lists LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID LEFT JOIN Items ON List_of_Items.itemID";
        connection.query(sql, function (err, results) {
            if (err) {
                console.log(err);
                next(err);
                return;
            };
            context = results;
            console.log(context);
            res.render('edit-list', {
                context: context
            });;
        });
    };
});



// route for adding a new item to a shopping list
router.post('/', function (req, res, next) {


    var connection = req.app.get('connection');

    var { listID, itemID, quantity } = req.body;
    connection.query('INSERT INTO List_of_Items (`listID`, `itemID`, `quantity`) VALUES (?, ?, ?)', [listID, itemID, quantity], function (err, result) {
        if (err) {
            next(err);
            return;
        };
    });
    console.log(req.body);
    res.render('edit-list');
});



// route for 1) marking an item, 2) unmarking an item, ...(other additional features)
router.put('/', function (req, res, next) {

    var connection = req.app.get('connection');

    // 1) marking an item
    if (req.body.markItem) { // include "markItem" value in submit element to indicate option 1
        var { listID, itemID, quantity } = req.body; // required front-end args: listID, itemID, quantity
        connection.query('UPDATE List_of_Items SET markStatus=? WHERE listID=? AND itemID= ?', [1, listID, itemID], function (err, result) {
            if (err) {
                next(err);
                return;
            };
        });
        res.render('edit-list');
    }

    // 2) unmarking an item
    else if (req.body.unmarkItem) { // include "unmarkItem" value in submit element to indicate option 2
        var { listID, itemID, quantity } = req.body; // required front-end args: listID, itemID, quantity
        connection.query('UPDATE List_of_Items SET markStatus=? WHERE listID=? AND itemID= ?', [0, listID, itemID], function (err, result) {
            if (err) {
                next(err);
                return;
            };
        });
        res.render('edit-list');
    };

});

router.delete ('/', function (req, res, next) {
    res.render('edit-list');
});





module.exports = router;

