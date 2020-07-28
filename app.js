var express = require('express');
var mysql = require('mysql');
var argon2 = require('argon2');
var crypto = require('crypto'); //built into Node.js, but must require it
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

if(process.env.JAWSDB_URL){
    var connection = mysql.createConnection(process.env.JAWSDB_URL);
}else{
  var connection = mysql.createConnection({
    host            : 'localhost',
    user            : 'flj1jzapfhtiwjjo',
    password        : 'ztb0cti8o5648gsw',
    database        : 'zv3sbfb4eij4y18x'
  });


}
var options = {
	// Host name for database connection:
	host: 'localhost',
	// Port number for database connection:
	port: 3306,
	// Database user:
	user: 'flj1jzapfhtiwjjo',
	// Password for the above database user:
	password: 'ztb0cti8o5648gsw',
	// Database name:
	database: 'zv3sbfb4eij4y18x',
	// Whether or not to automatically check for and clear expired sessions:
	clearExpired: true,
	// How frequently expired sessions will be cleared; milliseconds:
	checkExpirationInterval: 900000,
	// The maximum age of a valid session; milliseconds:
	expiration: 86400000,
	// Whether or not to create the sessions database table, if one does not already exist:
	createDatabaseTable: true,
	// Number of connections when creating a connection pool:
	connectionLimit: 1,
	// Whether or not to end the database connection when the store is closed.
	// The default value of this option depends on whether or not a connection was passed to the constructor.
	// If a connection object is passed to the constructor, the default value for this option is false.
	endConnectionOnClose: true
};

var sessionStore = new MySQLStore(options, connection);

var app = express();
// immediately create header security options
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
app.use(helmet({
  hsts: false
}))

var expireDate = new Date();
expireDate.setDate(expireDate.getDate() + 1);

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretword",
  resave: true,
  saveUninitialized: true
  // ,
  // store: sessionStore, 
}));

//TO-DO:  change saveUninitialized to false

// set handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// app.disable('x-powered-by');  // replaced by helmet
app.set('port', process.env.PORT || 5001);



// set using info
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// make url encoded info in query string usable
var queryParams = function(req, res, next) {
  res.parts = req.query;
  next();
};
app.use(queryParams);

async function validatePassword(password, hash) {
  try {

    const correctPassword = await argon2.verify(hash, password);
    console.log(correctPassword);
    return correctPassword;
  } catch (err) {
    console.log("error in hashing2");
  }
}

async function genPassword(password) {
  const salt = crypto.randomBytes(32);
  console.log(
    `${salt.length} bytes of random data: ${salt.toString('hex')}`);
  
  try {
    const hash = await argon2.hash(password, salt);
    console.log(hash);
    return {
      salt: salt,
      hash: hash
    };
  } catch (err) {
    console.log("error in hashing3");
  }
}
console.log(genPassword("bob"));
console.log(validPassword("bob", "$argon2i$v=19$m=4096,t=3,p=1$TdSx6GD+drh0HiqwZc5JPQ$SrwzrA3g6rSJWdl8kYD3+CjsoIEgrZ2R1UYolE22JQ0"));
passport.use('local-login', new LocalStrategy(
  async function(username, password, done) {
      connection.query("SELECT * from Users where userName=?", 
      [username],
      function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        console.log(rows);
      })
          // .then((user) => {
          //     if (!user) { return done(null, false) }
              
        const isValid = validatePassword(password, user.hash, user.salt);
              
          //     if (isValid) {
          //         return done(null, user);
          //     } else {
          //         return done(null, false);
          //     }
          // })
          // .catch((err) => {   
          //     done(err);
          // });


          // function getTable(res,next){
          //   var context = {};
          //   mysql.pool.query("SELECT * FROM workouts", function(err, rows, fields){
          //     if(err){
          //       next(err);
          //       return;
          //     }
          //     res.json({rows:rows});
          //   })
          // }



}));

