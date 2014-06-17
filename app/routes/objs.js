'use strict';

var traceur = require('traceur');
var Obj = traceur.require(__dirname + '/../models/obj.js');
var User = traceur.require(__dirname + '/../models/user.js');
var Op = traceur.require(__dirname + '/../models/op.js');
var multiparty = require('multiparty');

exports.new = (req, res)=>{
  User.findById(req.session.userId, user=>{
    Op.findByOrgId(user.org, ops=>{
      res.render('obj/new', {ops:ops, title: 'Target-Deck: New Objective'});
    });
  });
};

exports.create = (req, res)=>{
  User.findById(req.session.userId, user=>{
    var form = new multiparty.Form();
    form.parse(req, (err, fields, files)=>{
      Obj.create(fields, files, user.org, ()=>{
        res.redirect('/userportal');
      });
    });
  });
};
