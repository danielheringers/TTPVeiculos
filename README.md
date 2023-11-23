# API Seidor

Esta é a documentação para a API Seidor. A API é construída usando Node.js e Express, e se conecta a um banco de dados PostgreSQL para gerenciar informações sobre carros, motoristas e suas utilizações.

## Configuração

Certifique-se de ter o Node.js e o PostgreSQL instalados em seu sistema.

1. **Instalação de Dependências:**
   ```bash
   npm install
   ```

2. **Configuração do Banco de Dados:**
   - Crie um banco de dados PostgreSQL chamado `automoveisAPI`.
   - Configure as variáveis de ambiente no arquivo `.env` com as informações do seu banco de dados.


3. **Tabelas Banco de Dados:**
   - O arquivo createTables.sql contém as querys para gerar o banco de dados no PostgreSQL

## Scripts Disponíveis

- **Testes:**
  ```bash
  npm test
  ```

- **Iniciar Servidor:**
  ```bash
  npm start
  ```

- **Modo Desenvolvimento (com nodemon):**
  ```bash
  npm run dev
  ```

## Endpoints

A API possui os seguintes endpoints:

- **Carros:**
  - `GET /cars`: Listar todos os carros.
  - `POST /cars`: Criar um novo carro.
  - `GET /cars/:licenseplate`: Obter detalhes de um carro específico.
  - `PUT /cars/:licenseplate`: Atualizar informações de um carro.
  - `DELETE /cars/:licenseplate`: Deletar um carro.

- **Motoristas:**
  - `GET /drivers`: Listar todos os motoristas.
  - `POST /drivers`: Criar um novo motorista.
  - `GET /drivers/:cnh`: Obter detalhes de um motorista específico.
  - `PUT /drivers/:cnh`: Atualizar informações de um motorista.
  - `DELETE /drivers/:cnh`: Deletar um motorista.

- **Utilização de Carros:**
  - `POST /car-utilization/start`: Iniciar a utilização de um carro por um motorista.
  - `POST /car-utilization/end/:driverId`: Finalizar a utilização de um carro por um motorista.
  - `GET /car-utilization/list`: Listar todas as utilizações de carro.

## Observações

- Certifique-se de configurar corretamente as variáveis de ambiente no arquivo `.env`.
- Lembre-se de ajustar as informações de conexão do banco de dados de acordo com o seu ambiente.

Aproveite a utilização da API Seidor! Se houver alguma dúvida ou problema, sinta-se à vontade para contatar a equipe de suporte.