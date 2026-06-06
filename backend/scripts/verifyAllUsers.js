import mongoose from 'mongoose';
import User from '../models/user.model.js';

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/JobPortal';

try {
  await mongoose.connect(MONGO_URI);
  const res = await User.updateMany({ role: 'user', isVerified: false }, { $set: { isVerified: true } });
  console.log('updated', res.modifiedCount);
  await mongoose.disconnect();
} catch (err) {
  console.error(err);
  process.exit(1);
}
