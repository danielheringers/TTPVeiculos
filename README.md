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
- **Insomnia file:**
  ```bash
  https://drive.google.com/file/d/1m6vGhV42XOUiAQO_xWfdbvS09Xg7vzRa/view?usp=sharing
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
  - `POST /cars`: Criar um novo carro.
  - `GET /cars`: Listar todos os carros.
  - `GET /cars//:filter?/:filterB?`: Obter detalhes de um carro utilizando cor e marca.
  - `GET /cars//:filter?/`: Obter detalhes de um carro utilizando cor, marca ou placa.
  - `PATCH /cars/update/:id`: Atualizar informações de um carro.
  - `PATCH /cars/recovery/:licenseplate`: Recuperar um carro deletado pela placa.
  - `DELETE /cars/:id`: Deletar um carro.

- **Motoristas:**
  - `POST /drivers`: Criar um novo motorista.
  - `GET /drivers`: Listar todos os motoristas.
  - `GET /drivers/:cnh`: Obter detalhes de um motorista específico.
  - `PATCH /drivers/update/:cnh`: Atualizar informações de um motorista.
  - `PATCH /recovery/:cnh`: Recuperar informações de um motorista deletado.
  - `DELETE /drivers/:cnh`: Deletar um motorista.

- **Utilização de Carros:**
  - `POST /car-utilization/start`: Iniciar a utilização de um carro por um motorista.
  - `POST /car-utilization/end/:driverId`: Finalizar a utilização de um carro por um motorista.
  - `GET /car-utilization/list`: Listar todas as utilizações de carro.

## Observações

- Certifique-se de configurar corretamente as variáveis de ambiente no arquivo `.env`.
- Lembre-se de ajustar as informações de conexão do banco de dados de acordo com o seu ambiente.

Aproveite a utilização da API Seidor! Se houver alguma dúvida ou problema, sinta-se à vontade para contatar a equipe de suporte.