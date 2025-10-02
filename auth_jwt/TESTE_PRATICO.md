# Demonstração Prática - Módulo de Pedidos

## Pré-requisitos
1. Execute `npm install` para instalar dependências
2. Execute `npx prisma migrate dev` para aplicar as migrations
3. Execute `npm run dev` para iniciar o servidor

## Parte 3: Demonstração Prática

### 1. Criar um Usuário

**POST** `/auth/register`
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

### 2. Fazer Login para obter Token

**POST** `/auth/login`
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

Resposta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

### 3. Criar Produtos

**POST** `/produtos`
Headers: `Authorization: Bearer {token}`
```json
{
  "nome": "Notebook Dell",
  "descricao": "Notebook Dell Inspiron 15 3000",
  "preco": 2500.00,
  "estoque": 10
}
```

**POST** `/produtos`
Headers: `Authorization: Bearer {token}`
```json
{
  "nome": "Mouse Wireless",
  "descricao": "Mouse sem fio com receptor USB",
  "preco": 50.00,
  "estoque": 25
}
```

### 4. Criar Pedido com Produtos

**POST** `/pedidos`
Headers: `Authorization: Bearer {token}`
```json
{
  "valor": 2600.00,
  "status": "Pendente",
  "produtos": [
    {
      "produtoId": 1,
      "quantidade": 1,
      "precoUnitario": 2500.00
    },
    {
      "produtoId": 2,
      "quantidade": 2,
      "precoUnitario": 50.00
    }
  ]
}
```

### 5. Listar Pedidos do Usuário

**GET** `/pedidos`
Headers: `Authorization: Bearer {token}`

Resposta esperada:
```json
[
  {
    "id": 1,
    "valor": "2600.00",
    "status": "Pendente",
    "userId": 1,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com"
    },
    "pedidosProdutos": [
      {
        "id": 1,
        "pedidoId": 1,
        "produtoId": 1,
        "quantidade": 1,
        "precoUnitario": "2500.00",
        "produto": {
          "id": 1,
          "nome": "Notebook Dell",
          "descricao": "Notebook Dell Inspiron 15 3000",
          "preco": "2500.00",
          "status": "Disponivel",
          "estoque": 10
        }
      },
      {
        "id": 2,
        "pedidoId": 1,
        "produtoId": 2,
        "quantidade": 2,
        "precoUnitario": "50.00",
        "produto": {
          "id": 2,
          "nome": "Mouse Wireless",
          "descricao": "Mouse sem fio com receptor USB",
          "preco": "50.00",
          "status": "Disponivel",
          "estoque": 25
        }
      }
    ]
  }
]
```

### 6. Buscar Pedido Específico por ID

**GET** `/pedidos/1`
Headers: `Authorization: Bearer {token}`

### 7. Testar Segurança - Usuário só vê próprios pedidos

Crie outro usuário e tente acessar os pedidos do primeiro usuário. Deve retornar erro 403.

### 8. Marcar Pedido como Concluído (Rota para API do Professor)

**PATCH** `/pedidos/1/concluir`

Esta rota não requer autenticação e pode ser chamada pela API do professor.

## Validações Implementadas

1. ✅ Tabela de relação `pedidosProdutos` criada com foreign keys
2. ✅ Usuário só pode ver seus próprios pedidos
3. ✅ Pedidos incluem informações dos produtos relacionados
4. ✅ Middleware de autenticação aplicado nas rotas protegidas
5. ✅ Método para marcar pedido como concluído
6. ✅ Validação de propriedade do pedido antes de operações
7. ✅ Transações para garantir consistência dos dados

## Estrutura da Tabela de Relação

```sql
CREATE TABLE `pedidosProdutos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedidoId` int NOT NULL,
  `produtoId` int NOT NULL,
  `quantidade` int NOT NULL DEFAULT '1',
  `precoUnitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pedidosProdutos_pedidoId_produtoId_key` (`pedidoId`,`produtoId`),
  KEY `pedidosProdutos_produtoId_fkey` (`produtoId`),
  CONSTRAINT `pedidosProdutos_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pedidosProdutos_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produto` (`id`) ON DELETE CASCADE
)
```

## Rotas Implementadas

- `GET /pedidos` - Lista pedidos do usuário autenticado
- `GET /pedidos/:id` - Busca pedido específico (apenas do usuário autenticado)
- `POST /pedidos` - Cria novo pedido com produtos
- `PUT /pedidos/:id` - Atualiza pedido (apenas do usuário proprietário)
- `DELETE /pedidos/:id` - Remove pedido (apenas do usuário proprietário)
- `PATCH /pedidos/:id/concluir` - Marca pedido como concluído (para API do professor)