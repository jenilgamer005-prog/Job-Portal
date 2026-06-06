use JobPortal;
const res = db.getCollection('users').updateOne({ email: 'admin@jobportal.local' }, { $set: { isVerified: true } });
printjson(res);
printjson(db.getCollection('users').findOne({ email: 'admin@jobportal.local' }));
