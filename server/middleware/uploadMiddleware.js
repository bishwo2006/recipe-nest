import multer from 'multer';
import path from 'path';

// Storage engine
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|webp|svg|jfif|avif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        console.error(`Rejected File: Ext: ${path.extname(file.originalname)}, Mime: ${file.mimetype}`);
        cb('Images only! Allowed: JPEG, JPG, PNG, WEBP, SVG, JFIF, AVIF');
    }
}

// Upload middleware
const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5 MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

export default upload;
