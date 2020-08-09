var express = require('express');
var mysql = require('mysql');
var argon2 = require('argon2');
var crypto = require('crypto'); //built into Node.js, but must require it
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var express_enforces_ssl = require('express-enforces-ssl');
var ensureLoggedIn = require('connect-ensure-login');

var app = express();
// immediately create header security options
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));

// force all connections to ssl
app.enable('trust proxy');
app.use(express_enforces_ssl());

if(process.env.JAWSDB_URL){
    var connection = mysql.createConnection(process.env.JAWSDB_URL);
}else{
  console.log("Error: You need to configure your local database parameters");
  // var connection = mysql.createConnection({
  //   host            : 'mwgmw3rs78pvwk4e.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  //   user            : 'oumwqrox1u690kyf',
  //   password        : 'dp0jxu78jfqeqry1',
  //   database        : 'rtfqihn2cy96dcmm'
  // });
}
// var options = {
// 	// Host name for database connection:
// 	host: 'localhost',
// 	// Port number for database connection:
// 	port: 3306,
// 	// Database user:
// 	user: 'flj1jzapfhtiwjjo',
// 	// Password for the above database user:
// 	password: 'ztb0cti8o5648gsw',
// 	// Database name:
// 	database: 'zv3sbfb4eij4y18x',
// 	// Whether or not to automatically check for and clear expired sessions:
// 	clearExpired: true,
// 	// How frequently expired sessions will be cleared; milliseconds:
// 	checkExpirationInterval: 900000,
// 	// The maximum age of a valid session; milliseconds:
// 	expiration: 86400000,
// 	// Whether or not to create the sessions database table, if one does not already exist:
// 	createDatabaseTable: true,
// 	// Number of connections when creating a connection pool:
// 	connectionLimit: 1,
// 	// Whether or not to end the database connection when the store is closed.
// 	// The default value of this option depends on whether or not a connection was passed to the constructor.
// 	// If a connection object is passed to the constructor, the default value for this option is false.
// 	endConnectionOnClose: true
// };

// var sessionStore = new MySQLStore(connection);

var sessionStore = new MySQLStore({
  checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
  expiration: 86400000,// The maximum age of a valid session; milliseconds.
  createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
  schema: {
      tableName: 'sessions',
      columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
      }
  }
}, connection);

var expireDate = new Date();
expireDate.setDate(expireDate.getDate() + 1);

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretword",
  resave: true,
  saveUninitialized: true,
  store: sessionStore
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
      console.log('the correct pw is:');
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

// test that generate password and validate password work on app startup
console.log(genPassword("bob"));
console.log(validatePassword("bob", "$argon2i$v=19$m=4096,t=3,p=1$TdSx6GD+drh0HiqwZc5JPQ$SrwzrA3g6rSJWdl8kYD3+CjsoIEgrZ2R1UYolE22JQ0"));

passport.use('local-login', new LocalStrategy(
  async function(username, password, done) {
    console.log("request info");
    console.log("submitted username is")
    console.log(username);
    console.log("submitted password is")
    console.log(password);
    var sql = "SELECT * FROM Users WHERE userName = ?";

    if (username && password){
      connection.query(sql, [username], async function (err, results, fields) {
        if (err) {
            console.log(err);
            return done(null, false);

        }

        // if the user is not in the database, then length of results is zero
        if (results.length == 0){
          return done(null, false);
        }else{
          context = results;
          console.log("I'm the results from use local-login");
          console.log(context);
          console.log("I'm results[0].userID");
          console.log(results[0].userID);
          console.log("I'm results[0].password");
          console.log(results[0].password);

          try {

            var validHashMatch = await argon2.verify(results[0].password, password)
            console.log("validHashMatch");
            console.log(validHashMatch);
            } catch (err) {
                console.log('There was an error in hash match function');
            return done(null, false);
          }

          if ((results[0].userName == username) && (validHashMatch == true)){
            
            return done(null, results[0]);

          }else{

            return done(null, false);
          }
            // req.session.loggedin = true;
            // req.session.username = username;
            // res.redirect('shoppinglist');
        }
        
        // res.render('shoppinglist', { context: context });
    // });
  
      })
    }
  }
))
  
