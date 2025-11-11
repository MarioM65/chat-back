# Chat para Estagiários

Este é o backend para um aplicativo de chat em tempo real, projetado para facilitar a comunicação e colaboração entre estagiários.

## Visão Geral

O objetivo deste projeto é fornecer uma plataforma de chat robusta e escalável, onde os usuários (estagiários) podem interagir em conversas privadas ou em grupo, compartilhar arquivos e receber notificações.

## Tecnologias Utilizadas

- **Framework:** [NestJS](https://nestjs.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Testes:** [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest)
- **Linting & Formatting:** [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

## Diagrama do Banco de Dados

O diagrama abaixo ilustra a estrutura do banco de dados da aplicação.

![Diagrama do Banco de Dados](diagrama.png)

### Descrição das Tabelas

- **USUARIOS**: Armazena as informações dos usuários, como nome, e-mail e foto de perfil.
- **CONVERSAS**: Representa as conversas, que podem ser privadas ou em grupo.
- **PARTICIPANTE_CONVERSA**: Tabela de junção que associa usuários a conversas.
- **MENSAGENS**: Contém todas as mensagens enviadas, com remetente, conteúdo e data de envio.
- **ANEXO_MENSAGENS**: Armazena os anexos das mensagens.
- **LEITURA_MENSAGEM**: Registra quando um usuário visualiza uma mensagem.
- **USUARIO_BLOQUEADO**: Permite que um usuário bloqueie outro.
- **NOTIFICACAO**: Armazena as notificações a serem enviadas aos usuários.

## Como Começar

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 20.x ou superior)
- [NPM](https://www.npmjs.com/)
- Um banco de dados relacional (ex: PostgreSQL, MySQL) configurado.

### Instalação

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure suas variáveis de ambiente. Renomeie o arquivo `.env.example` para `.env` e adicione a URL de conexão do seu banco de dados:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
   ```
4. Execute as migrações do Prisma para criar as tabelas no banco de dados:
   ```bash
   npx prisma migrate dev
   ```

### Executando a Aplicação

```bash
# Modo de desenvolvimento (com watch)
$ npm run start:dev

# Modo de produção
$ npm run start:prod
```

## Scripts Disponíveis

- `npm run build`: Compila o projeto.
- `npm run format`: Formata o código com o Prettier.
- `npm run lint`: Executa o linter (ESLint).
- `npm test`: Executa os testes unitários.