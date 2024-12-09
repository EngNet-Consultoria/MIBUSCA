-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS ESTAT_HOTEIS;

-- Seleção do banco de dados
USE ESTAT_HOTEIS;

-- Criação da tabela
CREATE TABLE METRICAS (
    id VARCHAR(50) PRIMARY KEY,
    ticket_diaria DECIMAL(10, 2),
    receita_com_taxas DECIMAL(10, 2),
    taxas DECIMAL(10, 2),
    taxa_de_limpeza DECIMAL(10, 2),
    taxa_enxoval DECIMAL(10, 2),
    taxa_parcelamento DECIMAL(10, 2),
    taxa_cafe DECIMAL(10, 2),
    comissao DECIMAL(10, 2),
    nota DECIMAL(3, 2),
    data_dia INT,
    data_mes INT,
    nome_mes VARCHAR(20),
    data_ano INT,
    dia_chegada VARCHAR(255),
    dia_saida VARCHAR(255),
    numero_noites int,
    DDD VARCHAR(255),
    hospedes INT,
    id_agente VARCHAR(50),
    nome_agente VARCHAR(50),
    canais VARCHAR(255),
    data_dia_criacao INT,
    data_mes_criacao varchar(50),
    data_ano_criacao int,
    siglas_condominios VARCHAR(50),
    estado VARCHAR(255),
    cidade varchar(255),
    regiao VARCHAR(255),
    rua_numero varchar(255),
    imovel VARCHAR(255)
);