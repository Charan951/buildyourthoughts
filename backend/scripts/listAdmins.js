const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../src/config/db');
const Admin = require('../src/models/Admin');

(async () => {
  try {
    await connectDB();
    const admins = await Admin.find({}).lean();
    console.log('admins:', admins.map(a => ({ email: a.email, isActive: a.isActive, role: a.role }))); 
    process.exit(0);
  } catch (err) {
    console.error('err', err);
    process.exit(1);
  }
})();
