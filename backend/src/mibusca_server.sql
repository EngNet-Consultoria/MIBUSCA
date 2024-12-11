
CREATE TABLE token_validation (
    id SERIAL PRIMARY KEY,
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
    id_loja SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Aberta', 'Fechada por erro', 'Fora do horário')),
    horario_operacao TIME,
    data_criacao DATE DEFAULT CURRENT_DATE,
    localizacao GEOGRAPHY(Point, 4326)
);

CREATE TABLE vendas (
    id_venda SERIAL PRIMARY KEY,
    id_loja INT REFERENCES lojas(id_loja),
    data_hora TIMESTAMP NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    ticket_medio DECIMAL(10, 2),
    tipo_cliente VARCHAR(20) CHECK (tipo_cliente IN ('Novo', 'Recorrente')),
    cancelada BOOLEAN DEFAULT FALSE,
    promocao_aplicada BOOLEAN DEFAULT FALSE,
    roi DECIMAL(10, 2)
);

CREATE TABLE operacao (
    id_operacao SERIAL PRIMARY KEY,
    id_loja INT REFERENCES lojas(id_loja),
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP,
    tempo_total INTERVAL GENERATED ALWAYS AS (data_hora_fim - data_hora_inicio) STORED,
    cancelamentos INT DEFAULT 0,
    erros_plataforma INT
);

CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    id_loja INT REFERENCES lojas(id_loja),
    distancia_raio DECIMAL(5, 2),
    tipo VARCHAR(20) CHECK (tipo IN ('Potencial', 'Real')),
    data_ultima_compra DATE
);