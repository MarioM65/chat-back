# Guia de Contribuição para Novos CRUDs

Bem-vindo(a) ao projeto! Este guia foi criado para padronizar o desenvolvimento de novas funcionalidades de CRUD (Create, Read, Update, Delete), garantindo que o código permaneça consistente com a estrutura já estabelecida.

**É crucial seguir este guia para manter a organização do projeto.**

## Estrutura do Projeto

Este projeto organiza os arquivos por responsabilidade, e não por funcionalidade. A estrutura é a seguinte:

- **Controllers**: `src/controllers/<nome-da-entidade>/`
- **Services**: `src/services/<nome-da-entidade>/`
- **Interfaces/DTOs**: `src/interfaces/`

Todos os novos controllers e services devem ser registrados manualmente no módulo principal `AppModule` (`src/app.module.ts`).

---

## Fluxo de Trabalho Padrão

Para adicionar um novo CRUD para uma entidade (por exemplo, `Produto`), siga os passos abaixo.

### 1. Definir o Modelo no Prisma

1.  Abra o arquivo `prisma/schema.prisma`.
2.  Adicione um novo `model` com os campos necessários.

**Exemplo: Adicionando um modelo `Produto`**
```prisma
// prisma/schema.prisma

model Produto {
  id          Int      @id @default(autoincrement())
  nome        String
  descricao   String?
  preco       Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2. Gerar a Migração do Banco de Dados

Após definir o modelo, aplique a mudança ao banco de dados usando o script de migração do projeto. Para nomear sua migração, passe o argumento `--name` após `--`.

```bash
npm run migrate -- --name "add-produto-model"
```
O Prisma Client será atualizado automaticamente para incluir o novo modelo.

### 3. Criar os Arquivos da Entidade

Agora, vamos gerar os arquivos `controller` e `service` nos diretórios corretos usando o NestJS CLI.

1.  **Gerar o Controller:**
    ```bash
    nest generate controller controllers/produtos --no-spec
    ```
    Isso criará o arquivo `src/controllers/produtos/produtos.controller.ts`.

2.  **Gerar o Service:**
    ```bash
    nest generate service services/produtos --no-spec
    ```
    Isso criará o arquivo `src/services/produtos/produtos.service.ts`.

3.  **Criar a Interface ou DTO (Manual):**
    Crie um novo arquivo para a sua entidade em `src/interfaces/`.
    **Exemplo:** `src/interfaces/produto.ts`
    ```typescript
    // src/interfaces/produto.ts
    export interface Produto {
      id: number;
      nome: string;
      descricao?: string;
      preco: number;
    }
    ```

### 4. Registrar no AppModule

Os arquivos gerados **não são registrados automaticamente**. Você deve adicioná-los manually ao `AppModule`.

1.  Abra o arquivo `src/app.module.ts`.
2.  Importe o novo controller e service.
3.  Adicione-os às listas `controllers` e `providers`.

**(Veja o exemplo na seção anterior deste guia)**

### 5. Implementar a Lógica de Negócio

Com tudo configurado, implemente a lógica no `service` e no `controller`.

-   **Service (`produtos.service.ts`):** Injete o `PrismaService` no construtor e use `this.prisma.produto` para criar os métodos de CRUD.
-   **Controller (`produtos.controller.ts`):** Conecte as rotas aos métodos do service que você acabou de criar.

---
## Scripts Úteis do Projeto

Use os seguintes scripts NPM para auxiliar no desenvolvimento:

-   `npm run start:dev`
    Inicia a aplicação em modo de desenvolvimento com watch mode. O servidor reiniciará automaticamente após cada alteração nos arquivos.

-   `npm run lint`
    Executa o ESLint para verificar e corrigir problemas de estilo e qualidade de código.

-   `npm run format`
    Formata todo o código do projeto usando o Prettier.

-   `npm run test`
    Executa todos os testes unitários do projeto.

-   `npm run migrate`
    Executa o `prisma migrate dev`, aplicando novas migrações ao banco de dados.

-   `npm run migrate:fresh`
    Executa `prisma migrate reset`, limpando o banco de dados e aplicando todas as migrações novamente. **Cuidado: Isso apaga todos os dados.**

---

## Nota sobre o Banco de Dados: Usando MySQL

Este projeto está configurado para PostgreSQL, mas você pode usar **MySQL**.

1.  **Alterar o Provedor no `prisma/schema.prisma`:**
    Altere `provider = "postgresql"` para `provider = "mysql"`.

2.  **Atualizar a `DATABASE_URL` no arquivo `.env`:**
    Use o formato de conexão do MySQL: `mysql://USER:PASSWORD@HOST:PORT/DATABASE`.

Após as alterações, execute o script de migração novamente para garantir que o banco de dados esteja sincronizado:

```bash
npm run migrate
```
