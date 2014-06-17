'use strict';

var traceur = require('traceur');
var Org = traceur.require(__dirname + '/../models/org.js');
var Op = traceur.require(__dirname + '/../models/op.js');
var User = traceur.require(__dirname + '/../models/user.js');
var multiparty = require('multiparty');

exports.index = (req, res)=>{
  Org.findById(req.session.userId, org=>{
    User.findByOrgId(org._id, users=>{
      Op.findByOrgId(org._id, ops=>{
        console.log(users);
        res.render('op/index', {users:users, org:org, ops:ops, title: 'Target-Deck: Manage Organization Operations'});
      });
    });
  });
};

exports.new = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req, (err, fields)=>{
    Op.create(fields, req.session.userId, op=>{
      console.log(op);
      res.redirect('/ops');
    });
  });
};

exports.delete = (req, res)=>{
  Op.findById(req.params.id, op=>{
    if(req.session.userId.toString() === op.org.toString()){
      op.destroy(()=>res.redirect('/ops'));
    }else{
      res.redirect('/dash');
    }
  });
};
