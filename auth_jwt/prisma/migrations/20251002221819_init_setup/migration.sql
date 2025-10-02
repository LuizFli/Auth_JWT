-- CreateTable
CREATE TABLE `pedidosProdutos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 1,
    `precoUnitario` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `pedidosProdutos_pedidoId_produtoId_key`(`pedidoId`, `produtoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pedidosProdutos` ADD CONSTRAINT `pedidosProdutos_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidosProdutos` ADD CONSTRAINT `pedidosProdutos_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
