# Estágio 1: Build da Aplicação

# 1. Define a imagem de origem base 
FROM node:20-alpine AS builder

# instalção do pnpm globalmente para gerenciar as dependências
RUN corepack enable && corepack prepare pnpm@latest --activate

# 2. Define diretório de trabalho interno do container
WORKDIR /app

# Copia dos manifestos de dependências do backend para o diretório de trabalho do container
COPY package.json pnpm-lock.yaml ./

# instalação de todas  as dependencias (incluindo devDependencies) do backend
RUN pnpm install --frozen-lockfile

# cópia do código-fonte e da configuração do typescript para o diretório de trabalho do container
COPY tsconfig.json ./
COPY src ./src

# compilação do TypeScript para JavaScript, gerando os arquivos de saída no diretório dist
RUN pnpm run build

# remoção das dependências de desenvolvimento para otimizar o tamanho da imagem final
RUN pnpm prune --prod

# Estágio 2: Criação da Imagem Final

FROM node:20-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile --prod

EXPOSE 3000

CMD ["node", "dist/index.js"]   
