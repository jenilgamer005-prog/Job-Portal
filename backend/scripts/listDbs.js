const dbs = db.adminCommand({ listDatabases: 1 });
printjson(dbs);
