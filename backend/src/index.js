const express = require("express");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = require("./config/db");
const { verifyToken } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable gzip/deflate compression for responses
app.use(compression());
app.use(express.json());

// CORS — allow frontend dev server and production domains
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://127.0.0.1:8080",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
      if (/^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(origin)) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      const prodDomain = process.env.FRONTEND_URL;
      if (prodDomain && origin.endsWith(new URL(prodDomain).hostname)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const registerRoutes = () => {
  const authRoutes = require("./routes/auth");
  const dashboardRoutes = require("./routes/dashboard");
  const contactRoutes = require("./routes/contact");
  const projectRoutes = require("./routes/projects");
  const serviceRoutes = require("./routes/services");
  const siteContentRoutes = require("./routes/siteContent");
  const carouselRoutes = require("./routes/carousel");
  const jobRoutes = require("./routes/jobs");
  const teamRoutes = require("./routes/team");
  const blogRoutes = require("./routes/blog");
  const settingsRoutes = require("./routes/settings");
  const testimonialRoutes = require("./routes/testimonials");
  const assetRoutes = require("./routes/assets");
  const phoneShowcaseRoutes = require("./routes/phoneShowcase");

  app.use("/api/auth", authRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/site-content", siteContentRoutes);
  app.use("/api/carousel", carouselRoutes);
  app.use("/api/jobs", jobRoutes);
  app.use("/api/team", teamRoutes);
  app.use("/api/blog", blogRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/testimonials", testimonialRoutes);
  app.use("/api/assets", assetRoutes);
  app.use("/api/phone-showcase", phoneShowcaseRoutes);
  app.use("/api/dashboard", verifyToken, dashboardRoutes);
};

app.use(
  "/admin",
  express.static(path.join(__dirname, "../admin"), {
    maxAge: "7d",
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache, must-revalidate");
      } else {
        res.setHeader("Cache-Control", "public, max-age=604800, immutable");
      }
    },
  })
);

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/index.html"));
});

app.get("/", (req, res) => {
  res.json({ message: "BUILD YOUR THOUGHTS API is running", version: "1.0.0" });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`🔐 Admin panel: http://localhost:${port}/admin`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = Number(port) + 1;
      console.warn(`⚠️ Port ${port} is already in use, trying ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error(error);
      process.exit(1);
    }
  });
}

const initApp = async () => {
  await connectDB();
  registerRoutes();
  startServer(PORT);
};

initApp().catch((err) => {
  console.error("Failed to start app:", err);
  process.exit(1);
});
