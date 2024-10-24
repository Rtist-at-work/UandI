const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

// Set up the multer upload with file filter to accept only specific file types
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        // Define allowed file types
        const fileType = /jpeg|jpg|png|webp/;
        const mimeType = fileType.test(file.mimetype);
        const extname = fileType.test(path.extname(file.originalname).toLowerCase());

        // Check file types, reject if not proper format
        if (mimeType && extname) {
            callback(null, true);
        } else {
            callback(new Error('Give proper file format to upload'));
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

//lfenjlfndojv

module.exports = upload;
