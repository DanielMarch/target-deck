'use strict';

var traceur = require('traceur');
var Org = traceur.require(__dirname + '/../models/org.js');
var multiparty = require('multiparty');

exports.register = (req, res)=>{
  res.render('org/register', {title: 'Target-Deck: Register New Organization'});
};

exports.validate = (req, res)=>{
  Org.create(req.body, org=>{
    if(org){
      res.redirect('/');
    }else{
      res.redirect('/register');
    }
  });
};

exports.verify = (req, res)=>{
  Org.findById(req.params.id, o=>{
    res.render('org/verify', {o:o, title: 'Target-Deck: Verify Organization and Create Profile'});
  });
};

exports.update = (req, res)=>{
  Org.findById(req.params.id, org=>{
    var form = new multiparty.Form();

    form.parse(req, (err, fields, files)=>{
      org.update(fields, files);
      org.save(()=>{
        res.redirect('/dash');
      });
    });
  });
};

exports.login = (req, res)=>{
  Org.login(req.body, org=>{
    if(org){
      req.session.userId = org._id;
      res.redirect('/portal');
    }else{
      req.session = null;
      res.redirect('/dash');
    }
  });
};

exports.logout = (req, res)=>{
  req.session = null;
  delete req.session;
  res.redirect('/dash');
};

exports.portal = (req, res)=>{
  res.render('org/portal', {title: 'Target-Deck: Organization Portal'});
};
