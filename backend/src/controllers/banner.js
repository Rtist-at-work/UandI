const express = require('express');
const router = express.Router();
const bannerSchema = require('../models/banner');
const ageBanner = require('../models/ageBanner');
const posterSchema = require('../models/poster');
const path = require('path');
const upload = require('../../uploadProduct')
const multer = require('multer');

// const storage = multer.memoryStorage();


// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, callback) => {
//         const fileType = /jpeg|jpg|png|webp/;
        
//         const mimeType = fileType.test(file.mimetype);
//         const extname = fileType.test(path.extname(file.originalname).toLowerCase());
        
//         if (mimeType && extname) {
//             return callback(null, true);
//         } else {
//             callback(new Error('Give proper file format to upload'));
//         }
//     }
// });
router.post('/age', (req, res) => {
    upload.array('images', 10)(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: err.message // Error message for file format issues
            });
        }

        const { age } = req.body; // Retrieve ages from request body
        const images = req.files.map(file => file.buffer.toString('base64')); // Convert images to Base64
        console.log(age)

        // Validate that the number of images matches the number of ages
        if (images.length !== age.length) {
            return res.status(400).json({
                status: false,
                message: "The number of images and ages must match."
            });
        }

        try {
            // Create and save each banner in parallel
            const results = await Promise.all(
                images.map((image, index) => 
                    new ageBanner({ images: image, age: age[index] }).save()
                )
            );

            res.json({
                results,
                status: true,
                message: "Banners Added Successfully"
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                message: err.message
            });
        }
    });
});


router.post('/mainBanner', upload.array('images', 10), async (req, res) => {
    try {
        const images = req.files.map((file)=>{
            const imgBuffer = file.buffer;
            return imgBuffer.toString('base64')
        })
        
        const banner = new bannerSchema({
                images: images,
        });

        const result = await banner.save();
        res.json({
            result,
            status: true,
            message: "Banner Added Successfully"
        });
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
});
router.post('/poster', upload.array('images', 10), async (req, res) => {
    try {
        // Map through the uploaded files and convert each one to base64
        const images = req.body.images;
        console.log(images);
        if(!images){
            res.json({status:false,message:"image is not uploaded please try again later"})
        }

        // Create an array to hold promises for saving each image
        const promises = images.map(async (image) => {
            const banner = new posterSchema({
                images: image, // Store each image as a separate entry
            });
            return banner.save(); // Save each banner and return the promise
        });

        // Wait for all promises to resolve
        const results = await Promise.all(promises);

        // Return a success response with the results
        res.json({
            results,
            status: true,
            message: "Banners Added Successfully"
        });
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
});

router.get('/fetchage', async(req,res)=>{
    try{
    const banner = await ageBanner.find();
        return res.json({status:true,message:"success",banner})
    }   
    catch(err){
        res.json({status:false,message:err.message});
    } 
})

router.get('/getposter',async(req,res)=>{
    try{
        const banner = await posterSchema.find();
        return res.json({status:true,message:"success",banner})
    }
    catch(err){
        res.json({status:false,message:err.message});
    } 
})

router.put('/edit/:editId',async (req, res) => {
    const { editId } = req.params;
    const image = req.body.image
   
    try {
      if (!image) {
        return res.status(400).send({ message: 'No file uploaded' });
      }
  
      // Find the poster by its object id and update the image
      const updatedPoster = await posterSchema.findByIdAndUpdate(
        editId,
        { images: image },
        { new: true }
      );
  
      if (!updatedPoster) {
        return res.status(404).send({ message: 'Poster not found' });
      }
  
      res.status(200).send({ message: 'Banner updated successfully', banner: updatedPoster });
    } catch (error) {
      console.error('Error updating banner:', error);
      res.status(500).send({ message: 'Error updating banner' });
    }
  });
  router.delete('/delete/:posterId', async (req, res) => {
    const { posterId } = req.params;
    try {
        const result = await posterSchema.deleteOne({ _id: posterId });
        if (result.deletedCount > 0) {
            res.json({ status: true, message: "Poster deleted successfully" });
        } else {
            res.json({ status: false, message: "Poster not found, deletion failed" });
        }
    } catch (err) {
        res.json({ status: false, message: err.message });
    }
});

module.exports = router;
