import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from './database';

interface AuthDataRow {
    user_code: string;
    verifier: string;
    auth_url: string;
    auth_code?: string;
    access_token?: string;
}
//tentando fazer a conexão da api e integração com o database
export async function routes(app: FastifyInstance) {
    app.post('/api/generate-code', async (req: FastifyRequest, res: FastifyReply) => {
    
        const userCode = '12345'; //provisorio, para a criação da api
        const verifier = 'abcde'; //provisorio, para a criação da api
        const authURL = 'https://ifood-auth-url.com';

        await db.execute('INSERT INTO auth_data (user_code, verifier, auth_url) VALUES (?, ?, ?)', [userCode, verifier, authURL]);

        res.send({ userCode, verifier, authURL });
    });

    app.post('/api/authorize-store', async (req: FastifyRequest, res: FastifyReply) => {
        const { userCode } = req.body as { userCode: string };
        const [rows] = await db.execute<[AuthDataRow[]]>('SELECT * FROM auth_data WHERE user_code = ?', [userCode]);

        if (rows.length > 0) {
            res.send({ message: 'Store authorized. Proceed to the next step.' });
        } else {
            res.status(404).send({ error: 'User code not found.' });
        }
    });

    app.post('/api/save-authorization-code', async (req: FastifyRequest, res: FastifyReply) => {
        const { userCode, authCode } = req.body as { userCode: string, authCode: string };
        await db.execute('UPDATE auth_data SET auth_code = ? WHERE user_code = ?', [authCode, userCode]);

        res.send({ message: 'Authorization code saved successfully.' });
    });

    app.post('/api/generate-access-token', async (req: FastifyRequest, res: FastifyReply) => {
        const { userCode } = req.body as { userCode: string };
        const [rows] = await db.execute<[AuthDataRow[]]>('SELECT * FROM auth_data WHERE user_code = ?', [userCode]);

        if (rows.length > 0) {
            const accessToken = 'access_token_mock';
            await db.execute('UPDATE auth_data SET access_token = ? WHERE user_code = ?', [accessToken, userCode]);

            res.send({ accessToken });
        } else {
            res.status(404).send({ error: 'User code not found.' });
        }
    });
}
