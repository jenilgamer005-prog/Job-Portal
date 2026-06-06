const users = db.getSiblingDB('JobPortal').users.find({}, { name:1, email:1, role:1, isVerified:1, createdAt:1 }).toArray();
printjson(users);
