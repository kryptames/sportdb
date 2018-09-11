const express = require('express');
const router = express.Router();

//Bring in Medal Models
const Medal = require('../models/medalSchema');
//User Model
const User = require('../models/user');

//Add Medal
router.get('/add', function (req, res) {
    res.render('add_medal', {
      title:'Add medal'
    })
  })
  router.post('/add',ensureAuthenticated, function (req, res) {
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('sex', 'Sex is required').notEmpty();
    req.checkBody('year', 'Year is required').notEmpty();
    req.checkBody('year', 'Year is not valid').isNumeric();
    req.checkBody('location', 'Location is required').notEmpty();
    req.checkBody('sport', 'Game is required').notEmpty();
  
    //Get Errors
    let errors = req.validationErrors();
  
    if(errors){
      res.render('add_medal',{
        title: 'Add medal',
        errors:errors
      });
    }
    else{
      let medal = new Medal();
      medal.name = req.body.name
      medal.sex = req.body.sex
      medal.year = req.body.year
      medal.location = req.body.location
      medal.sport = req.body.sport
      medal.note = req.user._id

      medal.save(function(err){
        if(err){
          console.log(err)
        }else{
          req.flash('success','Medal Added')
          res.redirect('/')
        }
      })
    }
  })
  
  //Edit
  router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Medal.findById(req.params.id, function(err, medal){
      if(medal.note != req.user._id){
        req.flash('danger', 'Not Authorized');
        return res.redirect('/');
      }
      res.render('edit_medal', {
        title:'Edit Medal',
        medal:medal
      });
    });
  });
  
  //Update
  router.post('/edit/:id', function (req, res) {
    let medal = {};
    medal.name = req.body.name
    medal.sex = req.body.sex
    medal.year = req.body.year
    medal.location = req.body.location
    medal.sport = req.body.sport


    let query = {_id:req.params.id}
  
    Medal.update(query,medal,function(err){
      if(err){
        console.log(err)
      }else{
        req.flash('success','Medal Update')
        res.redirect('/')
      }
    })
  })
  
  //Delete Medal
  router.delete('/:id', function(req,res){
    if (!req.user._id){
        res.status(500).send()
    }
    
    let query = {_id:req.params.id}
    Medal.findById(req.params.id, function(err,medal){
        if (medal.note != req.user._id){
            res.status(500).send()
        }
        else{
            medal.remove(query,function(err){
            if(err){
                console.log(err)
            }
            req.flash('success','Medal Deleted')
            res.send('Success')
            })
        }
    })
  })
  
//Get Single Medal
router.get('/:id', function(req,res){
    Medal.findById(req.params.id,function(err,medal){
      User.findById(medal.note, function(err,user){
          res.render('medal',{
            medal:medal,
            note: user.name
          })
      })
    });
  });

 // Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else {
      req.flash('danger', 'Please login');
      res.redirect('/users/login');
    }
  }

  module.exports = router;