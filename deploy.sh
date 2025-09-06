#!/bin/bash

echo "🚀 Preparando Deploy para Vercel - Ultra Finanças"

# Verificar se está em um repositório git
if [ ! -d ".git" ]; then
    echo "❌ Este não é um repositório Git. Inicializando..."
    git init
    git branch -M main
fi

# Verificar se há mudanças para commit
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Adicionando arquivos ao Git..."
    git add .
    
    echo "💾 Fazendo commit..."
    git commit -m "Deploy: Preparar aplicação para Vercel $(date '+%Y-%m-%d %H:%M:%S')"
    
    echo "📤 Enviando para GitHub..."
    if git remote get-url origin >/dev/null 2>&1; then
        git push origin main
        echo "✅ Push realizado com sucesso!"
    else
        echo "⚠️  Adicione o remote do GitHub:"
        echo "   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git"
        echo "   git push -u origin main"
    fi
else
    echo "✅ Não há mudanças para commit"
fi

echo ""
echo "🌐 Próximos passos:"
echo "1. Acesse: https://vercel.com"
echo "2. Clique em 'New Project'"
echo "3. Importe seu repositório GitHub"
echo "4. Configure as variáveis de ambiente:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY" 
echo "   - SUPABASE_SERVICE_KEY"
echo "   - FLASK_DEBUG=False"
echo "5. Clique em 'Deploy'"
echo ""
echo "🎉 Em poucos minutos sua aplicação estará online!"