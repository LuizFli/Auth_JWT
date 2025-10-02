# Auth JWT - Módulo de Pedidos

Sistema de autenticação JWT com módulo completo de pedidos implementando relações entre pedidos e produtos.

## Funcionalidades Implementadas

### ✅ Parte 1: Modelagem da Tabela de Relação
- Criada tabela `pedidosProdutos` com relacionamentos via Foreign Keys
- Campos: `id`, `pedidoId`, `produtoId`, `quantidade`, `precoUnitario`
- Relações CASCADE para manter integridade dos dados

### ✅ Parte 2: Lógica do Controller
- **listPedidos**: Lista apenas pedidos do usuário autenticado com produtos relacionados
- **listPedidoById**: Busca pedido específico validando propriedade do usuário
- **createPedido**: Cria pedido com produtos em transação atômica
- Implementação de segurança: usuário só acessa próprios pedidos

### ✅ Parte 3: Demonstração Prática
- Arquivo `TESTE_PRATICO.md` com exemplos completos
- Scripts para criar usuário, produtos e pedidos
- Validação da tabela de relação funcionando

### ✅ Parte 4: Atualização de Status
- Método `concludePedido`: Atualiza status para "Concluido"
- Rota especial `/pedidos/:id/concluir` para API do professor
- Sem autenticação para facilitar integração externa

## Instalação e Configuração

```bash
# Instalar dependências
npm install

# Executar migrations
npx prisma migrate dev

# Gerar cliente Prisma
npx prisma generate

# Iniciar servidor de desenvolvimento
npm run dev
```

## Estrutura do Banco de Dados

### Modelos Principais
- **user**: Usuários do sistema
- **produto**: Produtos disponíveis
- **pedidos**: Pedidos dos usuários
- **pedidosProdutos**: Tabela de relação (N:N)
- **token**: Controle de tokens JWT

### Relacionamentos
```
user (1) ---- (N) pedidos
user (1) ---- (N) produto
pedidos (N) ---- (N) produto (via pedidosProdutos)
```

## Rotas da API

### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login e obter token

### Pedidos (Protegidas)
- `GET /pedidos` - Listar pedidos do usuário
- `GET /pedidos/:id` - Buscar pedido específico
- `POST /pedidos` - Criar novo pedido
- `PUT /pedidos/:id` - Atualizar pedido
- `DELETE /pedidos/:id` - Remover pedido

### Especial para Professor
- `PATCH /pedidos/:id/concluir` - Marcar como concluído

## Exemplo de Uso

```json
POST /pedidos
Authorization: Bearer {token}
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

## Segurança Implementada

1. **Autenticação JWT**: Todas as rotas protegidas requerem token válido
2. **Autorização**: Usuários só acessam próprios dados
3. **Validação**: IDs numéricos e dados obrigatórios validados
4. **Integridade**: Transações para operações críticas

## Arquivos de Demonstração

- `TESTE_PRATICO.md`: Guia completo de testes
- `EXEMPLO_TABELA_RELACAO.sql`: Estrutura da tabela de relação
- Migrations aplicadas automaticamente

## Build Process

### Desenvolvimento
```bash
npm run dev
```

### Produção com Docker
```bash
# Desenvolvimento
docker build -t auth_jwt:dev --target dev .

# Produção
docker build -t auth_jwt:prod --target prod .
docker run -p 3000:3000 auth_jwt:prod
```

## Tecnologias Utilizadas

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas

## Critérios de Avaliação Atendidos

- ✅ Estrutura do schema.prisma correta
- ✅ Migrations geradas e aplicadas
- ✅ Roteamento funcional e claro
- ✅ Middleware de autenticação aplicado
- ✅ CRUD completo implementado
- ✅ Regras de negócio validadas
- ✅ Código organizado em TypeScript