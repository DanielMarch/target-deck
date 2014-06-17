var opCollection = global.nss.db.collection('ops');
var Mongo = require('mongodb');
var _ = require('lodash');

class Op{
  static create(obj, id, fn){
    opCollection.findOne({name:obj.name[0].toUpperCase()}, (e,o)=>{
      if(o){
        fn(null);
      }else{
        var op = new Op();
        op.name = obj.name[0].toUpperCase();
        op.date = new Date(obj.date[0]);
        op.poc = Mongo.ObjectID(obj.poc[0]);
        op.org = Mongo.ObjectID(id);
        opCollection.save(op, ()=>fn(op));
      }
    });
  }

  static findByOrgId(orgId, fn){
    opCollection.find({org: orgId}).toArray((e, ops)=>{
      fn(ops);
    });
  }

  static findById(id, fn){
    if(typeof id === 'string'){
      id = Mongo.ObjectID(id);
    }

    opCollection.findOne({_id:id}, (e,o)=>{
      if(o){
        o = _.create(Op.prototype, o);
        fn(o);
      }else{
        fn(null);
      }
    });
  }

  destroy(fn){
    opCollection.remove({_id:this._id}, ()=>fn());
  }
}

module.exports = Op;
