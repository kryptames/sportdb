const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser')

//Mangoose
mongoose.connect('mongodb://localhost/nodekb');
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


//Bring in Models
const Article = require('./models/articleSchema');

//Route
app.get('/', function (req, res) {
  Article.find({}, function(err, data){
    if(err){
      console.log(err);
    }else{
      res.render('index', {title:'Home', news: data});
    }
  });
});

app.get('/news/add', function (req, res) {
  res.render('add_news', {
    title:'Add news'
  })
})
app.post('/news/add', function (req, res) {
  let article = new Article();
  article.title = req.body.title
  article.body = req.body.body
  article.save(function(err){
    if(err){
      console.log(err)
    }else{
      res.redirect('/')
    }
  })
})

//Get Single Article
app.get('/article/:id', function(req,res){
  Article.findById(req.params.id,function(err,data){
    res.render('article', {
      data:data
    })
  });
});

//Edit
app.get('/article/edit/:id', function(req,res){
  Article.findById(req.params.id,function(err,data){
    res.render('edit_article', {
      title: 'Edit Article',
      data:data
    })
  });
});

//Update
app.post('/article/edit/:id', function (req, res) {
  let article = {};
  article.title = req.body.title
  article.body = req.body.body

  let query = {_id:req.params.id}

  Article.update(query,article,function(err){
    if(err){
      console.log(err)
    }else{
      res.redirect('/')
    }
  })
})

app.delete('/article/:id', function(req,res){
  let query = {_id:req.params.id}
  Article.remove(query,function(err){
    if(err){
      console.log(err)
    }
    res.send('Success')
  })
})

app.post('/', function (req, res) {
  res.send('you sent a post request.')
})

//Start Server
app.listen(3000, () => console.log('Example app listening on port 3000!'))
