-- CreateTable
CREATE TABLE `TokenValidation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` VARCHAR(191) NOT NULL,
    `client_secret` VARCHAR(191) NOT NULL,
    `access_token` VARCHAR(191) NOT NULL,
    `token_expiration` DATETIME(3) NOT NULL,
    `refresh_token` VARCHAR(191) NOT NULL,
    `user_code` VARCHAR(191) NULL,
    `authorization_code` VARCHAR(191) NULL,
    `auth_verification_code` VARCHAR(191) NULL,
    `verification_url` VARCHAR(191) NULL,
    `verification_url_full` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lojas` (
    `id_loja` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL,
    `horario_operacao` DATETIME(3) NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `localizacao` LONGBLOB NULL,

    PRIMARY KEY (`id_loja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vendas` (
    `id_venda` VARCHAR(191) NOT NULL,
    `id_loja` VARCHAR(191) NOT NULL,
    `data_hora` DATETIME(3) NOT NULL,
    `valor_total` DOUBLE NOT NULL,
    `ticket_medio` DOUBLE NULL,
    `tipo_cliente` INTEGER NOT NULL,
    `cancelada` BOOLEAN NOT NULL DEFAULT false,
    `promocao_aplicada` BOOLEAN NOT NULL DEFAULT false,
    `roi` DOUBLE NULL,

    PRIMARY KEY (`id_venda`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Operacao` (
    `id_operacao` VARCHAR(191) NOT NULL,
    `id_loja` VARCHAR(191) NOT NULL,
    `data_hora_inicio` DATETIME(3) NOT NULL,
    `data_hora_fim` DATETIME(3) NULL,
    `tempo_total` INTEGER NULL,
    `cancelamentos` INTEGER NOT NULL DEFAULT 0,
    `erros_plataforma` INTEGER NOT NULL,

    PRIMARY KEY (`id_operacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clientes` (
    `id_cliente` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NULL,
    `id_loja` VARCHAR(191) NOT NULL,
    `distancia_raio` DOUBLE NOT NULL,
    `tipo` INTEGER NOT NULL,
    `data_ultima_compra` DATETIME(3) NULL,

    PRIMARY KEY (`id_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vendas` ADD CONSTRAINT `Vendas_id_loja_fkey` FOREIGN KEY (`id_loja`) REFERENCES `Lojas`(`id_loja`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Operacao` ADD CONSTRAINT `Operacao_id_loja_fkey` FOREIGN KEY (`id_loja`) REFERENCES `Lojas`(`id_loja`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD CONSTRAINT `Clientes_id_loja_fkey` FOREIGN KEY (`id_loja`) REFERENCES `Lojas`(`id_loja`) ON DELETE RESTRICT ON UPDATE CASCADE;
