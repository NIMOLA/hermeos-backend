import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../middleware/errorHandler';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: fieldname-timestamp-random.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|pdf/i;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images (jpeg, jpg, png) and PDFs are allowed!'));
    }
};

// Multer Instance
export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

// Upload Handler
export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return next(new AppError('No file uploaded', 400));
        }

        // Return relative path to be constructed by frontend
        // This avoids issues with internal IP/port mismatches behind proxies
        const url = `/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            data: {
                url,
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
    } catch (error) {
        next(error);
    }
};
