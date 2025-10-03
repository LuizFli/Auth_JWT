import express from 'express';
import authRouter from  './routes/authRoutes.ts'
import { auth } from './middleware/auth.ts';
import userRouter from './routes/userRoutes.ts';
import produtoRouter from './routes/produtoRoutes.ts';
import pedidoRouter from './routes/pedidoRotes.ts';
import publicPedidosRouter from './routes/publicPedidosRouter.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.send('API RODANDO');
});

app.use(authRouter);

// Rota especial para a API do professor - sem autenticação
app.use(publicPedidosRouter);

app.use(auth);
// privados

app.use(userRouter);
app.use(produtoRouter);
app.use(pedidoRouter);

app.listen(PORT, () => {
    console.log(`Server port ${PORT}`);
});