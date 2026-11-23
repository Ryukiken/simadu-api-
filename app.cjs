const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const apiRoutes = require('./src/routes/index.cjs');
const errorHandler = require('./src/middleware/error.middleware.cjs');

const app = express();

// Middleware bawaan & keamanan
app.use(cors());
app.use(express.json());

// Load file spesifikasi OpenAPI
const openApiSpec = require('./docs/openapi.json');

// Swagger UI Dokumentasi
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'SIMADU API Documentation - UTS WSE'
}));

// Route Utama API
app.use('/api', apiRoutes);

// Root route redirect/info
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'SIMADU REST API',
    description: 'Sistem Layanan Informasi dan Pengaduan Mahasiswa',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth/login',
      pengaduan: '/api/pengaduan'
    }
  });
});

// 404 Handler untuk route yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.`
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
