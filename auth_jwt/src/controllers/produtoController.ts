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

export const createProduto = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nome, descricao, preco, estoque, status } = req.body;
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    if (!nome || !preco || estoque === undefined) {
      return res.status(400).json({ error: "Nome, preço e estoque são obrigatórios" });
    }

    const produto = await prismaClient.produto.create({
      data: {
        nome,
        descricao: descricao || null,
        preco: Number(preco),
        estoque: Number(estoque),
        status: status || "Disponivel",
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
      message: "Produto criado com sucesso",
      data: produto,
    });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const listProdutos = async (_: Request, res: Response): Promise<Response> => {
  try {
    const produtos = await prismaClient.produto.findMany({
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

    return res.json(produtos);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const listProdutoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID do produto deve ser um número válido" });
    }

    const produto = await prismaClient.produto.findUnique({
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

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateProduto = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, status } = req.body;
    const userId = getUserIdFromToken(req);

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID do produto deve ser um número válido" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    const existingProduto = await prismaClient.produto.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProduto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    if (existingProduto.userId !== userId) {
      return res.status(403).json({ 
        error: "Acesso negado: você só pode alterar produtos que você criou" 
      });
    }

    const updateData: any = {};
    if (nome !== undefined) updateData.nome = nome;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (preco !== undefined) updateData.preco = Number(preco);
    if (estoque !== undefined) updateData.estoque = Number(estoque);
    if (status !== undefined) updateData.status = status;

    const produto = await prismaClient.produto.update({
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
      message: "Produto atualizado com sucesso",
      data: produto,
    });
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    console.error("Erro ao atualizar produto:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const deleteProduto = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const userId = getUserIdFromToken(req);

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID do produto deve ser um número válido" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    const existingProduto = await prismaClient.produto.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProduto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    if (existingProduto.userId !== userId) {
      return res.status(403).json({ 
        error: "Acesso negado: você só pode remover produtos que você criou" 
      });
    }

    await prismaClient.produto.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    console.error("Erro ao deletar produto:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};