import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// conecao com o banco de dados
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

app.use(bodyParser.json());
app.use(express.static('public'));

// API Routes
app.post('/api/generate-code', async (req, res) => {
  // mock: gerar codigo de usuario e verificador
  const userCode = '12345'; // eh necessario fazer o cadastro no ifood para obter o user code
  const verifier = 'abcde'; // eh necessario fazer o cadastro no ifood para obter o verifier
  const authURL = 'https://ifood-auth-url.com';
  
  await db.execute('INSERT INTO auth_data (user_code, verifier, auth_url) VALUES (?, ?, ?)', [userCode, verifier, authURL]);

  res.json({ userCode, verifier, authURL });
});

app.post('/api/authorize-store', async (req, res) => {
  const { userCode } = req.body;
  const [rows] = await db.execute('SELECT * FROM auth_data WHERE user_code = ?', [userCode]);

  if (rows.length) {
    res.json({ message: 'Store authorized. Proceed to the next step.' });
  } else {
    res.status(404).json({ error: 'User code not found.' });
  }
});

app.post('/api/save-authorization-code', async (req, res) => {
  const { userCode, authCode } = req.body;
  await db.execute('UPDATE auth_data SET auth_code = ? WHERE user_code = ?', [authCode, userCode]);

  res.json({ message: 'Authorization code saved successfully.' });
});

app.post('/api/generate-access-token', async (req, res) => {
  const { userCode } = req.body;
  const [rows] = await db.execute('SELECT * FROM auth_data WHERE user_code = ?', [userCode]);

  if (rows.length) {
    const accessToken = 'access_token_mock'; 
    await db.execute('UPDATE auth_data SET access_token = ? WHERE user_code = ?', [accessToken, userCode]);

    res.json({ accessToken });
  } else {
    res.status(404).json({ error: 'User code not found.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
