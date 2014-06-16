var opCollection = global.nss.db.collection('ops');

class Op{
  static findByOrgId(orgId, fn){
    opCollection.find({org: orgId}).toArray((e, ops)=>{
      fn(ops);
    });
  }
}

module.exports = Op;
