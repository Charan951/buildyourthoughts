const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.submit = async (req, res) => {
  const { name, email, phone, address, subject, message } = req.body;
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim();
  const trimmedSubject = subject?.trim();
  const trimmedMessage = message?.trim();
  const trimmedPhone = phone?.trim() || "";
  const trimmedAddress = address?.trim() || "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage)
    return res.status(400).json({ message: "Name, email, subject, and message are required." });

  if (trimmedName.length > 80)
    return res.status(400).json({ message: "Name must be 80 characters or less." });
  if (trimmedEmail.length > 100)
    return res.status(400).json({ message: "Email must be 100 characters or less." });
  if (!emailRegex.test(trimmedEmail))
    return res.status(400).json({ message: "Please enter a valid email address." });
  if (trimmedPhone.length > 30)
    return res.status(400).json({ message: "Phone number must be 30 characters or less." });
  if (trimmedAddress.length > 120)
    return res.status(400).json({ message: "Address must be 120 characters or less." });
  if (trimmedSubject.length > 100)
    return res.status(400).json({ message: "Subject must be 100 characters or less." });
  if (trimmedMessage.length > 1200)
    return res.status(400).json({ message: "Message must be 1200 characters or less." });

  try {
    const entry = await Contact.create({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      address: trimmedAddress,
      subject: trimmedSubject,
      message: trimmedMessage,
    });

    // Respond immediately — don't let email failure block the user
    res.status(201).json({ message: "Message received! We'll get back to you soon.", id: entry._id });

    // Send notification email in the background (non-blocking)
    transporter.sendMail({
      from: `"BUILD YOUR THOUGHTS Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `BUILD YOUR THOUGHTS Contact Form Submission`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "—"}</p>
        <p><strong>Address:</strong> ${address ? address.replace(/\n/g, "<br>") : "—"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#888;font-size:12px;">Sent via BUILD YOUR THOUGHTS contact form</p>
      `,
    }).catch(err => console.error("Contact email send error:", err));

  } catch (err) {
    console.error("Contact submit error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getAll = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );
    if (!contact) return res.status(404).json({ message: "Not found." });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Not found." });
    res.json({ message: "Deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

