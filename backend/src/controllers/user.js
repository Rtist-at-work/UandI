const express = require('express');
const bcrypt = require('bcrypt');
const usermodel = require('../models/usermodel');
const multer = require('multer')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { body, validationResult } = require('express-validator'); // Import express-validator
const { v4: uuidv4 } = require('uuid');

const storage = multer.memoryStorage();

const upload = multer();

const router = express.Router();
router.use(cookieParser())


// Registration validation rules
const registerValidation = [
    body('username').notEmpty().withMessage('Username is required.'),
    body('emailOrMobile').notEmpty().withMessage('Email or Mobile is required.').custom(value => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!isEmail && isNaN(value)) {
            throw new Error('Email or Mobile must be a valid email or a mobile number.');
        }
        return true;
    }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('name').optional().isString().withMessage('Name must be a string.'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other.')
];

router.post('/register', registerValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, message: "Validation errors", errors: errors.array() });
    }

    const { username, emailOrMobile, password, name, gender } = req.body;

    console.log(username + "before")

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile);
    const existingUser = await usermodel.findOne(isEmail ? { 'personalInfo.email': emailOrMobile } : { 'personalInfo.mobile': emailOrMobile });
    const existingUsername = await usermodel.findOne({'personalInfo.username':username});
    console.log(existingUsername)

    if (existingUser || existingUsername) {
        return res.json({ status: false, message: "User already exists" });
    }
    console.log(username + "after")
    const hashpassword = await bcrypt.hash(password, 10);
    if(!username){
        return res.status(400).json({ status: false, message: "Username is required" });
    }

    const newUser = new usermodel({
        personalInfo: { 
            username,
            password: hashpassword,
            email: isEmail ? emailOrMobile : undefined,
            mobile: isEmail ? undefined : emailOrMobile,
            name,
            gender
        }
    });

    try {
        await newUser.save();
        return res.json({ status: true, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ status: false, message: "Username, email, or mobile already exists." });
        }
        return res.status(500).json({ status: false, message: "Error registering user" });
    }
});


// Add or update personal information (name, gender)
router.post('/:userId/personalInfo', async (req, res) => {
    const { username, password, email, mobile, name, gender } = req.body;
    const user = await usermodel.findById(req.params.userId);

    if (!user) {
        return res.status(404).json({ status: false, message: 'User not found' });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    // Update fields only if they are provided
    if (username) user.personalInfo.username = username;
    if (password) user.personalInfo.password = hashpassword;
    if (email) user.personalInfo.email = email;
    if (mobile) user.personalInfo.mobile = mobile;
    if (name) user.personalInfo.name = name;
    if (gender) user.personalInfo.gender = gender;

    await user.save();

    res.json({ status: true, message: 'Personal information updated', user });
});


router.post('/address', async (req, res) => {
   console.log("add")
    const {name,
        mobile,
        locality,
        address,
        city,
        state,
        landmark,
        adressType,
        alternateMobile,
        pincode} = req.body;

    try{
        const token = req.cookies.token;
        console.log(token)
        if (!token) {
            return res.status(401).json({ message: 'Token missing or invalid' });
        }
        const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;
        console.log(id)

        const user = await usermodel.findById(id);
        console.log(user    )
    
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        user.addresses.push({
            'name':name,
            'mobile':mobile,
            'locality':locality,
            'address':address,
            'city':city,
            'state':state,
            'landmark':landmark,
            'adressType':adressType,
            'alternateMobile':alternateMobile,
            'pincode':pincode
        });
        await user.save();
    
        res.json({ status: true, message: 'Address added', user });
    }
    catch(err){
        res.json(err);
    }
        
   
});

// Add an order to the user's order history
router.post('/:userId/order', async (req, res) => {
    const { product, price, status } = req.body;
    const user = await usermodel.findById(req.params.userId);

    if (!user) {
        return res.status(404).json({ status: false, message: 'User not found' });
    }

    user.orderHistory.push({ product, price, status });
    await user.save();

    res.json({ status: true, message: 'Order added', user });
});
router.post('/cart', upload.none(), async (req, res) => {
    const token = req.cookies.token;
    const { productDetails, count, selectedSize } = req.body;
    const parsedCount = count ? Number(count) : 1;     

    if (!token) {
        return res.status(401).json({ message: 'Token missing or invalid' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;
        const user = await usermodel.findById(id);

        if (!user) {
            return res.status(401).json({ status: false, message: "User not found. Please log in again." });
        }

        user.cartProducts.map(product => console.log(product.product));

        const existingProduct = user.cartProducts.find(product => product.product === productDetails && product.selectedSize === selectedSize);
        if (existingProduct) {
            if(isNaN(parsedCount)||parsedCount<=0){
                return ( res.json({status:false,message:"error updating count"}))
            }
            console.log(count)
            console.log(parsedCount)
            existingProduct.count = parsedCount; 
        } else {
            user.cartProducts.push({
                id: uuidv4(),
                product: productDetails,
                count: parsedCount,
                selectedSize: selectedSize
            });
            console.log("Added new product to cart");
        }

        await user.save();
        return res.json({ status: true, message: "Cart product updated successfully" });
    } catch (err) {
        console.error('Error verifying token:', err.message);
        res.status(401).json({ message: 'Token verification failed' });
    }
});

router.get('/getCart',async(req,res)=>{
    try{
        const token = req.cookies.token;
        const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;
        const user = await usermodel.findById(id);
        const cart = user.cartProducts;
        return res.json({status:true,message:"cart successfully fetched",cart})
        
    }
    catch(err){
        return res.json({status:true,message:err.message})
    }
    
})
router.put('/deleteCartProduct/:productId', async(req,res)=>{
    const {productId} = req.params;
    try{
        const token = req.cookies.token;
        const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;
        const user = await usermodel.findById(id);
        const cart = user.cartProducts;
        const updatedCart = cart.filter((product)=>product._id!=productId);
        user.cartProducts = updatedCart;
        await user.save();
        

}
catch(err){
    console.log(err);
}

})
router.post('/whishlist', async (req, res) => {
    const {productId} = req.body;  // Product from request body
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ status: false, message: "Please Log In" });
    }
    console.log(token)

    try {
        const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;
        const user = await usermodel.findById(id);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found Please Log In" });
        }
        const existingProduct = user.whishlist.find((wishlistItem) => wishlistItem.productId === productId);
        if (existingProduct) {
            return res.status(400).json({ status: false, message: "Product already exists in wishlist" });
        }
        user.whishlist.push({ productId });
        await user.save();

        return res.status(200).json({ status: true, message: "Product added to wishlist successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: "An error occurred", error: err.message });
    }
});

router.get('/getWhishlist',async(req,res)=>{
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: false, message: "Token is not valid" });
        }
        const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;
        const user = await usermodel.findById(id);
        const cart = user.whishlist;
        return res.json({status:true,message:"Whishlist successfully fetched",cart})
        
    }
    catch(err){
        return res.json({status:true,message:err.message})
    }
    
})
router.put('/deletewhishlist/:productId', async(req,res)=>{
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: false, message: "Token is not valid" });
        }
        const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;
        const user = await usermodel.findById(id);
        if(!user){
            return res.json({status:false,message:"user not found"});
        }
        const whishlist = user.whishlist;
        
        const updatedwhishlist = whishlist.filter((product)=>product.productId!=productId);
        user.whishlist = updatedwhishlist;
        await user.save();      

}
catch(err){
    console.log(err);
}

})



module.exports = router;
