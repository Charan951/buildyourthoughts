const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Admin = require("../models/Admin");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const buildResetUrl = () => {
  const front = process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 8080}`;
  return `${front.replace(/\/$/, "")}/admin/reset`;
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !admin.isActive)
      return res.status(401).json({ message: "Invalid credentials." });
    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });
    admin.lastLogin = new Date();
    await admin.save();
    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.json({ token, admin: { email: admin.email, name: admin.name, role: admin.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.verify = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ valid: false });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, admin: decoded });
  } catch {
    res.json({ valid: false });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase(), isActive: true });
    if (!admin) {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await admin.save();

    const resetLink = `${buildResetUrl()}/${resetToken}`;
    await transporter.sendMail({
      from: `"BUILD YOUR THOUGHTS" <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: "Admin password reset request",
      html: `
        <p>Hello ${admin.name},</p>
        <p>You requested a password reset for your admin account. Click the link below to set a new password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link expires in one hour. If you did not request this, please ignore this email.</p>
      `,
    });

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Unable to process reset request." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: "Token and new password are required." });
  if (typeof password !== "string" || password.trim().length < 8)
    return res.status(400).json({ message: "Password must be at least 8 characters." });

  try {
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
      isActive: true,
    });

    if (!admin) return res.status(400).json({ message: "Invalid or expired reset token." });

    admin.password = bcrypt.hashSync(password.trim(), 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.json({ message: "Password has been reset. You can now sign in with your new password." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Unable to reset password." });
  }
};