passport.use('is-admin', new LocalStrategy(
  async function(username, done) {
    var sql = "SELECT * FROM Users WHERE userName = ?";

    console.log("made it into is-admin");
    connection.query(sql, [username], async function (err, results, fields) {
      if (err) {
          console.log(err);
          return done(null, false);

      }
      if (results.length == 0){
        console.log("is-admin, something is empty");
        return done(null, false);
      }else{
        context = results;
        console.log("I'm the results from use is-admin");
        console.log(context);
        console.log("I'm results[0]");
        console.log(results[0].isAdmin)
      }
    })

    if (results[0].isAdmin == 1){
            
      return done(null, results[0]);

    }else{

      return done(null, false);
    }

}));

passport.serializeUser(function(user, done) {
  console.log("serializeUser");
  console.log(user);
  console.log(user.userID);
  done(null, user.userID);
});
passport.deserializeUser(function(userID, cb) {
  connection.query("SELECT * from Users where userID=?", [userID], function (err, results, fields) {
      if (err) { return cb(err); }
      cb(null, results[0]);
  });
});
app.use(passport.initialize());
app.use(passport.session());


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//New Functions for each section
app.set('connection', connection);
// app.use('/adminlanding', require('./adminlanding.js')); //Routes to admin landing page
// app.use('/userlanding', require('./userlanding.js')); //Routes to user landing page
app.use('/shoppinglistovw', require('./shoppinglistovw.js')); //Routes to View groups of shopping lists
app.use('/shoppinglist', require('./shoppinglist.js')); //Routes to view an individual shopping list
// app.use('/login', require('./login.js')); //Routes for logging in


app.use('/analytics', require('./analytics.js'));

/* All routes below this line are not used yet, inside the app
app.use('/edit-list', require('./edit-list.js')); //Routes to edit a shopping list

app.use('/register', require('./register.js')); //Routes for registering a new user user
app.use('/testitems', function (req, res, next) {
    res.render('itemcard');
});


*/
app.get('/', function(req,res,next){
  res.locals.login = req.isAuthenticated();
  res.render('home');


});

app.get('/about',function(req,res,next){
  res.locals.login = req.isAuthenticated();
  res.render('about');
});

/*getUserAData Function
 * This function returns data for a specified userName
 * Input Params: - connection - existing mySQL connection to database
 *               - userName - userName
 * Returns:      - datablock of user data*/
function getUserData(connection, context, userName, complete) {

  var query = "SELECT * FROM Users Where UserName = ?";

  connection.query(query, userName, function (err, results, fields) {
      if (err) {
          console.log("error");
          next(err);
          return;
      }
      context.userData = results[0];
      complete();
  });
}


/*Login GET Route
* Renders the Login Page for Users
*/
app.get('/login', function (req, res, next) {
  res.locals.login = req.isAuthenticated();

res.render('login');
});

/*Login POST Route
* used for user logging in. Logs the User in and Sends them to Admin Landing 
* if they are an admin and User Landing if they are a User*/
app.post('/login', passport.authenticate('local-login', {failureRedirect: '/login'}),
  function (req, res, next) {
      res.locals.login = req.isAuthenticated();
      res.locals.user = req.user;
      console.log("res.locals.user");
      console.log(res.locals.user);
      // context = {};
      // var callbackCount = 0;
      // var userName = req.body.username; //Pulls username from req.body, queries database for userID/isAdmin to render correct webpage
      // var connection = req.app.get('connection');
      console.log("res.locals.user.isAdmin");
      console.log(res.locals.user.isAdmin);
      if (res.locals.user.isAdmin==1){
        res.redirect('adminlanding');
      }else{
        res.redirect('userlanding');
      }

      // getUserData(connection, context, userName, complete);
      // function complete() {
      //     callbackCount++;
      //     if (callbackCount >= 1) {
      //         var isAdmin = context.userData.isAdmin;
      //         var id = context.userData.userID;
      //         console.log('loginPOST is it an admin ' + isAdmin);
      //         console.log('loginPOST the userID is ' + id);
      //         console.log('loginPOST context.userData')
      //         console.log(context.userData);

      //         if (isAdmin) {
      //             res.render('adminlanding', { context: context.userData });
      //         }
      //         else {
      //             res.render('userlanding', { context: context.userData });
      //         }

      //     }
      // }
  });

app.get('/register',function(req,res,next){
  res.locals.login = req.isAuthenticated();
  res.render('register');
});


