const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');  // Middleware to check admin role

router.get('/users', auth, adminAuth, adminController.getUsers);
router.post('/ban/:id', auth, adminAuth, adminController.banUser);
router.post('/unban/:id', auth, adminAuth, adminController.unbanUser);

module.exports = router;
