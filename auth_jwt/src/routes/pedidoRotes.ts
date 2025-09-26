import { Router } from "express";
import {
  createPedido,
  listPedidos,
  listPedidoById,
  updatePedido,
  deletePedido,
} from "../controllers/pedidoController.ts";

const pedidoRouter = Router();

pedidoRouter.post("/pedidos", createPedido);
pedidoRouter.get("/pedidos", listPedidos);
pedidoRouter.get("/pedidos/:id", listPedidoById);
pedidoRouter.put("/pedidos/:id", updatePedido);
pedidoRouter.delete("/pedidos/:id", deletePedido);

export default pedidoRouter;
