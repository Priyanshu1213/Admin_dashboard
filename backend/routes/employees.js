const express = require('express');
const {getEmployees, createEmployee, getEmployeeById, updateEmployee, deleteEmployee,} = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage});

// Custom middleware to check file type
const allowedTypes = ['image/jpeg', 'image/png'];

const checkFileType = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ message: 'Only jpg and png files are allowed' });
  }

  next(); 
};

router.get('/', authMiddleware, getEmployees);
router.post('/', authMiddleware,upload.single('image'), checkFileType ,createEmployee);
router.get('/:id', authMiddleware, getEmployeeById);
router.put('/:id', authMiddleware, upload.single('image'), updateEmployee);
router.delete('/:id', authMiddleware, deleteEmployee);

module.exports = router;
