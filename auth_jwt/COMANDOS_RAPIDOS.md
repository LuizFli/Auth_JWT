# ⚡ Comandos Rápidos - Auth JWT

Este arquivo contém todos os comandos necessários para configurar o projeto em uma nova máquina.

## 🚀 Setup Inicial (Copie e Cole)

### 1. Clonar e Navegar
```bash
git clone https://github.com/LuizFli/Auth_JWT.git
cd Auth_JWT/auth_jwt
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Ambiente (.env)
```bash
echo DATABASE_URL="mysql://root:senai@127.0.0.1:3306/auth_db" > .env
echo JWT_SECRET="meu_jwt_secret_super_seguro_123456" >> .env
echo PORT=3000 >> .env
```

### 4. Configurar Banco de Dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma migrate dev --name setup_inicial

# Visualizar banco (opcional)
npx prisma studio
```

### 5. Iniciar Servidor
```bash
npm run dev
```

### 6. Testar API
```bash
# Verificar se está funcionando
curl http://localhost:3000/health
```

## 🔄 Comandos de Uso Diário

### Desenvolvimento
```bash
# Iniciar servidor com hot reload
npm run dev

# Parar servidor
Ctrl + C
```

### Banco de Dados
```bash
# Ver dados no navegador
npx prisma studio

# Reset completo do banco (CUIDADO!)
npx prisma migrate reset

# Aplicar mudanças do schema
npx prisma db push
```

### Git
```bash
# Verificar status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "sua mensagem"

# Push
git push origin main
```

## 🧪 Testes Rápidos da API

### 1. Registrar Usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@email.com","password":"123456"}'
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'
```

### 3. Criar Produto (substitua {TOKEN})
```bash
curl -X POST http://localhost:3000/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"nome":"Notebook","descricao":"Dell Inspiron","preco":2500.00,"estoque":10}'
```

### 4. Criar Pedido (substitua {TOKEN})
```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"valor":2500.00,"status":"Pendente","produtos":[{"produtoId":1,"quantidade":1,"precoUnitario":2500.00}]}'
```

### 5. Listar Pedidos (substitua {TOKEN})
```bash
curl -X GET http://localhost:3000/pedidos \
  -H "Authorization: Bearer {TOKEN}"
```

### 6. Concluir Pedido (API Professor)
```bash
curl -X PATCH http://localhost:3000/pedidos/1/concluir
```

## 🔧 Resolução Rápida de Problemas

### MySQL não conecta
```bash
# Verificar se MySQL está rodando
netstat -an | findstr :3306

# Se vazio, inicie XAMPP ou execute:
docker run --name mysql-auth -e MYSQL_ROOT_PASSWORD=senai -e MYSQL_DATABASE=auth_db -p 3306:3306 -d mysql:8.0
```

### Porta ocupada
```bash
# Ver o que está usando a porta 3000
netstat -ano | findstr :3000

# Matar processo (substitua {PID})
taskkill /PID {PID} /F
```

### Reinstalar dependências
```bash
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### Reset completo do projeto
```bash
# CUIDADO: Apaga todo o banco!
npx prisma migrate reset
npx prisma migrate dev --name reset_inicial
npx prisma generate
npm run dev
```

## 📱 URLs Importantes

```
API Health Check:    http://localhost:3000/health
Prisma Studio:       http://localhost:5555
phpMyAdmin (XAMPP):  http://localhost/phpmyadmin
```

## 🎯 Checklist de Verificação

Execute estes comandos para verificar se tudo está funcionando:

```bash
# 1. Node.js
node --version

# 2. Dependências
npm list --depth=0

# 3. Banco conectado
npx prisma db pull

# 4. API funcionando
curl http://localhost:3000/health

# 5. Autenticação funcionando
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"name":"Teste","email":"teste@teste.com","password":"123456"}'
```

Se todos retornarem sucesso, o projeto está configurado corretamente! 🎉