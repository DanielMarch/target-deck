var userCollection = global.nss.db.collection('users');
var request = require('request');
var Mongo = require('mongodb');
var _ = require('lodash');
var bcrypt = require('bcrypt');

class User{
  static create(obj, id, fn){
    userCollection.findOne({email:obj.email}, (e,u)=>{
      if(u){
        fn(null);
      }else{
        var user = new User();
        user.email = obj.email;
        user.org = Mongo.ObjectID(id);
        user.password = '';
        user.isValid = false;

        userCollection.save(user, ()=>{
          sendVerificationEmail(user, fn);
        });
      }
    });
  }

  static findById(id, fn){
    if(typeof id === 'string'){
      id = Mongo.ObjectID(id);
    }

    userCollection.findOne({_id:id}, (e,u)=>{
      if(u){
        u = _.create(User.prototype, u);
        fn(u);
      }else{
        fn(null);
      }
    });
  }

  static login(obj, fn){
    userCollection.findOne({email:obj.email}, (e,user)=>{
      if(user){
        var isGood = bcrypt.compareSync(obj.password, user.password);
        if(isGood && user.isValid){
          fn(user);
        }else{
          fn(null);
        }
      }else{
        fn(null);
      }
    });
  }

  save(fn) {
    userCollection.save(this, ()=>fn());
  }

  update(fields, files){
    this.password = bcrypt.hashSync(fields.password[0], 8);
    this.isValid = true;
    this.name = fields.name[0];
    this.dsn = fields.dsn[0];
    this.affiliation = fields.affiliation[0];
  }
}

function sendVerificationEmail(user, fn){
  'use strict';

  var key = process.env.MAILGUN;
  var url = 'https://api:' + key + '@api.mailgun.net/v2/sandbox37a55637a34f400ca8a9a3626512aee3.mailgun.org/messages';
  var post = request.post(url, function(err, response, body){
    fn(user);
  });

  var form = post.form();
  form.append('from', 'admin@targetdeck.com');
  form.append('to', user.email);
  form.append('subject', 'Please verify your account on Target-Deck');
  form.append('html', `<a href="http://localhost:4000/verifyu/${user._id}">Click to Verify</a>`);
}

module.exports = User;
