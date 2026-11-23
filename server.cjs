require('dotenv').config();
const app = require('./app.cjs');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` SIMADU REST API - Web Service Engineering UTS 20261`);
  console.log(` Server berjalan di   : http://localhost:${PORT}`);
  console.log(` Dokumentasi Swagger : http://localhost:${PORT}/api-docs`);
  console.log(`=======================================================`);
});
