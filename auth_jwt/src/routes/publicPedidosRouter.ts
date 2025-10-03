import { updatePedidoStatus } from '../controllers/pedidoController.ts';
import { Router } from "express";

const pedidoRouter = Router();

pedidoRouter.patch("/pedidos/:id", updatePedidoStatus);


export default pedidoRouter;
