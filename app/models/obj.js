var objCollection = global.nss.db.collection('objs');
var Mongo = require('mongodb');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var _ = require('lodash');

class Obj{
  static create(fields, files, orgId, fn){
    objCollection.findOne({obj:fields.obj[0].toUpperCase()}, (e,o)=>{
      if(o){
        fn(null);
      }else{
        var obj = new Obj();
        obj._id = Mongo.ObjectID();
        obj.objname = fields.obj[0].toUpperCase();
        obj.name = fields.name[0].toUpperCase();
        obj.status = fields.status[0].toUpperCase();
        obj.priority = fields.priority[0];
        obj.opId = Mongo.ObjectID(fields.operation[0]);
        obj.orgId = Mongo.ObjectID(orgId);
        obj.imagery = [];
        obj.processImagery(files.imagery);
        obj.reports = [];
        obj.processReports(files.reports);
        obj.profilePic = [];
        obj.processProfilePic(files.profile);
        objCollection.save(obj, ()=>fn(obj));
      }
    });
  }

  static findByOrgId(orgId, fn){
    objCollection.find({orgId: orgId}).toArray((e, objs)=>{
      fn(objs);
    });
  }

  static findById(id, fn){
    if(typeof id === 'string'){
      id = Mongo.ObjectID(id);
    }

    objCollection.findOne({_id:id}, (e,o)=>{
      if(o){
        o = _.create(Obj.prototype, o);
        fn(o);
      }else{
        fn(null);
      }
    });
  }

  static search(params, fn){
    var objname = new RegExp(params.toUpperCase().toString());
    objCollection.find({objname:{$in:[objname]}}).toArray((e, objs)=>{
      if(objs.length > 0){
        fn(objs);
      }else{
        fn(null);
      }
    });
  }

  processImagery(photos){
    photos.forEach(p=>{
      if(p.size){
        var name = crypto.randomBytes(12).toString('hex') + path.extname(p.originalFilename).toLowerCase();
        var file = `/img/${this.orgId}/${this._id}/${name}`;

        var photo = {};
        photo.name = name;
        photo.file = file;
        photo.size = p.size;
        photo.orig = p.originalFilename;

        var orgDir = `${__dirname}/../static/img/${this.orgId}`;
        var objDir = `${orgDir}/${this._id}`;
        var fullDir = `${objDir}/${name}`;

        if(!fs.existsSync(orgDir)){fs.mkdirSync(orgDir);}
        if(!fs.existsSync(objDir)){fs.mkdirSync(objDir);}

        fs.renameSync(p.path, fullDir);

        this.objDir = path.normalize(objDir);
        this.imagery.push(photo);
      }
    });
  }

  processReports(reports){
    reports.forEach(r=>{
      if(r.size){
        var name = crypto.randomBytes(12).toString('hex') + path.extname(r.originalFilename).toLowerCase();
        var file = `/files/${this.orgId}/${this._id}/${name}`;

        var report = {};
        report.name = name;
        report.file = file;
        report.size = r.size;
        report.orig = r.originalFilename;

        var orgDir = `${__dirname}/../static/files/${this.orgId}`;
        var objDir = `${orgDir}/${this._id}`;
        var fullDir = `${objDir}/${name}`;

        if(!fs.existsSync(orgDir)){fs.mkdirSync(orgDir);}
        if(!fs.existsSync(objDir)){fs.mkdirSync(objDir);}

        fs.renameSync(r.path, fullDir);

        this.objDir = path.normalize(objDir);
        this.reports.push(report);
      }
    });
  }

  processProfilePic(photos){
    photos.forEach(p=>{
      if(p.size){
        var name = crypto.randomBytes(12).toString('hex') + path.extname(p.originalFilename).toLowerCase();
        var file = `/img/${this.orgId}/${this._id}/${name}`;

        var photo = {};
        photo.name = name;
        photo.file = file;
        photo.size = p.size;
        photo.orig = p.originalFilename;

        var orgDir = `${__dirname}/../static/img/${this.orgId}`;
        var objDir = `${orgDir}/${this._id}`;
        var fullDir = `${objDir}/${name}`;

        if(!fs.existsSync(orgDir)){fs.mkdirSync(orgDir);}
        if(!fs.existsSync(objDir)){fs.mkdirSync(objDir);}

        fs.renameSync(p.path, fullDir);

        this.objDir = path.normalize(objDir);
        this.profilePic.push(photo);
      }
    });
  }

  destroy(fn){
    objCollection.remove({_id:this._id}, ()=>fn());
  }
}

module.exports = Obj;
