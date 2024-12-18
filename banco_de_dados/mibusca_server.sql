--NÃO USAR ESSE BANCO DE DADOS, JA MUDEI TUDO
--NÃO USAR ESSE BANCO DE DADOS, JA MUDEI TUDO
--NÃO USAR ESSE BANCO DE DADOS, JA MUDEI TUDO
--NÃO USAR ESSE BANCO DE DADOS, JA MUDEI TUDO
--NÃO USAR ESSE BANCO DE DADOS, JA MUDEI TUDO
--NÃO USAR ESSE BANCO DE DADOS, JA MUDEI TUDO
CREATE DATABASE IF NOT EXISTS MIBUSCA;

USE MIBUSCA;

CREATE TABLE token_validation (
    id PRIMARY KEY, -- Mudado para UUID
    client_id VARCHAR(255) NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    token_expiration TIMESTAMP NOT NULL,
    refresh_token TEXT NOT NULL,
    user_code VARCHAR(255),
    authorization_code VARCHAR(255),
    auth_verification_code VARCHAR(255),
    verification_url TEXT,
    verification_url_full TEXT
);

CREATE TABLE lojas (
    id_loja VARCHAR(36) PRIMARY KEY, -- Mudado para UUID
    nome VARCHAR(255) NOT NULL,
    status INT NOT NULL CHECK (status IN (0, 1, 2)), -- 0: Aberta, 1: Fechada por erro, 2: Fora do horário
    horario_operacao TIME,
    data_criacao DATE DEFAULT(CURRENT_DATE),
    localizacao POINT
);

-- Tabela de vendas
CREATE TABLE vendas (
    id_venda VARCHAR(36) PRIMARY KEY, -- Mudado para UUID
    id_loja VARCHAR(36), -- Mudado para UUID
    data_hora TIMESTAMP NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    ticket_medio DECIMAL(10, 2),
    tipo_cliente INT CHECK (tipo_cliente IN (0, 1)),
    cancelada BOOLEAN DEFAULT FALSE,
    promocao_aplicada BOOLEAN DEFAULT FALSE,
    roi DECIMAL(10, 2),
    FOREIGN KEY (id_loja) REFERENCES lojas (id_loja)
);

-- Tabela de operações
CREATE TABLE operacao (
    id_operacao VARCHAR(36) PRIMARY KEY, -- Mudado para UUID
    id_loja VARCHAR(36), -- Mudado para UUID
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP,
    tempo_total INT GENERATED ALWAYS AS (
        TIMESTAMPDIFF(
            SECOND,
            data_hora_inicio,
            data_hora_fim
        )
    ) STORED,
    cancelamentos INT DEFAULT 0,
    erros_plataforma INT,
    FOREIGN KEY (id_loja) REFERENCES lojas (id_loja)
);

-- Tabela de clientes
CREATE TABLE clientes (
    id_cliente VARCHAR(36) PRIMARY KEY, -- Mudado para UUID
    nome VARCHAR(255),
    id_loja VARCHAR(36), -- Mudado para UUID
    distancia_raio DECIMAL(5, 2),
    tipo_cliente INT CHECK (tipo_cliente IN (0, 1)), -- Alterado para corresponder à tabela de vendas
    data_ultima_compra DATE,
    FOREIGN KEY (id_loja) REFERENCES lojas (id_loja)
);