app.post('/register',async function(req,res,next){
  res.locals.login = req.isAuthenticated();

  var username = req.body.username;
  var password = req.body.password;
  var userType = req.body.userType;

  // default is user, not admin
  var isAdmin = 0;
  if (userType == "Admin") {
      isAdmin = 1;
  }

  var sqlOut = "SELECT * FROM Users WHERE userName = ?";
  var sqlIn = "INSERT INTO Users (`username`, `password`,`isAdmin`) VALUES (?, ?, ?)";

  console.log("picking an existing user is bad");
  if (username && password){
    connection.query(sqlOut, [username], async function (err, results, fields) {
      if (err) {
          console.log(err);
          return done(null, false);

      }
      if (results.length != 0){
        // if the query gets a user, we cannot reuse a user name
        console.log("Error:  user already exists");
        res.redirect('register');
        return;
      }

      //create salt for new user
      const salt = crypto.randomBytes(32);
      console.log(
      `${salt.length} bytes of random data: ${salt.toString('hex')}`);

      try {
        const hash = await argon2.hash(req.body.password, salt);
        console.log("the hash generated from the random salt and user password is:");
        console.log(hash);
        
        try{
          connection.query(sqlIn, [username, hash, isAdmin], function (err, results, fields) {
            if (err) {
              console.log(err);
              res.redirect('register');
      
            }else{
                console.log("trying to fix query/promise")

               
                res.redirect(307,'/login'); //redirects to login post

            }
          }
          )

        }catch (err) {
          console.log("error in query");
          res.redirect('register');
        }
        



      } catch (err) {
        console.log("error in hashing");
        res.redirect('register');
      }

      


    })
  }  
  // form submitted without fields filled out correctly
  // console.log("Error:  issue with username/password submitted");
  // res.redirect('register');
  
});

app.get('/adminlanding', ensureLoggedIn.ensureLoggedIn('/login'),
  function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    context = {};
    context.userName = res.locals.user.userName;
    context.userID = res.locals.user.userID;

    if(res.locals.user.isAdmin != 1){
      res.redirect('userlanding');
    }else{
      res.render('adminlanding', { context: context });
    }

    
});

app.get('/userlanding', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.user = req.user;
  context = {};
  res.locals.user.userName = context.userName;
  res.locals.user.userID = context.userID;

  res.render('userlanding', { context: context });

});



app.get('/delete', /*ensureLoggedIn.ensureLoggedIn('/login'),*/ function (req, res) {
    res.locals.login = req.isAuthenticated();

    res.render('deletelist');
});



  // route for adding an empty shopping list for a user (can add more features to this route later)
app.post('/shoppinglistovw', /*ensureLoggedIn.ensureLoggedIn('/login'),*/function(req,res,next){
  res.locals.login = req.isAuthenticated();
    // console.log("testing if it goes to this route");
    // console.log("");

  if (req.body.mergeLists) {
    console.log("reached merge lists");
    var {nameListTo, nameListFrom} = req.body;
    var merge_sql = 'SELECT * FROM List_of_Items LEFT JOIN Lists ON List_of_Items.listID = Lists.listID LEFT JOIN Items on List_of_Items.itemID = Items.itemID WHERE nameList=?';
    var from_list;
    connection.query(merge_sql, [nameListFrom], function(err, result, from_list){

        if(err){
          next(err);
          return;
        };

        from_list = result;
        console.log("from_list:", from_list);

        for (var element in from_list) {
            console.log("itemID:", from_list[element].itemID);
        };
    });
    //console.log("from_list:", from_list);
  }

  else {
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

  };



});

