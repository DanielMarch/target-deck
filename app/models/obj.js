var objCollection = global.nss.db.collection('objs');
var Mongo = require('mongodb');
var fs = require('fs');
var path = require('path');

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
        if(files.profile[0].size !== 0){
          obj.profilePhoto = `/img/${obj._id.toString()}/${files.profile[0].originalFilename}`;
          var orgDir = `${__dirname}/../static/img/${obj._id.toString()}`;
          orgDir = path.normalize(orgDir).toString();
          obj.profilePhotoPath = `${orgDir}/${files.profile[0].originalFilename}`;
          obj.profilePhotoDir = orgDir;
          if(!fs.existsSync(orgDir)){
            fs.mkdirSync(orgDir);
          }
          fs.renameSync(files.profile[0].path, obj.profilePhotoPath);
        }
        objCollection.save(obj, ()=>fn(obj));
      }
    });
  }

  static findByOrgId(orgId, fn){
    objCollection.find({orgId: orgId}).toArray((e, objs)=>{
      fn(objs);
    });
  }
}

module.exports = Obj;
