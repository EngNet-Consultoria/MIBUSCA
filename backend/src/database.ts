import { createConnection, ConnectionOptions } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const dbConfig: ConnectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};

export const db = await createConnection(dbConfig);

export async function setupDatabase() {
    const sql = fs.readFileSync(path.join(__dirname, 'mibusca_server.sql'), 'utf8');
    await db.query(sql);
}