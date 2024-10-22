const express = require('express');
const bcrypt = require('bcrypt');
const userloginmodel = require('../models/usermodel');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { emailOrMobile, password } = req.body;
    console.log(emailOrMobile  +  password);

    // Determine if input is an email or mobile number
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile);
    const user = await userloginmodel.findOne(isEmail ? { 'personalInfo.email': emailOrMobile } : { 'personalInfo.mobile': emailOrMobile });
    if (!user) {
        return res.status(401).json({ status: false, message: "User not registered" });
    }

    // Compare the password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.personalInfo.password);
    if (!validPassword) {
        return res.json({ status: false, message: "Invalid password" });
    }

    // Generate JWT token if password is valid
    const token = jwt.sign(
        {
          username: user.personalInfo.username,
          id:user._id,
        },
        process.env.KEY,
        { expiresIn: "12hr"}
      );
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
      return res.json({ status: true, message: "Login successfully" });
});

module.exports = router;
