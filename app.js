var express = require('express');
var mysql = require('mysql');
var argon2 = require('argon2');
var crypto = require('crypto'); //built into Node.js, but must require it
var passport = require('passport');
var LocalStrategy = require('passport-local');

if(process.env.JAWSDB_URL){
  var connection = mysql.createConnection(process.env.JAWSDB_URL);
}else{
;
}

var app = express();

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


var fakeData = 
            {"name":"bob", 
             "username":"bob@gmail.com",
             "salt":"e0d2fddd8185e1e585f3c3de74a340abfd4f81c90636ac62bcd63059ce2a38eb",
             "hash":"$argon2i$v=19$m=4096,t=3,p=1$qnSNsiZ+NGFZ1m3xdr9Tew$2BV7U4v1BYnTWdyc2CyZBQTV2JH1gLIBov8wXYWUXwM",
             "isAdmin":"false",
             "lists":
              [
                {"listName":"April", 
                "listItems":
                    {"item1":"apple",
                    "item2":"pear",
                    "item3":"peach"
                    }
                },
                {"listName":"May", 
                "listItems":
                    {"item1":"beetle",
                    "item2":"ant",
                    "item3":"ladybug"
                    }
                },
                {"listName":"June", 
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

app.post('/login',async function(req,res,next){
  const salt = fakeData.salt;
  const storedHash = fakeData.hash;

  try {

    const correctPassword = await argon2.verify(fakeData.hash, req.body.password);
    console.log(correctPassword);
  } catch (err) {
    console.log("error in hashing");
  }

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

app.get('/shoppinglist',function(req,res,next){
  var context = {};
  // mysql.connection.query("SELECT * FROM users", function(err, rows, fields){
  //   if(err){
  //     next(err);
  //     return;
  //   }
  //   res.json({rows:rows});
  res.render('shoppinglist',{fakeData:fakeData});
  // });
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
