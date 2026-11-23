const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.cjs');
const { validateLogin } = require('../middleware/validator.middleware.cjs');

router.post('/login', validateLogin, (req, res, next) => authController.login(req, res, next));

module.exports = router;
