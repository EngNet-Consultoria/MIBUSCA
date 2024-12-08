const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => console.log('Conexão com o banco de dados estabelecida.'))
  .catch(err => console.error('Erro ao conectar no banco:', err));

module.exports = client;
