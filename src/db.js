require('dotenv').config(); // Mengimpor konfigurasi dari .env

const pgp = require('pg-promise')();

const db = pgp({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
});

module.exports = db;
