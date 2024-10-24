const express = require('express');
const router = express.Router();

//lndajnj
router.get('/',async(req,res)=>{
res.clearCookie('token');
return res.json({status:true})
})

module.exports = router ;