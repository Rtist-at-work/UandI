const multer = require('multer');
const path = require('path');

var imgconfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, './Assets/productImages'));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: imgconfig,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, callback) => {
        const fileType = /jpeg|jpg|png|webp/;
        const mimeType = fileType.test(file.mimetype);
        const extname = fileType.test(path.extname(file.originalname).toLowerCase());
        if (mimeType && extname){
            return callback(null, true);
        }
        callback('Give proper file format to upload');
    }
});

module.exports = upload;
