import mongoose from 'mongoose';
import User from '../models/user.model.js';

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/jobportal';

try {
  await mongoose.connect(MONGO_URI);
  const users = await User.find({}, { name:1, email:1, role:1, isVerified:1, createdAt:1 }).lean();
  console.log(JSON.stringify(users, null, 2));
  await mongoose.disconnect();
} catch (err) {
  console.error(err);
  process.exit(1);
}
