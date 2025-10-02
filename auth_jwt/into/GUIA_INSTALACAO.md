# 🚀 Guia Completo de Instalação - Auth JWT

Este guia te permitirá configurar e executar o projeto Auth JWT com módulo de pedidos em qualquer máquina Windows.

## 📋 Pré-requisitos

### 1. Instalar Node.js
```bash
# Baixe e instale Node.js LTS (versão 18 ou superior)
# https://nodejs.org/

# Verificar instalação
node --version
npm --version
```

### 2. Instalar Git (se não tiver)
```bash
# Baixe e instale: https://git-scm.com/download/win
# Verificar instalação
git --version
```

## 🗄️ Configuração do Banco de Dados

### Opção 1: XAMPP (Mais Fácil)

1. **Baixar XAMPP**
   - Acesse: https://www.apachefriends.org/
   - Baixe para Windows
   - Execute como Administrador

2. **Iniciar MySQL**
   ```bash
   # Abra XAMPP Control Panel
   # Clique em "Start" ao lado de MySQL
   # Aguarde status ficar verde
   ```

3. **Criar Banco de Dados**
   - Acesse: http://localhost/phpmyadmin
   - Clique em "Databases"
   - Nome: `auth_db`
   - Clique em "Create"

### Opção 2: Docker (Alternativa)
```bash
# Se tiver Docker instalado
docker run --name mysql-auth -e MYSQL_ROOT_PASSWORD=senai -e MYSQL_DATABASE=auth_db -p 3306:3306 -d mysql:8.0
```

## 📁 Configuração do Projeto

### 1. Clonar o Repositório
```bash
# Clone o projeto
git clone https://github.com/LuizFli/Auth_JWT.git

# Entre no diretório correto
cd Auth_JWT/auth_jwt
```

### 2. Instalar Dependências
```bash
# Instalar todas as dependências
npm install
```

### 3. Configurar Variáveis de Ambiente
```bash
# Criar arquivo .env na raiz do projeto auth_jwt
echo 'DATABASE_URL="mysql://root:senai@127.0.0.1:3306/auth_db"' > .env
echo 'JWT_SECRET="meu_jwt_secret_super_seguro_123456"' >> .env
echo 'PORT=3000' >> .env
```

### 4. Configurar Prisma
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations (criar tabelas)
npx prisma migrate dev --name init_setup

# Se der erro de conexão, verifique se MySQL está rodando
```

### 5. Verificar Estrutura do Banco
```bash
# Ver estrutura das tabelas criadas
npx prisma studio
# Acesse: http://localhost:5555
```

## 🏃‍♂️ Executar o Projeto

### 1. Iniciar Servidor de Desenvolvimento
```bash
# Comando principal para rodar o projeto
npm run dev

# Ou alternativamente
npx tsx --watch src/app.ts
```

### 2. Verificar se está funcionando
```bash
# O servidor deve iniciar na porta 3000
# Acesse: http://localhost:3000/health
# Deve retornar: "API RODANDO"
```

## 🧪 Testar a API

### 1. Registrar um Usuário
```bash
# POST http://localhost:3000/auth/register
# Body (JSON):
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

### 2. Fazer Login
```bash
# POST http://localhost:3000/auth/login
# Body (JSON):
{
  "email": "joao@email.com",
  "password": "123456"
}

# Copie o token retornado
```

### 3. Criar um Produto
```bash
# POST http://localhost:3000/produtos
# Headers: Authorization: Bearer {SEU_TOKEN}
# Body (JSON):
{
  "nome": "Notebook Dell",
  "descricao": "Notebook para trabalho",
  "preco": 2500.00,
  "estoque": 10
}
```

### 4. Criar um Pedido
```bash
# POST http://localhost:3000/pedidos
# Headers: Authorization: Bearer {SEU_TOKEN}
# Body (JSON):
{
  "valor": 2500.00,
  "status": "Pendente",
  "produtos": [
    {
      "produtoId": 1,
      "quantidade": 1,
      "precoUnitario": 2500.00
    }
  ]
}
```

### 5. Listar Pedidos
```bash
# GET http://localhost:3000/pedidos
# Headers: Authorization: Bearer {SEU_TOKEN}
```

## 🔧 Comandos Úteis

### Comandos de Desenvolvimento
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (com hot reload)
npm run dev

# Buildar para produção
npm run build

# Rodar versão buildada
npm start

# Visualizar banco de dados
npx prisma studio

# Reset do banco (CUIDADO: apaga tudo)
npx prisma migrate reset

# Gerar novo cliente Prisma após mudanças no schema
npx prisma generate
```

### Comandos de Banco de Dados
```bash
# Verificar conexão com banco
npx prisma db pull

# Aplicar mudanças do schema para o banco
npx prisma db push

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Ver status das migrations
npx prisma migrate status
```

## 🚨 Resolução de Problemas

### MySQL não conecta
```bash
# Verificar se MySQL está rodando
netstat -an | findstr :3306

# Se não aparecer nada, MySQL não está rodando
# Inicie pelo XAMPP Control Panel
```

### Erro "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro de Prisma
```bash
# Regenerar cliente Prisma
npx prisma generate

# Se persistir, reset completo
npx prisma migrate reset
npx prisma migrate dev
```

### Porta 3000 ocupada
```bash
# Verificar o que está usando a porta
netstat -ano | findstr :3000

# Matar processo (substitua PID pelo número retornado)
taskkill /PID {NUMERO_PID} /F

# Ou mude a porta no .env
echo 'PORT=3001' >> .env
```

## 📊 Estrutura Final do Projeto

```
auth_jwt/
├── prisma/
│   ├── schema.prisma          # Schema do banco
│   ├── migrations/            # Histórico de mudanças
│   └── prisma.ts             # Cliente Prisma
├── src/
│   ├── controllers/           # Lógica de negócio
│   ├── middleware/            # Autenticação
│   ├── routes/               # Rotas da API
│   ├── utils/                # Utilitários (JWT)
│   └── app.ts                # Servidor principal
├── .env                      # Variáveis de ambiente
├── package.json              # Dependências
└── README.md                 # Documentação
```

## ✅ Checklist Final

- [ ] Node.js instalado
- [ ] MySQL rodando (XAMPP ou Docker)
- [ ] Banco `auth_db` criado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Migrations executadas (`npx prisma migrate dev`)
- [ ] Cliente Prisma gerado (`npx prisma generate`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] API respondendo em http://localhost:3000/health

## 🎯 Resultado Esperado

Após seguir todos os passos, você terá:

✅ API de autenticação JWT funcionando
✅ CRUD completo de usuários, produtos e pedidos
✅ Sistema de relacionamento pedidos ↔ produtos
✅ Segurança: usuários só veem próprios dados
✅ Rota especial para API do professor
✅ Banco de dados MySQL configurado
✅ Documentação completa para testes

---

**💡 Dica:** Mantenha este arquivo sempre atualizado e use o comando `npm run dev` para desenvolvimento diário.