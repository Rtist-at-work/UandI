const express = require('express');
const cors = require('cors');
const connect = require('./db');
const productController = require('./src/controllers/productController');
const editproduct = require('./src/controllers/editproduct');
const productList = require('./src/controllers/productList');
const getCategory = require('./src/controllers/getCategory');
const category = require('./src/controllers/category');
const user = require('./src/controllers/user');
const login = require('./src/controllers/login');
const forgotpassword = require('./src/controllers/forgotpassword');
const resetpassword = require('./src/controllers/resetpassword');
const verifyauth = require('./src/controllers/verifyauth');
const logout = require('./src/controllers/logout');
const profile = require('./src/controllers/profile');
const addresspage = require ('./src/controllers/addresspage')
const updateUserDetails = require('./src/controllers/updateUserDetails')
const deleteUserDetails = require('./src/controllers/deleteUserDetails')
const adminorderlist = require('./src/controllers/adminorderlist')
const banner = require('./src/controllers/banner')
const orderpage = require("./src/controllers/orderpage");
const orders = require('./src/controllers/orders')
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

// Database connection
connect();
// Routes
app.use('/addproducts', productController);
app.use('/editproducts', editproduct);
app.use('/productList', productList);
app.use('/category', getCategory);
app.use('/createcategory', category);
app.use('/auth', user);
app.use('/auth/login', login);
app.use('/auth/forgotpassword', forgotpassword);
app.use('/auth/resetpassword', resetpassword);
app.use('/auth/verify', verifyauth);
app.use('/auth/logout', logout);
app.use('/profile', profile);  
app.use('/getAddress', addresspage);  
app.use('/update/address', updateUserDetails);  
app.use('/delete/address', deleteUserDetails);  
app.use('/orderpage', orderpage);  
app.use('/admin/orders', adminorderlist);  
app.use('/placeOrder', orders);  
app.use('/banners', banner);  
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
