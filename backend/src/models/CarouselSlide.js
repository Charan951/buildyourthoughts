const mongoose = require("mongoose");

const carouselSlideSchema = new mongoose.Schema(
  {
    badge: { type: String, required: true },
    title: { type: String, required: true },
    highlight: { type: String, required: true },
    desc: { type: String, required: true },
    ctaText: { type: String, default: "Learn More" },
    ctaLink: { type: String, default: "/services" },
    cta2Text: { type: String, default: "Contact Us" },
    cta2Link: { type: String, default: "/contact" },
    image: { type: String, default: "" },         // Cloudinary URL
    imagePublicId: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    highlightGradient: { type: String, default: "purple-blue-cyan-orange" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarouselSlide", carouselSlideSchema);
