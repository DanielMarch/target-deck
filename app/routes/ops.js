'use strict';

var traceur = require('traceur');
var Org = traceur.require(__dirname + '/../models/org.js');
var Op = traceur.require(__dirname + '/../models/op.js');
var User = traceur.require(__dirname + '/../models/user.js');
var multiparty = require('multiparty');

exports.index = (req, res)=>{
  Org.findById(req.session.userId, org=>{
    User.findByOrgId(org._id, users=>{
      console.log(users);
      Op.findByOrgId(org._id, ops=>{
        res.render('op/index', {users:users, org:org, ops:ops, title: 'Target-Deck: Manage Organization Operations'});
      });
    });
  });
};

exports.new = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req, (err, fields)=>{
    console.log(fields);
  });
};
