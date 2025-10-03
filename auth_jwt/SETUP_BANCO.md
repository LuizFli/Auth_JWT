# Configuração do Banco de Dados MySQL

## Opção 1: XAMPP (Recomendado para Desenvolvimento)

1. **Baixar e Instalar XAMPP**
   - Acesse: https://www.apachefriends.org/pt_br/index.html
   - Baixe a versão para Windows
   - Execute o instalador como administrador

2. **Iniciar MySQL**
   - Abra o XAMPP Control Panel
   - Clique em "Start" ao lado de MySQL
   - Verifique se o status ficou verde

3. **Criar o Banco de Dados**
   - Acesse http://localhost/phpmyadmin
   - Clique em "Databases"
   - Digite "auth_db" no campo "Database name"
   - Clique em "Create"

## Opção 2: MySQL Server Standalone

1. **Baixar MySQL Server**
   - Acesse: https://dev.mysql.com/downloads/mysql/
   - Baixe MySQL Community Server
   - Execute o instalador

2. **Configurar durante a instalação**
   - Porta: 3306 (padrão)
   - Root password: senai
   - Ou ajuste as credenciais no arquivo `.env`

## Opção 3: Docker (Avançado)

```bash
# Executar MySQL em container Docker
docker run --name mysql-auth -e MYSQL_ROOT_PASSWORD=senai -e MYSQL_DATABASE=auth_db -p 3306:3306 -d mysql:8.0

# Verificar se está rodando
docker ps
```

## Após configurar o MySQL

1. **Verificar conexão**
   ```bash
   # No terminal do projeto
   npx prisma db pull
   ```

2. **Executar migrations**
   ```bash
   npx prisma migrate dev --name add_pedidos_produtos_relation
   ```

3. **Gerar cliente Prisma**
   ```bash
   npx prisma generate
   ```

4. **Iniciar aplicação**
   ```bash
   npm run dev
   ```

## Configuração do .env (se necessário)

Crie um arquivo `.env` na raiz do projeto se as credenciais forem diferentes:

```env
DATABASE_URL="mysql://root:senai@127.0.0.1:3306/auth_db"
JWT_SECRET="seu_jwt_secret_aqui"
```

## Testando a Conexão

Após configurar o MySQL, execute:

```bash
# Testar conexão com o banco
npx prisma db pull

# Se der erro, verifique:
# 1. MySQL está rodando na porta 3306
# 2. Usuário root com senha "senai" existe
# 3. Database "auth_db" foi criada
```

## Status Atual

✅ Dependências instaladas
✅ Schema Prisma configurado com tabela de relação
❌ MySQL não está rodando
❌ Migrations pendentes

Siga as instruções acima para configurar o MySQL e depois execute as migrations.