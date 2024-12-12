import cors from '@fastify/cors';
import fastify from 'fastify';
import dotenv from 'dotenv';
import { setupDatabase } from './database';
import { routes } from './routes';

dotenv.config();

const app = fastify({ logger: true });

app.register(cors);
app.register(routes);

const start = async () => {
    try {
        await setupDatabase();
        await app.listen({ port: Number(process.env.PORT) || 3000 });
        console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();