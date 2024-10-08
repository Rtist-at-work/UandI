const express = require('express');
const usermodel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Ensure cookie-parser is added
require('dotenv').config();

const router = express.Router();

// Add cookie-parser middleware
router.use(cookieParser());

router.get('/userDetails', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const { username } = decoded;
    
    const user = await usermodel.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid token.' });
  }
});

router.get('/getUser',async (req,res)=>{
    try{
        const username = req.body;
    const user = await usermodel.findOne(username);
    res.json(user);
    }
    catch(err){
        res.json(err);
    }
})

router.post('/update/:updateId', async (req, res) => {
    try {
        const personalInfo = req.body;
        const { updateId } = req.params;  // Extract updateId as a string
        console.log(updateId);            // Log the updateId
        console.log(personalInfo);        // Log the personalInfo


        const user = await usermodel.findByIdAndUpdate(
            updateId, 
            { 'personalInfo': personalInfo },  // Spread personalInfo once
            
        );

        res.json(user);  // Send the updated user object as a response
    } catch (err) {
        res.json(err);  // Handle and send errors in the response
    }
});


module.exports = router;
