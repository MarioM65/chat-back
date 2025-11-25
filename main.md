# Principais Endpoints da API

Este documento sumariza os principais endpoints da API REST, com foco nas funcionalidades alteradas ou adicionadas, refletindo as melhores práticas e segurança.

**URL Base**: `http://localhost:3000` (ou o seu endereço de produção)

---

## API REST

### Auth
- `POST /auth/login`
  - **Descrição**: Autentica um utilizador.
  - **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "senha": "password123"
    }
    ```
  - **Success Response (200)**: Retorna `access_token` JWT e os dados do utilizador.
- `POST /auth/register`
  - **Descrição**: Regista um novo utilizador.
  - **Request Body**:
    ```json
    {
      "nome_usuario": "Novo Utilizador",
      "email": "newuser@example.com",
      "senha": "password123",
      "foto_perfil": "url_da_foto.jpg", // Opcional
      "telefone": "123456789" // Opcional
    }
    ```
  - **Success Response (201)**: Retorna `access_token` JWT e os dados do utilizador criado.

### Users
- `GET /users`
  - **Descrição**: Retorna uma lista de todos os utilizadores ativos.
- `GET /users/:id`
  - **Descrição**: Retorna um utilizador específico pelo seu ID. (Geralmente para administração ou visualização pública).
- `POST /users`
  - **Descrição**: Cria um novo utilizador (pode ser usado por admins). Aceita `multipart/form-data` para `foto_perfil`.
- `PUT /users`
  - **Descrição**: Atualiza os dados do **utilizador autenticado**. O ID do utilizador é extraído do token JWT. Aceita `multipart/form-data` para upload de `foto_perfil`.
- `DELETE /users/:id`
  - **Descrição**: Realiza um "soft delete" de um utilizador. **Requer permissão administrativa.**
- `DELETE /users/purge/:id`
  - **Descrição**: Remove permanentemente um utilizador da base de dados. **Requer permissão administrativa.**
- `GET /users/trashed/all`
  - **Descrição**: Lista todos os utilizadores "soft-deleted". **Requer permissão administrativa.**
- `PUT /users/restore/:id`
  - **Descrição**: Restaura um utilizador "soft-deleted". **Requer permissão administrativa.**

### Conversas
- `GET /conversas`
  - **Descrição**: Retorna todas as conversas das quais o **utilizador autenticado é participante**. Para conversas individuais, o `nome_conversa` e `foto_conversa` refletirão o outro participante.
- `GET /conversas/:id_conversa`
  - **Descrição**: Retorna uma conversa específica. O **utilizador autenticado deve ser participante** desta conversa. Para conversas individuais, o `nome_conversa` e `foto_conversa` refletirão o outro participante.
- `POST /conversas`
  - **Descrição**: Cria uma nova conversa. O **utilizador autenticado é automaticamente adicionado como `CRIADOR`**. É possível adicionar outros participantes via `id_usuarios`. Suporta upload de `foto_conversa` via `multipart/form-data`.
  - **Request Body**:
    ```json
    {
      "tipo_conversa": "grupo",
      "nome_conversa": "Grupo de Trabalho", // Opcional
      "id_usuarios": [2, 3], // Opcional: IDs de outros utilizadores a serem adicionados
      "foto_conversa": "url_da_foto.jpg" // Opcional
    }
    ```

### Mensagens
- `POST /mensagens`
  - **Descrição**: Cria uma nova mensagem com múltiplos anexos. O **remetente é o utilizador autenticado**. Aceita `multipart/form-data`.
  - **Request Body (form-data)**:
    ```json
    {
      "id_conversa": 2,
      "conteudo": "Mensagem de texto com anexos.", // Opcional
      "tipo": "texto",
      "anexos": [] // Opcional: Array de ficheiros
    }
    ```
- `DELETE /mensagens/:id`
  - **Descrição**: Deleta uma mensagem. **Apenas o remetente ou um `ADMIN`/`CRIADOR` da conversa pode executar esta ação.**

### Leitura de Mensagens
- `POST /leitura_mensagens`
  - **Descrição**: Marca uma mensagem como lida pelo **utilizador autenticado**. O ID do utilizador é extraído do token JWT.
  - **Request Body**:
    ```json
    {
      "id_mensagem": 101,
      "data_hora_leitura": "2025-11-16T12:00:00.000Z"
    }
    ```
- `PUT /leitura_mensagens/:id`
  - **Descrição**: Atualiza um registo de leitura. O **utilizador autenticado deve ser o proprietário** do registo.
- `DELETE /leitura_mensagens/:id`
  - **Descrição**: Deleta um registo de leitura. O **utilizador autenticado deve ser o proprietário** do registo.

### Notificações
- `POST /notificacoes`
  - **Descrição**: Cria uma notificação para o **utilizador autenticado**. O ID do utilizador é extraído do token JWT.
  - **Request Body**:
    ```json
    {
      "id_mensagem": 10,
      "tipo_notificacao": "nova_mensagem",
      "data_hora_criacao": "2025-11-17T10:00:00.000Z",
      "status": "pendente"
    }
    ```
- `PUT /notificacoes/:id`
  - **Descrição**: Atualiza uma notificação. O **utilizador autenticado deve ser o proprietário** da notificação.
- `DELETE /notificacoes/:id`
  - **Descrição**: Deleta uma notificação. O **utilizador autenticado deve ser o proprietário** da notificação.

---

## API WebSocket

### Eventos (Cliente para Servidor)

#### `chatMessage`
- **Descrição**: Envia uma nova mensagem para uma conversa. O servidor irá persistir a mensagem na base de dados e transmiti-la para todos os outros membros da sala. O remetente da mensagem é o utilizador autenticado.
- **Payload**: `Map<String, dynamic>` - Corresponde à estrutura `CreateMensagem` (sem `id_remetente`).
  ```json
  {
    "id_conversa": 123,
    "conteudo": "Olá do Flutter!",
    "tipo": "texto"
  }
  ```