// route to delete shopping list based on listID, userID in req.body
app.delete('/shoppingList', /*ensureLoggedIn.ensureLoggedIn('/login'),*/function(req,res,next){
    res.locals.login = req.isAuthenticated();
  // delete list with listID provided in req.body

    console.log('using the app route');
    console.log('');

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
app.put('/shoppingList', /*ensureLoggedIn.ensureLoggedIn('/login'),*/function(req,res,next){
  res.locals.login = req.isAuthenticated();
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



// route for:
//     - adding a new item to a shopping list
//     - marking & unmarking an item
app.post('/shoppinglist', /*ensureLoggedIn.ensureLoggedIn('/login'),*/function (req, res, next) {
    console.log("reached post to /shoppinglist");
    res.locals.login = req.isAuthenticated();

    // marking an item
    if (req.body.Unchecked) { // include "markItem" value in submit element to indicate option 1
        console.log("check item reached");
        var {listID, itemID} = req.body; // required front-end args: listID, itemID, quantity
        connection.query('UPDATE List_of_Items SET markStatus=1 WHERE listID=? AND itemID=?', [listID, itemID], function (err, result) {
            if (err) {
                next(err);
                return;
            };
        });

        // fetch & re-render updated list of items
        var context = {};
        var sql = 'SELECT Lists.listID, Lists.nameList, List_of_Items.itemID, List_of_Items.quantity, List_of_Items.markStatus, Items.itemName FROM Lists LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID LEFT JOIN Items ON List_of_Items.itemID = Items.itemID WHERE Lists.nameList =?';
        connection.query(sql,req.body.nameList, function (err, results, fields) {
            if (err) {
                console.log("error");
                next(err);
                return;
            }
            console.log(req.body.nameList);
            context.context = results;
            console.log(results);
            console.log(context);
            //TODO RENDER ACTUAL DATA
            res.render('shoppinglist', context);
        });
    }

    // unmarking an item
    else if (req.body.Checked) {
        console.log("uncheck item reached");
        var { listID, itemID } = req.body; // required front-end args: listID, itemID, quantity
        connection.query('UPDATE List_of_Items SET markStatus=0 WHERE listID=? AND itemID=?', [listID, itemID], function (err, result) {
            if (err) {
                next(err);
                return;
            };
        });

        // fetch & re-render updated list of items
        var context = {};
        var sql = 'SELECT Lists.listID, Lists.nameList, List_of_Items.itemID, List_of_Items.quantity, List_of_Items.markStatus, Items.itemName FROM Lists LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID LEFT JOIN Items ON List_of_Items.itemID = Items.itemID WHERE Lists.nameList = ?';
        connection.query(sql,req.body.nameList, function (err, results, fields) {
            if (err) {
                console.log("error");
                next(err);
                return;
            }
            context.context = results;
            //console.log(context);
            //TODO RENDER ACTUAL DATA
            res.render('shoppinglist', context);
        });

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

        var query = 'SELECT Lists.listID, Lists.nameList, List_of_Items.itemID, List_of_Items.quantity, List_of_Items.markStatus, Items.itemName FROM Lists LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID LEFT JOIN Items ON List_of_Items.itemID = Items.itemID WHERE Lists.nameList = ?';
        var context = {};
       
        connection.query(query, listID, function (err, results, fields) {
            if (err) {
                console.log("error");
                next(err);
                return;
            }
            context.listitems = results;
            res.render('shoppinglist', { context: context.listitems });
        });

    };


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

app.get('/edit-list', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {
  res.locals.login = req.isAuthenticated();
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
app.post('/edit-list', /*ensureLoggedIn.ensureLoggedIn('/login'),*/function(req,res,next){
  res.locals.login = req.isAuthenticated();
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


app.delete('/edit-list', /*ensureLoggedIn.ensureLoggedIn('/login'),*/function(req,res,next){
  res.locals.login = req.isAuthenticated();
  res.render('edit-list');
});

// route for 1) marking an item, 2) unmarking an item, ...(other additional features)
app.put('/edit-list', /*ensureLoggedIn.ensureLoggedIn('/login'),*/function (req, res, next) {
    res.locals.login = req.isAuthenticated();
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
});


app.get('/defaultlist', ensureLoggedIn.ensureLoggedIn('/login'),function(req,res,next){
  res.locals.login = req.isAuthenticated();
  var context = {};

  // sql placeholder variable
  var getDefaultItemsList = "SELECT * FROM Items";

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

app.get('/admin-portal', ensureLoggedIn.ensureLoggedIn('/login'),
  function(req,res,next){
  res.locals.login = req.isAuthenticated();
  res.render('admin-portal');
});

app.get('/logout', function(req, res){
  res.locals.login = req.isAuthenticated();
  req.logout();
  res.redirect('/');
})

// 404 error route
app.use(function(req,res){
  res.locals.login = req.isAuthenticated();
  res.status(404);
  res.render('404');
});
  
// 500 server error route
app.use(function(err, req, res, next){
  res.locals.login = req.isAuthenticated();
  console.error(err.stack);
  res.status(500);
  res.render('500');
});
  
// listen command
app.listen(app.get('port'), function(){
  console.log('Express started on http://' + process.env.HOSTNAME + ':' + app.get('port') + '; press Ctrl-C to terminate.');
});
