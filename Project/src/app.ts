import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany(); 
    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Server port ${PORT}`);
});