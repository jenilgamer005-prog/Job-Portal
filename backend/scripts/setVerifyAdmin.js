import mongoose from 'mongoose';
import User from '../models/user.model.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/JobPortal';

try {
  await mongoose.connect(MONGO_URI);
  const res = await User.updateOne({ email: 'admin@jobportal.local' }, { $set: { isVerified: true }, $unset: { verificationOTP: "", verificationOTPExpires: "" } });
  console.log('UPDATE RESULT:', res);
  const user = await User.findOne({ email: 'admin@jobportal.local' }).lean();
  console.log('USER:', JSON.stringify(user, null, 2));
  await mongoose.disconnect();
} catch (err) {
  console.error('ERR:', err);
  process.exit(1);
}
