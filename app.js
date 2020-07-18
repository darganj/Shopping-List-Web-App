var express = require('express');
var mysql = require('mysql');
var argon2 = require('argon2');
var crypto = require('crypto'); //built into Node.js, but must require it
var passport = require('passport');
var LocalStrategy = require('passport-local');
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

// set server info
app.disable('x-powered-by');
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

async function validPassword(password, hash) {
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
// console.log(genPassword("bob"));
// console.log(validPassword("bob", "$argon2i$v=19$m=4096,t=3,p=1$TdSx6GD+drh0HiqwZc5JPQ$SrwzrA3g6rSJWdl8kYD3+CjsoIEgrZ2R1UYolE22JQ0"));
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
              
        const isValid = validPassword(password, user.hash, user.salt);
              
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

  res.redirect('shoppinglist');
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

app.get('/shoppinglist', function (req, res, next) {

    var context = {};
       //Using user id = 1 for testing
    var userID = 1;

    connection.query('SELECT Lists.nameList FROM Users LEFT JOIN Lists ON Lists.userID = Users.userID WHERE Users.userID = 1', function (err, rows, fields) {
        if (err) {
            console.log("error");
            next(err);
            return;
        }
        context = rows;
        console.log(context);
        console.log(fakeData);
        context.results = JSON.stringify(context);
        console.log(context.results);
    });


  // mysql.connection.query("SELECT * FROM users", function(err, rows, fields){
  //   if(err){
  //     next(err);
  //     return;
  //   }
  //   res.json({rows:rows});
    res.render('shoppinglistovw', {data: context});
  // });
});


app.get('/chooselist', function (req, res, next) {
    var context = {};
    var listName = req.body; //Required arguments (listName to display list)

    connection.query('SELECT List_of_Items.quantity, Items.itemName FROM Lists LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID LEFT JOIN Items ON List_of_Items.itemID = Items.itemID WHERE Lists.nameList = (?)', [listName], function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        };
        context.results = rows;
        console.log(context.results);
    });



    res.render('shoppinglist', { data : conteresults });
});

app.get('/edit-list',function(req,res,next){
  res.render('edit-list');
});

app.post('/edit-list',function(req,res,next){
  res.render('edit-list');
});

app.delete('/edit-list',function(req,res,next){
  res.render('edit-list');
});

app.put('/edit-list',function(req,res,next){
  res.render('edit-list');
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
