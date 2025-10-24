import type { Request, Response } from "express";
import { prismaClient } from "../../prisma/prisma.ts";
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { PrismaClient } from '@prisma/client';
import { verifyAccess } from "../utils/jwt.ts";
import { simuladorService } from "../services/simuladorSevices.ts";

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
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    // Buscar apenas os pedidos do usuário autenticado
    const pedidos = await prismaClient.pedidos.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pedidosProdutos: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                descricao: true,
                preco: true,
                status: true,
                estoque: true,
              },
            },
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
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID do pedido deve ser um número válido" });
    }

    const pedido = await prismaClient.pedidos.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pedidosProdutos: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                descricao: true,
                preco: true,
                status: true,
                estoque: true,
              },
            },
          },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    // Verificar se o pedido pertence ao usuário autenticado
    if (pedido.userId !== userId) {
      return res.status(403).json({
        error: "Acesso negado: você só pode visualizar seus próprios pedidos"
      });
    }

    return res.json(pedido);
  } catch (error) {
    console.error("Erro ao listar pedido por ID:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const createPedido = async (req: Request, res: Response) => {
  const { body } = req;
  const { produtos, ...dados } = body;
  try {
    // TO-DO -> ARMAZENAR DADOS DO USUARIO EM FORMATO DE CACHE OU ALGO PARECIDO
    const token = req?.headers?.authorization?.slice("Bearer ".length);
    const payload = verifyAccess(token || "");
    // buscar produtos do pedido no banco
    const produtosDb = await prismaClient.produto.findMany({
      where: { id: { in: produtos } },
    });
    const pedido = await prismaClient.pedidos.create({
      data: {
        ...dados,
        userId: payload.userId,
        produto: {
          create: produtosDb.map((produto) => {
            return {
              nome: produto.nome,
              preco: produto.preco,
              descricao: produto.descricao,
              status: produto.status,
              estoque: produto.estoque,
              userId: produto.userId,
            };
          }),
        },
      },
      include: {
        pedidosProdutos: {
          include: {
            produto: true
          },
        },
      },
    });

    const resultado = await simuladorService.enviarPedidoParaFila(pedido);
    if (!resultado) {
      res.status(400).send("Erro ao enviar para o simulador/bancada");
    }
    console.log("Enviado para simulador/bancada com sucesso!");
    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).send(`Erro no servidor: ${error}`);
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

// Método especial para a API do professor atualizar status para concluído
export const updatePedidoStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { query } = req;
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID do pedido deve ser um número válido" });
    }

    // Verificar se o pedido existe
    const existingPedido = await prismaClient.pedidos.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    // Atualizar status para concluído
    const pedidoConcluido = await prismaClient.pedidos.update({
      where: { id: Number(id) },
      data: {
        status: String(query.status) || "pendente",
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pedidosProdutos: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                descricao: true,
                preco: true,
                status: true,
                estoque: true,
              },
            },
          },
        },
      },
    });

    return res.json({
      message: "Pedido marcado como concluído com sucesso",
      data: pedidoConcluido,
    });
  } catch (error) {
    console.error("Erro ao concluir pedido:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

