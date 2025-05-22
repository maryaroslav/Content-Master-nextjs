const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads/user_posts');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueName + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        console.log('[UPLOAD DEBUG] mimetype:', file.mimetype);
        console.log('[UPLOAD DEBUG] originalname:', file.originalname);

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const allowedExt = ['.jpg', '.jpeg', '.png', '.gif'];
        const mimetypeOk = allowedTypes.includes(file.mimetype);
        const extOk = allowedExt.includes(path.extname(file.originalname).toLowerCase());

        if (mimetypeOk || extOk) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
    }
});

module.exports = upload;