const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../src/config/db');
const Admin = require('../src/models/Admin');

(async () => {
  try {
    await connectDB();
    const keep = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAIL_2].filter(Boolean).map(e => e.toLowerCase());
    console.log('Keeping admins:', keep);
    const res = await Admin.updateMany({ email: { $nin: keep } }, { isActive: false });
    console.log('Legacy admins disabled, matchedCount:', res.matchedCount, 'modifiedCount:', res.modifiedCount);
    // Ensure env admins exist and are active (re-seed just in case)
    const bcrypt = require('bcryptjs');
    for (const email of keep) {
      const pwd = email === process.env.ADMIN_EMAIL ? process.env.ADMIN_PASSWORD : process.env.ADMIN_PASSWORD_2;
      const hashed = bcrypt.hashSync(pwd, 10);
      await Admin.findOneAndUpdate(
        { email },
        { email, name: email.split('@')[0], password: hashed, role: 'Super Admin', isActive: true },
        { upsert: true }
      );
    }
    const admins = await Admin.find({}, 'email isActive').lean();
    console.log('admins after update:', admins);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
