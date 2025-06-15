// routes/emailRoutes.js

const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/emailService");

router.post("/send", async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    await sendEmail({ to, subject, text });
    res.status(200).json({ message: "Email sent!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;