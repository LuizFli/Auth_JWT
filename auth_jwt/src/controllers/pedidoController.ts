import type { Request, Response } from "express";
import { prismaClient } from "../../prisma/prisma.ts";
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { verifyAccess } from "../utils/jwt.ts";

// Função para extrair o ID do usuário do token
const getUserIdFromToken = (req: Request): number | null => {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer ")) return null;
  
  try {
    const token = hdr.slice("Bearer ".length);
    const payload = verifyAccess(token);
    return payload?.userId || null;
  } catch {
    return null;
  }
};

export const listPedidos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const pedidos = await prismaClient.pedidos.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.json(pedidos);
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const listPedidoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID do pedido deve ser um número válido" });
    }

    const pedido = await prismaClient.pedidos.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    return res.json(pedido);
  } catch (error) {
    console.error("Erro ao listar pedido por ID:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const createPedido = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { valor, status } = req.body;
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    if (!valor || !status) {
      return res.status(400).json({ error: "Valor e status são obrigatórios" });
    }

    const novoPedido = await prismaClient.pedidos.create({
      data: {
        valor: Number(valor),
        status,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Pedido criado com sucesso",
      data: novoPedido,
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updatePedido = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { valor, status } = req.body;
    const userId = getUserIdFromToken(req);

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID do pedido deve ser um número válido" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    // Verificar se o pedido existe
    const existingPedido = await prismaClient.pedidos.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    // Verificar se o usuário é o dono do pedido
    if (existingPedido.userId !== userId) {
      return res.status(403).json({ 
        error: "Acesso negado: você só pode alterar pedidos que você criou" 
      });
    }

    const updateData: any = {};
    if (valor !== undefined) updateData.valor = Number(valor);
    if (status !== undefined) updateData.status = status;

    const pedidoAtualizado = await prismaClient.pedidos.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json({
      message: "Pedido atualizado com sucesso",
      data: pedidoAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const deletePedido = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const userId = getUserIdFromToken(req);

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID do pedido deve ser um número válido" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    // Verificar se o pedido existe
    const existingPedido = await prismaClient.pedidos.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    // Verificar se o usuário é o dono do pedido
    if (existingPedido.userId !== userId) {
      return res.status(403).json({ 
        error: "Acesso negado: você só pode remover pedidos que você criou" 
      });
    }

    await prismaClient.pedidos.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "Pedido removido com sucesso" });
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code === "P2025") {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }
    console.error("Erro ao deletar pedido:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

