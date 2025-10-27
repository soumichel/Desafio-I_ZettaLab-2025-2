#!/bin/bash

# Script de build para Vercel com substituição de variáveis de ambiente
# Substitui a chave vazia pela variável de ambiente TRANSPARENCIA_API_KEY

# Backup do arquivo original
cp src/environments/environment.ts src/environments/environment.ts.bak

# Substitui a chave vazia pela variável de ambiente
if [ ! -z "$TRANSPARENCIA_API_KEY" ]; then
  sed -i "s/transparenciaApiKey: ''/transparenciaApiKey: '$TRANSPARENCIA_API_KEY'/g" src/environments/environment.ts
fi

# Executa o build
npm run build

# Restaura o arquivo original
mv src/environments/environment.ts.bak src/environments/environment.ts
