#!/bin/bash

# Script para inicializar o ambiente de desenvolvimento

echo "🚀 Iniciando Ultra Finanças - Ambiente de Desenvolvimento"

# Verificar se o ambiente virtual existe
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativar ambiente virtual
echo "🔧 Ativando ambiente virtual..."
source venv/bin/activate

# Instalar dependências se necessário
if [ ! -f "venv/pyvenv.cfg" ] || [ ! -d "venv/lib/python*/site-packages/flask" ]; then
    echo "📥 Instalando dependências Python..."
    pip install -r requirements.txt
fi

# Verificar se existe arquivo .env
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando exemplo..."
    cp .env.example .env
    echo "✏️  Configure as variáveis de ambiente no arquivo .env"
fi

echo "✅ Ambiente configurado!"
echo "🌐 Para iniciar o servidor: python3 main.py"
echo "📝 Para popular dados iniciais: POST /api/seed-data"