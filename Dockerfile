FROM node:24-bookworm-slim

# Dependências nativas para better-sqlite3 e next build
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    openssl \
    ca-certificates \
    libsqlite3-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instala dependências (postinstall roda prisma generate)
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do código e faz o build
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Railway injeta PORT; start:railway aplica migrations + seed + next start
CMD ["npm", "run", "start:railway"]
