# API ESTAT

## Visão Geral

Este projeto foi desenvolvido para armazenar e atualizar dados provenientes da API da stays. Ele roda em um servidor local e é capaz de manter os dados sempre atualizados, facilitando a consulta e o uso posterior desses dados.

## Instruções de Instalação

1. **Pré-requisitos**: 
   
   - Certifique-se de ter o Node.js e o MySQL instalados em sua máquina.
   - Node.js é a plataforma que utilizamos para rodar o projeto, enquanto o MySQL é o banco de dados onde os dados serão armazenados.
   - O Prisma é utilizado como o ORM (Object-Relational Mapping) para gerenciar o banco de dados.

2. **Instalação**:
   
   - Baixe ou clone o repositório do projeto.
   - Abra o terminal (ou prompt de comando) e navegue até a pasta onde o projeto foi salvo.
   - Execute o seguinte comando para instalar as dependências necessárias:
     
     ```
     npm install
     ```

## Configuração do Banco de Dados

1. **Configuração do MySQL**:
   
   - Certifique-se de que o MySQL está rodando em sua máquina.
   - Crie um banco de dados para o projeto no MySQL.

2. **Rodando as migrates**:
   
   - Para configurar as tabelas do banco de dados, execute o comando abaixo no terminal:
     
     ```
     npx prisma migrate dev --init
     ```

   - Ou opie e cole o codigo databse/hoteis.sql no terminal confirgurado com o mysql.

   - Isso criará as tabelas necessárias no banco de dados.

## Como Executar o Projeto

1. **Iniciando o servidor**:
   
   - No terminal, ainda na pasta do projeto, execute o comando:
     
     ```
     npm start
     ```
   - Isso iniciará o servidor que estará disponível em seu navegador na seguinte URL: [http://localhost:3001](http://localhost:3001).

2. **O que acontece depois**:
   
   - O programa começará a buscar dados da API e armazená-los no banco de dados. Esses dados serão atualizados periodicamente conforme configurado no código.
