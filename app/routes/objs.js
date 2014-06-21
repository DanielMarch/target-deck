'use strict';

var traceur = require('traceur');
var Org = traceur.require(__dirname + '/../models/org.js');
var Obj = traceur.require(__dirname + '/../models/obj.js');
var User = traceur.require(__dirname + '/../models/user.js');
var Op = traceur.require(__dirname + '/../models/op.js');
var multiparty = require('multiparty');
var _ = require('lodash');

exports.new = (req, res)=>{
  User.findById(req.session.userId, user=>{
    Op.findByOrgId(user.org, ops=>{
      Obj.findByOrgId(user.org, objs=>{
        res.render('obj/new', {ops:ops, objs:objs, title: 'Target-Deck: New Objective'});
      });
    });
  });
};

exports.create = (req, res)=>{
  User.findById(req.session.userId, user=>{
    var form = new multiparty.Form();
    form.parse(req, (err, fields, files)=>{
      Obj.create(fields, files, user.org, obj=>{
        console.log(obj);
        res.redirect('/userportal');
      });
    });
  });
};

exports.edit = (req, res)=>{
  Obj.findById(req.params.id, obj=>{
    var form = new multiparty.Form();
    form.parse(req, (err, fields, files)=>{
      obj.update(fields, files);
      obj.save(()=>{
        res.redirect('/userportal');
      });
    });
  });
};

exports.delete = (req, res)=>{
  Obj.findById(req.params.id, obj=>{
    obj.destroy(()=>res.redirect('/userportal'));
  });
};

exports.profile = (req, res)=>{
  Obj.findById(req.params.id, obj=>{
    Org.findById(obj.orgId, org=>{
      Op.findById(obj.opId, op=>{
        res.render('obj/profile', {_:_, obj:obj, org:org, op:op, title: 'Target-Deck: ' + obj.objname});
      });
    });
  });
};

exports.search = (req, res)=>{
  Obj.search(req.query.search, objs=>{
    if(objs === null){
      res.redirect('/userportal');
    }else{
      Op.findAll(ops=>{
        res.render('obj/results', {_:_, ops:ops, objs:objs, title: 'Target-Deck: Search Results'});
      });
    }
  });
};

exports.prepedit = (req, res)=>{
  Obj.findById(req.params.id, obj=>{
    User.findById(req.session.userId, user=>{
      Op.findByOrgId(user.org, ops=>{
        res.render('obj/edit', {obj:obj, ops:ops, title: 'Target-Deck: ' + obj.objname + ' Edit'});
      });
    });
  });
};
