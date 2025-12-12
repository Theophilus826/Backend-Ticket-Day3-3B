// routes/UserRoutes.js
const express = require('express');
const router = express.Router();

const { registerUser, loginUser, welcome } = require('../controller/UserController.js');

const { protect } = require('../middleware/AuthMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/welcome', protect, welcome);
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

module.exports = router;
