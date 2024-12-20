CREATE DATABASE IF NOT EXISTS MIBUSCA;

USE MIBUSCA;

-- Tabela de token_validation
CREATE TABLE `token_validation` (
    `id` int NOT NULL AUTO_INCREMENT,
    `client_id` varchar(255) NOT NULL,
    `client_secret` varchar(255) NOT NULL,
    `access_token` text NOT NULL,
    `token_expiration` timestamp NOT NULL,
    `refresh_token` text NOT NULL,
    `user_code` varchar(255) DEFAULT NULL,
    `authorization_code` varchar(255) DEFAULT NULL,
    `auth_verification_code` varchar(255) DEFAULT NULL,
    `verification_url` text,
    `verification_url_full` text,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Tabela de lojas
CREATE TABLE `lojas` (
    `id_loja` char(36) NOT NULL,
    `nome` varchar(255) NOT NULL,
    `status` int NOT NULL,
    `horario_operacao` time DEFAULT NULL,
    `data_criacao` timestamp DEFAULT CURRENT_TIMESTAMP, -- Alterado para tipo timestamp com CURRENT_TIMESTAMP
    `localizacao` point DEFAULT NULL,
    PRIMARY KEY (`id_loja`),
    CONSTRAINT `lojas_chk_1` CHECK (`status` IN (0, 1, 2))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Tabela de vendas
CREATE TABLE `vendas` (
    `id_venda` char(36) NOT NULL,
    `id_loja` char(36) DEFAULT NULL,
    `data_hora` timestamp NOT NULL,
    `valor_total` decimal(10, 2) NOT NULL,
    `ticket_medio` decimal(10, 2) DEFAULT NULL,
    `tipo_cliente` int DEFAULT NULL,
    `cancelada` tinyint(1) DEFAULT '0',
    `promocao_aplicada` tinyint(1) DEFAULT '0',
    `roi` decimal(10, 2) DEFAULT NULL,
    PRIMARY KEY (`id_venda`),
    KEY `id_loja` (`id_loja`),
    CONSTRAINT `vendas_ibfk_1` FOREIGN KEY (`id_loja`) REFERENCES `lojas` (`id_loja`),
    CONSTRAINT `vendas_chk_1` CHECK (`tipo_cliente` IN (0, 1))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Tabela de operações
CREATE TABLE `operacao` (
    `id_operacao` char(36) NOT NULL,
    `id_loja` char(36) DEFAULT NULL,
    `data_hora_inicio` timestamp NOT NULL,
    `data_hora_fim` timestamp NULL DEFAULT NULL,
    `tempo_total` int GENERATED ALWAYS AS (
        TIMESTAMPDIFF(
            SECOND,
            `data_hora_inicio`,
            `data_hora_fim`
        )
    ) STORED,
    `cancelamentos` int DEFAULT '0',
    `erros_plataforma` int DEFAULT NULL,
    PRIMARY KEY (`id_operacao`),
    KEY `id_loja` (`id_loja`),
    CONSTRAINT `operacao_ibfk_1` FOREIGN KEY (`id_loja`) REFERENCES `lojas` (`id_loja`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Tabela de clientes
CREATE TABLE `clientes` (
    `id_cliente` char(36) NOT NULL,
    `nome` varchar(255) DEFAULT NULL,
    `id_loja` char(36) DEFAULT NULL,
    `distancia_raio` decimal(5, 2) DEFAULT NULL,
    `tipo_cliente` int DEFAULT NULL,
    `data_ultima_compra` date DEFAULT NULL,
    PRIMARY KEY (`id_cliente`),
    KEY `id_loja` (`id_loja`),
    CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_loja`) REFERENCES `lojas` (`id_loja`),
    CONSTRAINT `clientes_chk_1` CHECK (`tipo_cliente` IN (0, 1))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;