passport.use('local-register', new LocalStrategy(
  async function(username, password, done) {
    let user = connection.query("SELECT * from Users where userName=?", [username]);
    if (user == null){
      return done(null, false);
    }
    let saltHash = genPassword(password);
    connection.query("INSERT INTO Users (`username`, `saltHash`) VALUES (?, ?, ?)", [username, saltHash],)
          // .then((user) => {
          //     if (!user) { return done(null, false) }
              
          //     const isValid = genPassword(password, user.hash, user.salt);
              
          //     if (isValid) {
          //         return done(null, user);
          //     } else {
          //         return done(null, false);
          //     }
          // })
          // .catch((err) => {   
          //     done(err);
          // });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
  connection.query("SELECT * from users where id=?", [id], function (err, user) {
      if (err) { return cb(err); }
      cb(null, rows[0]);
  });
});
app.use(passport.initialize());
app.use(passport.session());


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var fakeData = 
            {"name":"bob", 
             "username":"bob@gmail.com",
             "salt":"e0d2fddd8185e1e585f3c3de74a340abfd4f81c90636ac62bcd63059ce2a38eb",
             "hash":"$argon2i$v=19$m=4096,t=3,p=1$qnSNsiZ+NGFZ1m3xdr9Tew$2BV7U4v1BYnTWdyc2CyZBQTV2JH1gLIBov8wXYWUXwM",
             "isAdmin":"false",
             "lists":
              [
                {"nameList":"April", 
                "listItems":
                    {"item1":"apple",
                    "item2":"pear",
                    "item3":"peach"
                    }
                },
                {"nameList":"May", 
                "listItems":
                    {"item1":"beetle",
                    "item2":"ant",
                    "item3":"ladybug"
                    }
                },
                {"nameList":"June", 
                "listItems":
                    {"item1":"meat",
                    "item2":"meatier",
                    "item3":"meatiest"
                    }
                }
              ]
                
            };


app.get('/', function(req,res,next){
    res.render('home');

});

app.get('/about',function(req,res,next){
  res.render('about');
});

app.get('/login',function(req,res,next){
  res.render('login');
});

// app.post('/login',passport.authenticate('local', { failureRedirect: '/login' }), function(req,res,next){
//   const salt = fakeData.salt;
//   const storedHash = fakeData.hash;

//   try {

//     const correctPassword = await argon2.verify(fakeData.hash, req.body.password);
//     console.log(correctPassword);
//   } catch (err) {
//     console.log("error in hashing");
//   }

//   res.redirect('shoppinglist');
// });

// app.post('/login', passport.authenticate('local-register',{failureRedirect: '/'}), function(req,res,next){

//   res.redirect('shoppinglist');
// });

app.post('/login', function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;

  console.log("request info");
  console.log(req.body.username);
  console.log(req.body.password);
  var sql = "SELECT * FROM Users WHERE userName = ? AND password = ?";

  if (username && password){

    connection.query(sql, [username, password], function (err, results, fields) {
      if (err) {
          console.log(err);
          next(err);
          return;
      }else{
          context = results;
          console.log(context);

          req.session.loggedin = true;
          req.session.username = username;
          res.redirect('shoppinglist');
      }
      
      // res.render('shoppinglist', { context: context });
  });

  }

  
});

app.get('/register',function(req,res,next){
  res.render('register');
});


app.post('/register',async function(req,res,next){
  //create salt for new user
  const salt = crypto.randomBytes(32);
  console.log(
  `${salt.length} bytes of random data: ${salt.toString('hex')}`);

  let username = req.body.username;
  
  try {
    const hash = await argon2.hash(req.body.password, salt);
    console.log(hash);
  } catch (err) {
    console.log("error in hashing");
  }

  res.redirect('shoppinglist');
});

// app.post('/register',passport.authenticate('local-register',{failureRedirect: '/'}), function(req,res,next){
//   res.redirect('shoppinglist');
// });


app.get('/userlanding', function (req, res, next) {

    res.render('user_landing');

});


