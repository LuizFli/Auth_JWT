import { Router } from "express";
import {
  createPedido,
  listPedidos,
  listPedidoById,
  updatePedido,
  deletePedido,
  concludePedido,
} from "../controllers/pedidoController.ts";
import { auth } from "../middleware/auth.ts";

const pedidoRouter = Router();

// Rotas protegidas - requerem autenticação
pedidoRouter.post("/pedidos", auth, createPedido);
pedidoRouter.get("/pedidos", auth, listPedidos);
pedidoRouter.get("/pedidos/:id", auth, listPedidoById);
pedidoRouter.put("/pedidos/:id", auth, updatePedido);
pedidoRouter.delete("/pedidos/:id", auth, deletePedido);

// Rota especial para a API do professor - sem autenticação para facilitar integração
pedidoRouter.patch("/pedidos/:id/concluir", concludePedido);

export default pedidoRouter;
