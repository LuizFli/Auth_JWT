# ----------- Estágio de desenvolvimento -----------
FROM node:20 AS dev

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Rodando em modo desenvolvimento (hot reload, arquivos montados)
CMD [ "npm", "run", "dev" ]

# ----------- Estágio de produção -----------
FROM node:20 AS prod

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Compila o TypeScript para produção
RUN npm run build

EXPOSE 3000

# Rodando o build já compilado
CMD [ "npm", "start" ]