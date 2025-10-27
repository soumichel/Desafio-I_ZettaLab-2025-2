# ============================================
# STAGE 1: Build da aplicação Angular
# ============================================
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (cache layer)
COPY package*.json ./

# Instala as dependências
RUN npm ci --legacy-peer-deps

# Copia o código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build -- --configuration production

# ============================================
# STAGE 2: Servidor Nginx para servir a aplicação
# ============================================
FROM nginx:alpine

# Copia os arquivos buildados do stage anterior
COPY --from=builder /app/dist/Desafio-I_ZettaLab-2025-2/browser /usr/share/nginx/html

# Copia configuração customizada do Nginx (para suportar rotas do Angular)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
