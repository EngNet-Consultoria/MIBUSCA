# 🏦 Banco de Dados - Primeira Versão

## Descrição
Esta é a **primeira versão do banco de dados** que contém todos os dados conforme o modelo relacional. Esta versão está configurada para controle através do arquivo principal de controle que utilizamos com **Node.js**.

## 💾 Banco de Dados

O banco de dados segue a estrutura definida no modelo relacional e foi desenvolvido para facilitar a implementação e o controle do sistema. A seguir estão os detalhes importantes para utilizar a versão atual do banco de dados:

- **Estrutura**: A primeira versão foi projetada de acordo com o modelo relacional com as tabelas e colunas necessárias.
- **Controle**: O controle do banco de dados será feito através do arquivo principal de controle na parte em que utilizamos **Node.js**. Isso estará bem explícito na implementação.

## 📊 Fluxo de Autenticação OAuth

### 1️⃣ **Captura dos Dados**

A API captura os seguintes dados de autenticação:

- **grantType**: O tipo de concessão OAuth. Os tipos suportados atualmente são `client_credentials`, `authorization_code` e `refresh_token`.
- **clientId**: O identificador do cliente.
- **clientSecret**: O segredo do cliente.
- **authorizationCode**: O código de autorização retornado após autorizar a aplicação. Necessário apenas para o fluxo de código de autorização.
- **authorizationCodeVerifier**: O verificador de código de autorização retornado na solicitação de código do usuário. Necessário apenas para o fluxo de código de autorização.
- **refreshToken**: O token de atualização retornado após solicitar um token de acesso. Necessário apenas para o tipo de concessão `refresh_token`.
