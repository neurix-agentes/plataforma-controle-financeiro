# 🚀 Deploy Ultra Finanças no Vercel

## 📋 Pré-requisitos

1. ✅ Conta no [Vercel](https://vercel.com)
2. ✅ Projeto no GitHub
3. ✅ Credenciais do Supabase

## 🔧 Passos para Deploy

### 1. Preparar o Repositório GitHub

```bash
# Adicionar todos os arquivos
git add .

# Commit das mudanças
git commit -m "Preparar para deploy no Vercel"

# Push para o GitHub
git push origin main
```

### 2. Configurar no Vercel

1. **Acesse:** [vercel.com](https://vercel.com)
2. **Clique:** "New Project"
3. **Importe:** Seu repositório do GitHub
4. **Configure as variáveis de ambiente:**

#### Variáveis de Ambiente Obrigatórias:

```
SUPABASE_URL=https://tvvvxiuhegatrsaxhibd.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dnZ4aXVoZWdhdHJzYXhoaWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MzA0MTMsImV4cCI6MjA3MjUwNjQxM30.FAxzOWWIloVJSlkGTgVDjBuKiOXiRjkvb8N6AtlfrPE
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dnZ4aXVoZWdhdHJzYXhoaWJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjkzMDQxMywiZXhwIjoyMDcyNTA2NDEzfQ.JP5zDQAscjtj476Z8qA0YjJtWMq7aOHeiZnmCse6GW4
FLASK_DEBUG=False
```

### 3. Deploy Automático

- O Vercel detectará automaticamente o `vercel.json`
- O deploy será iniciado automaticamente
- Em poucos minutos, sua aplicação estará online!

## 🌐 URLs Após Deploy

Após o deploy, você terá:

- **🏠 Interface Principal:** `https://seu-projeto.vercel.app`
- **🔧 API Endpoints:** `https://seu-projeto.vercel.app/api/*`

### Endpoints Disponíveis:

```
GET  /api/dashboard
GET  /api/transacoes
POST /api/transacoes
GET  /api/categorias
GET  /api/formas-pagamento
GET  /api/contas
GET  /api/categorias-resumo
GET  /api/balanco-mensal
```

## ✅ Teste da Aplicação

1. Acesse a URL fornecida pelo Vercel
2. A interface de teste carregará automaticamente
3. Clique em "📅 Janeiro 2025" para ver dados de exemplo
4. Use os botões para testar as funcionalidades

## 🔧 Comandos Úteis

### Testar Localmente (Simulando Vercel):
```bash
# Instalar Vercel CLI
npm i -g vercel

# Executar localmente
vercel dev
```

### Redeploy Manual:
```bash
# Na pasta do projeto
vercel --prod
```

## 🐛 Troubleshooting

### Erro de Import:
- Verifique se todos os arquivos Python estão na raiz
- Confirme se o `PYTHONPATH` está configurado

### Erro de Supabase:
- Verifique as variáveis de ambiente
- Teste a conectividade com as credenciais

### Timeout:
- Aumente o `maxDuration` no `vercel.json` se necessário

## 📞 Suporte

Se houver problemas:
1. Verifique os logs no dashboard do Vercel
2. Confirme as variáveis de ambiente
3. Teste os endpoints individualmente

**🎉 Após seguir estes passos, sua aplicação estará online e acessível via navegador!**