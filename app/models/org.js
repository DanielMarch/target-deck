var orgCollection = global.nss.db.collection('orgs');
var request = require('request');
var Mongo = require('mongodb');
var _ = require('lodash');
var bcrypt = require('bcrypt');
var fs = require('fs');
var path = require('path');

class Org{
  static create(obj, fn){
    orgCollection.findOne({email:obj.email}, (e,o)=>{
      if(o){
        fn(null);
      }else{
        var org = new Org();
        org.email = obj.email;
        org.name = '';
        org.password = '';
        org.dsn = '';
        org.poc = '';
        org.isValid = false;

        orgCollection.save(org, ()=>{
          sendVerificationEmail(org, fn);
        });
      }
    });
  }

  static login(obj, fn){
    orgCollection.findOne({email:obj.email}, (e,org)=>{
      if(org){
        var isGood = bcrypt.compareSync(obj.password, org.password);
        if(isGood && org.isValid){
          fn(org);
        }else{
          fn(null);
        }
      }else{
        fn(null);
      }
    });
  }

  static findById(id, fn){
    if(typeof id === 'string'){
      id = Mongo.ObjectID(id);
    }

    orgCollection.findOne({_id:id}, (e,o)=>{
      if(o){
        o = _.create(Org.prototype, o);
        fn(o);
      }else{
        fn(null);
      }
    });
  }

  save(fn) {
    orgCollection.save(this, ()=>fn());
  }

  update(fields, files){
    this.password = bcrypt.hashSync(fields.password[0], 8);
    this.isValid = true;
    this.name = fields.name[0];
    this.dsn = fields.dsn[0];
    this.poc = fields.poc[0];
    if(files.logo[0].size !== 0){
      this.primaryPhoto = `/img/${this._id.toString()}/${files.logo[0].originalFilename}`;
      var orgDir = `${__dirname}/../static/img/${this._id.toString()}`;
      orgDir = path.normalize(orgDir);
      this.primaryPhotoPath = `${orgDir}/${files.logo[0].originalFilename}`;
      this.primaryPhotoDir = orgDir;
      if(!fs.existsSync(orgDir)){
        fs.mkdirSync(orgDir);
      }
      fs.renameSync(files.logo[0].path, this.primaryPhotoPath);
    }
  }
}

function sendVerificationEmail(org, fn){
  'use strict';

  var key = process.env.MAILGUN;
  var url = 'https://api:' + key + '@api.mailgun.net/v2/sandbox37a55637a34f400ca8a9a3626512aee3.mailgun.org/messages';
  var post = request.post(url, function(err, response, body){
    fn(org);
  });

  var form = post.form();
  form.append('from', 'admin@targetdeck.com');
  form.append('to', org.email);
  form.append('subject', 'Please verify your email address and create your organization on Target Deck');
  form.append('html', `<a href="http://target-deck.sethmarch.io/verify/${org._id}">Click to Verify</a>`);
}

module.exports = Org;
