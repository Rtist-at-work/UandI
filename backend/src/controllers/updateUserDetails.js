const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const User = require('../models/usermodel');  // Assuming you have a User model

router.put('/', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Token missing or invalid' });
}
  const  addresses  = req.body;
 
  if (!addresses || !Array.isArray(addresses)) {
    return res.status(400).json({ error: "Invalid addresses format" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },       // Filter by username
      { $set: { addresses: addresses } },  // Update the addresses field
      { new: true }                 // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Addresses updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
