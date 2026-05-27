const Settings = require("../models/Settings");

exports.getPublic = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    const items = await Settings.find();
    const map = {};
    items.forEach(i => { map[i.key] = i.value; });
    res.json(map);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const items = await Settings.find().sort({ group: 1, key: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const item = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { returnDocument: "after", upsert: true }  // upsert — create if not exists
    );
    res.json(item);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBulk = async (req, res) => {
  try {
    const updates = req.body;
    const results = [];
    for (const [key, value] of Object.entries(updates)) {
      const item = await Settings.findOneAndUpdate(
        { key },
        { value },
        { returnDocument: "after", upsert: true }   // upsert — create if not exists
      );
      if (item) results.push(item);
    }
    res.json({ updated: results.length });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
