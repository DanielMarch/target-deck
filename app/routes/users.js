'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var multiparty = require('multiparty');
var _ = require('lodash');

exports.validate = (req, res)=>{
  User.create(req.body, req.session.userId, user=>{
    if(user){
      res.redirect('/portal');
    }else{
      res.redirect('/portal');
    }
  });
};

exports.verify = (req, res)=>{
  User.findById(req.params.id, u=>{
    res.render('user/verify', {u:u, title: 'Target-Deck: Verify User Profile'});
  });
};

exports.update = (req, res)=>{
  User.findById(req.params.id, user=>{
    var form = new multiparty.Form();
    form.parse(req, (err, fields)=>{
      user.update(fields);
      user.save(()=>{
        res.redirect('/dash');
      });
    });
  });
};

exports.login = (req, res)=>{
  User.login(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect('/userportal');
    }else{
      req.session = null;
      res.redirect('/dash');
    }
  });
};

exports.portal = (req, res)=>{
  res.render('user/portal', {title: 'Target-Deck: User Portal'});
};

exports.delete = (req, res)=>{
  User.findById(req.params.id, user=>{
    if(req.session.userId.toString() === user.org.toString()){
      user = _.create(User.prototype, user);
      user.destroy(()=>res.redirect('/manage'));
    }else{
      res.redirect('/dash');
    }
  });
};
