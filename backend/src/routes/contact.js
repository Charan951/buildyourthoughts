const express = require("express");
const router = express.Router();
const { submit, getAll, updateStatus, deleteContact } = require("../controllers/contactController");
const { verifyToken } = require("../middleware/auth");

router.post("/", submit);
router.get("/", verifyToken, getAll);
router.patch("/:id/status", verifyToken, updateStatus);
router.delete("/:id", verifyToken, deleteContact);

module.exports = router;