app.get('/shoppinglist', function (req, res, next) {

    var context = {};
    //Using user id = 1 for testing, TODO: Change to req.body and ensure 
    var userID = 1;
    var sql = 'SELECT * FROM Users LEFT JOIN Lists ON Lists.userID = Users.userID WHERE Users.userID = ?';

    connection.query(sql,userID, function (err, results, fields) {
        if (err) {
            console.log("error");
            next(err);
            return;
        }
        context = results;
        console.log(context);
         res.render('shoppinglistovw', { context: context });
        
    });
});



app.get('/chooselist', function (req, res, next) {
    var context = {};
    var listName = 'Guacamole'; //Hard coded for testing
   // var listName = req.body; //Required arguments (listName to display list)
    var sql = "SELECT List_of_Items.itemID, List_of_Items.quantity, Items.itemName FROM Lists LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID LEFT JOIN Items ON List_of_Items.itemID = Items.itemID WHERE Lists.nameList = 'Guacamole'";

    connection.query( sql, listName, function (err, results, fields) {
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




app.get('/delete', function (req, res) {


    res.render('deletelist');
});


  // route for adding an empty shopping list for a user (can add more features to this route later)
app.post('/shoppingList',function(req,res,next){

  var {date, userID, nameList} = req.body; // required front-end args: userID (user's ID), nameList (name for new empty list)
  if (date == "") { // if date not provided by user, enter current date into database
    var current_date = new Date();
    var formatted_date = JSON.stringify(current_date).slice(1,11);
    date = formatted_date;
  };
  // add new list for user
  connection.query('INSERT INTO Lists (`userID`, `listCreated`, `nameList`) VALUES (?, ?, ?)', [userID, date, nameList], function(err, result){

    if(err){
      next(err);
      return;
    };
  });

  // fetch & render all lists for user including newly added list
  var context = {};
  var sql = 'SELECT * FROM Users LEFT JOIN Lists ON Lists.userID = Users.userID WHERE Users.userID = ?';
  connection.query(sql,userID, function (err, results, fields) {
        if (err) {
            console.log("error");
            next(err);
            return;
        }
        context.context = results;
        //console.log(context);
           //TODO RENDER ACTUAL DATA
        res.render('shoppinglistovw', context);
  });



});

// route to delete shopping list based on listID, userID in req.body
app.delete('/shoppingList',function(req,res,next){
    // delete list with listID provided in req.body
    var listID = req.body.listID;
    console.log(listID);
    console.log("delete shopping list route");
    connection.query("DELETE FROM Lists WHERE listID=?", [req.body.listID], function(err, result) {
        if(err){
            next(err);
            return;
        }
    });
    // fetch & render all remaining lists for user after deletion
    var context = {};
    var sql = 'SELECT * FROM Users LEFT JOIN Lists ON Lists.userID = Users.userID WHERE Users.userID = ?';
    connection.query(sql,req.body.userID, function (err, results, fields) {
        if (err) {
            console.log("error");
            next(err);
            return;
        }
        context.context = results;
        //console.log(context);
           //TODO RENDER ACTUAL DATA
        res.render('shoppinglistovw', context);
    });
});


// route to update an existing shopping list's name and/or date for a user
app.put('/shoppingList',function(req,res,next){
  var context = {};
  var {name, date, listID, userID} = req.body;

  connection.query("UPDATE Lists SET nameList=?, listCreated=? WHERE listID=? ", [name, date, listID], function(err, result){
    if(err){
      next(err);
      return;
    }
  });

  // fetch & render all remaining lists for user after deletion
    var context = {};
    var sql = 'SELECT * FROM Users LEFT JOIN Lists ON Lists.userID = Users.userID WHERE Users.userID = ?';
    connection.query(sql,req.body.userID, function (err, results, fields) {
        if (err) {
            console.log("error");
            next(err);
            return;
        }
        context.context = results;
        //console.log(context);
           //TODO RENDER ACTUAL DATA
        res.render('shoppinglistovw', context);
    });
});



// route to update the item in the list
/*app.get('/edit-list',function(req,res,next){
  var context = {};

  // sql placeholder variable
  var getShoppingList = "SELECT Users.userName, Lists.nameList, List_of_Items.quantity, Items.itemName " +
  "FROM Users " +
    "LEFT JOIN Lists ON Lists.userID = Users.userID " +
    "LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID " +
    "LEFT JOIN Items ON List_of_Items.itemID = Items.itemID " +
  "WHERE Users.userID=? AND Lists.listID=?;";

  // execute the sql to render and display the shopping list
  connection.query(getShoppingList, function(err, result){
    if (err){
      console.log(1);
      next(err);
      return;
    }
    context.list = result;
    res.render('edit-list');
  });
});
*/

app.get('/edit-list', function (req, res, next) {

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
    if(err) {
      console.log(err);
      next(err);
      return;
    };
    var context = results;
    console.log(context);
    res.render('edit-list',{
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
    if(err) {
      console.log(err);
      next(err);
      return;
    };
    var context = results;
    console.log(context);
    res.render('edit-list',{
      context: context
      });

    });
  }

  else {
  var context = {};
  var sql = "SELECT List_of_Items.itemID, List_of_Items.quantity, Items.itemName FROM Lists LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID LEFT JOIN Items ON List_of_Items.itemID";
  connection.query(sql, function (err, results) {
    if(err) {
      console.log(err);
      next(err);
      return;
    };
    context = results;
    console.log(context);
    res.render('edit-list',{
      context: context
      });;
    });
    };
});

// route for adding a new item to a shopping list
app.post('/edit-list',function(req,res,next){

        var {listID, itemID, quantity} = req.body;
        connection.query('INSERT INTO List_of_Items (`listID`, `itemID`, `quantity`) VALUES (?, ?, ?)', [listID, itemID, quantity], function(err, result){
            if(err){
                next(err);
                return;
            };
        });
        console.log(req.body);
        res.render('edit-list');
});


app.delete('/edit-list',function(req,res,next){
  res.render('edit-list');
});

// route for 1) marking an item, 2) unmarking an item, ...(other additional features)
app.put('/edit-list',function(req,res,next){

    // 1) marking an item
    if (req.body.markItem) { // include "markItem" value in submit element to indicate option 1
        var {listID, itemID, quantity} = req.body; // required front-end args: listID, itemID, quantity
        connection.query('UPDATE List_of_Items SET markStatus=? WHERE listID=? AND itemID= ?', [1, listID, itemID], function(err, result){
            if(err){
                next(err);
                return;
            };
        });
        res.render('edit-list');
    }

    // 2) unmarking an item
    else if (req.body.unmarkItem) { // include "unmarkItem" value in submit element to indicate option 2
        var {listID, itemID, quantity} = req.body; // required front-end args: listID, itemID, quantity
        connection.query('UPDATE List_of_Items SET markStatus=? WHERE listID=? AND itemID= ?', [0, listID, itemID], function(err, result){
            if(err){
                next(err);
                return;
            };
        });
        res.render('edit-list');
    };

});

app.get('/defaultlist',function(req,res,next){
  var context = {};

  // sql placeholder variable
  var getDefaultItemsList = "SELECT * FROM Items LEFT JOIN Nutritions ON Items.nutritionID = Nutritions.nutritionID";

  // execute the sql to render and display the shopping list
  connection.query(getDefaultItemsList, function(err, result){
    if (err){
      next(err);
      return;
    }
    var defaultItemsList = JSON.stringify(result);
    //context.defaultItemsList = defaultItemsList;
    context.defaultItemsList = result;
    //console.log(context);
    res.render('defaultlist', context);
  });
});

app.get('/admin-portal',function(req,res,next){
  res.render('admin-portal');
});

// 404 error route
app.use(function(req,res){
  res.status(404);
  res.render('404');
});
  
// 500 server error route
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});
  
// listen command
app.listen(app.get('port'), function(){
  console.log('Express started on http://' + process.env.HOSTNAME + ':' + app.get('port') + '; press Ctrl-C to terminate.');
});
