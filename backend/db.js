const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // PostgreSQL kullanıcı adın
  host: 'localhost', // Eğer sunucu uzaksa buraya IP veya domain yaz
  database: 'workspire', // Kullanacağımız database
  password: '1234', // PostgreSQL şifren
  port: 5432, // PostgreSQL default portu
});

module.exports = pool;
