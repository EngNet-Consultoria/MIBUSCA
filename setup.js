import fs from 'fs';
import { Client } from 'pg';

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const sql = fs.readFileSync('mibusca_server.sql', 'utf8'); 

async function setupDatabase() {
    try {
        await client.connect();
        console.log('Conectado ao banco de dados.');

        await client.query(sql);
        console.log('Tabelas criadas com sucesso!');
    } catch (err) {
        console.error('Erro ao configurar o banco de dados:', err.stack);
    } finally {
        await client.end();
    }
}

setupDatabase();
