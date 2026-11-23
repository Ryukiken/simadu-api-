const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes.cjs');
const pengaduanRoutes = require('./pengaduan.routes.cjs');

router.use('/auth', authRoutes);
router.use('/pengaduan', pengaduanRoutes);

module.exports = router;
