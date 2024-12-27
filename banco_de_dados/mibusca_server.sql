CREATE DATABASE IF NOT EXISTS MIBUSCA;

USE MIBUSCA;

-- Tabela de token_validation
CREATE TABLE `TokenValidation` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `client_id` VARCHAR(191) NOT NULL,
    `client_secret` VARCHAR(191) NOT NULL,
    `access_token` TEXT NOT NULL, -- Alterado de VARCHAR(max) para TEXT, pois MySQL não suporta VARCHAR(max)
    `token_expiration` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabela Lojas
CREATE TABLE `Lojas` (
    `id_loja` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `status` INT NOT NULL, -- Alterado para INT, pois é mais apropriado para valores inteiros
    `horario_operacao` DATETIME(3) NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `localizacao` LONGBLOB NULL,
    PRIMARY KEY (`id_loja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabela Vendas
CREATE TABLE `Vendas` (
    `id_venda` VARCHAR(191) NOT NULL,
    `id_cliente` VARCHAR(191) NOT NULL,
    `id_loja` VARCHAR(191) NOT NULL,
    `distancia_raio` DOUBLE NOT NULL,
    `data_hora` DATETIME NOT NULL,  -- Mantido como DATETIME
    `cancelada` INT NOT NULL,
    `tipo_cliente` INT NOT NULL,
    `taxa_entrega` DOUBLE NOT NULL,
    `total_pedido` DOUBLE NOT NULL,
    PRIMARY KEY (`id_venda`),
    CONSTRAINT `Vendas_id_loja_fkey` FOREIGN KEY (`id_loja`) REFERENCES `Lojas` (`id_loja`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
