-- Estrutura da tabela de relação pedidosProdutos
-- Esta tabela foi criada automaticamente pelo Prisma a partir do schema

CREATE TABLE `pedidosProdutos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedidoId` int NOT NULL,
  `produtoId` int NOT NULL,
  `quantidade` int NOT NULL DEFAULT '1',
  `precoUnitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pedidosProdutos_pedidoId_produtoId_key` (`pedidoId`,`produtoId`),
  KEY `pedidosProdutos_produtoId_fkey` (`produtoId`),
  CONSTRAINT `pedidosProdutos_pedidoId_fkey` 
    FOREIGN KEY (`pedidoId`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pedidosProdutos_produtoId_fkey` 
    FOREIGN KEY (`produtoId`) REFERENCES `produto` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Exemplo de dados na tabela de relação
-- Pedido 1 com 2 produtos diferentes
INSERT INTO `pedidosProdutos` (`pedidoId`, `produtoId`, `quantidade`, `precoUnitario`) VALUES
(1, 1, 1, 2500.00),  -- 1 Notebook Dell por R$ 2500,00
(1, 2, 2, 50.00);    -- 2 Mouse Wireless por R$ 50,00 cada

-- Consulta para ver pedidos com produtos
SELECT 
    p.id as pedido_id,
    p.valor as pedido_valor,
    p.status as pedido_status,
    u.name as usuario_nome,
    pr.nome as produto_nome,
    pp.quantidade,
    pp.precoUnitario,
    (pp.quantidade * pp.precoUnitario) as subtotal
FROM pedidos p
JOIN user u ON p.userId = u.id
JOIN pedidosProdutos pp ON p.id = pp.pedidoId
JOIN produto pr ON pp.produtoId = pr.id
WHERE p.userId = 1  -- Filtrar apenas pedidos do usuário 1
ORDER BY p.id, pr.nome;