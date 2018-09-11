const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const expressVarlidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session')
const passport = require('passport');
const config = require('./config/database')

//Mangoose
mongoose.connect(config.database);
let db = mongoose.connection;

//Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

//Check db errors
db.on('error', function(err){
  console.log(err);
});

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//BodyParser

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Set Public User
app.use(express.static(path.join(__dirname,'public')));

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialize: true,
  cokkie: {secure: true}
}));

//Express Message Middleware
app.use(require('connect-flash')());
app.use(function(req,res,next){
  res.locals.messages = require('express-messages')(req,res);
  next();
});

//Express Validator Middleware
app.use(expressVarlidator({
  errorFormatter: function(param,msg,value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//Passport Config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res,next){
  res.locals.user = req.user || null;
  next();
})


//Bring in Models
const Medal = require('./models/medalSchema');

//Route
app.get('/', function (req, res) {
  Medal.find({}, function(err, data){
    if(err){
      console.log(err);
    }else{
      res.render('index', {title:'Home', medals: data});
    }
  });
});

//Route Files
let medals = require('./routes/medals');
let users = require('./routes/users');
app.use('/medals',medals);
app.use('/users',users);

app.post('/', function (req, res) {
  res.send('you sent a post request.')
})

//Start Server
app.listen(3000, () => console.log('Example app listening on port 3000!'))
