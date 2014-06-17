'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var orgs = traceur.require(__dirname + '/../routes/orgs.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var ops = traceur.require(__dirname + '/../routes/ops.js');
  var obj = traceur.require(__dirname + '/../routes/objs.js');

  app.all('*', orgs.lookup);

  app.get('/', dbg, home.index);
  app.get('/about', dbg, home.about);
  app.get('/dash', dbg, home.dash);

  app.get('/register', dbg, orgs.register);
  app.post('/register', dbg, orgs.validate);
  app.get('/verify/:id', dbg, orgs.verify);
  app.post('/verify/:id', dbg, orgs.update);

  app.get('/verifyu/:id', dbg, users.verify);
  app.post('/verifyu/:id', dbg, users.update);

  app.post('/logino', dbg, orgs.login);
  app.post('/loginu', dbg, users.login);

  app.all('*', dbg, orgs.bounce);

  app.get('/logout', dbg, orgs.logout);
  app.get('/portal', dbg, orgs.portal);
  app.get('/manage', dbg, orgs.manage);

  app.post('/registeru', dbg, users.validate);
  app.post('/users/:id/delete', dbg, users.delete);
  app.get('/userportal', dbg, users.portal);

  app.post('/ops/:id/delete', dbg, ops.delete);
  app.get('/ops', dbg, ops.index);
  app.post('/operation/new', dbg, ops.new);

  app.get('/obj/new', dbg, obj.new);
  app.post('/obj/new', dbg, obj.create);

  console.log('Routes Loaded');
  fn();
}
