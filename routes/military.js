const express = require('express');
const router = express.Router();
const militaryController = require('../controllers/militaryController');
const auth = require('../middleware/auth');

router.post('/create', auth, militaryController.createMilitary);
router.get('/list', auth, militaryController.getMilitaries);
router.put('/update/:id', auth, militaryController.updateMilitary);
router.delete('/delete/:id', auth, militaryController.deleteMilitary);

module.exports = router;