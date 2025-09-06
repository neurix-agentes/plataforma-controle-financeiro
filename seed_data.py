from flask import Blueprint, jsonify, g, request
from supabase_models import Conta, Categoria, FormaPagamento, TipoGasto, Periodicidade

seed_bp = Blueprint("seed", __name__)

@seed_bp.route("/seed-data", methods=["POST"])
def seed_data():
    if not g.user_id:
        return jsonify({"error": "Usuário não autenticado"}), 401
    
    try:
        contas_model = Conta(user_token=request.headers.get("Authorization").split(" ")[1])
        categorias_model = Categoria(user_token=request.headers.get("Authorization").split(" ")[1])
        formas_pagamento_model = FormaPagamento(user_token=request.headers.get("Authorization").split(" ")[1])
        tipos_gasto_model = TipoGasto(user_token=request.headers.get("Authorization").split(" ")[1])
        periodicidades_model = Periodicidade(user_token=request.headers.get("Authorization").split(" ")[1])

        # Contas Bancárias
        contas_data = [
            {"nome": "Itaú", "logo_url": "/static/images/itau-logo.jpg", "saldo": 0.00, "user_id": g.user_id},
            {"nome": "Mercado Pago", "logo_url": "/static/images/mercadopago-logo.jpg", "saldo": 0.00, "user_id": g.user_id},
            {"nome": "Nubank", "logo_url": "/static/images/nubank-logo.jpg", "saldo": 0.00, "user_id": g.user_id}
        ]
        for data in contas_data:
            contas_model.create(data)
        
        # Categorias de Entrada
        categorias_entrada_data = [
            {"nome": "Vendas", "tipo": "Receita", "cor": "#10B981", "icone": "💰", "user_id": g.user_id},
            {"nome": "Investimentos", "tipo": "Receita", "cor": "#3B82F6", "icone": "📈", "user_id": g.user_id},
            {"nome": "Outras Receitas", "tipo": "Receita", "cor": "#8B5CF6", "icone": "💵", "user_id": g.user_id},
            {"nome": "Salário", "tipo": "Receita", "cor": "#F59E0B", "icone": "💼", "user_id": g.user_id}
        ]
        
        # Categorias de Saída
        categorias_saida_data = [
            {"nome": "Água", "tipo": "Despesa", "cor": "#06B6D4", "icone": "💧", "user_id": g.user_id},
            {"nome": "Luz", "tipo": "Despesa", "cor": "#F59E0B", "icone": "💡", "user_id": g.user_id},
            {"nome": "Telefone", "tipo": "Despesa", "cor": "#EF4444", "icone": "📞", "user_id": g.user_id},
            {"nome": "Internet", "tipo": "Despesa", "cor": "#8B5CF6", "icone": "🌐", "user_id": g.user_id},
            {"nome": "Condomínio", "tipo": "Despesa", "cor": "#6B7280", "icone": "🏢", "user_id": g.user_id},
            {"nome": "Streaming", "tipo": "Despesa", "cor": "#EC4899", "icone": "📺", "user_id": g.user_id},
            {"nome": "Alimentação", "tipo": "Despesa", "cor": "#10B981", "icone": "🍽️", "user_id": g.user_id},
            {"nome": "Lazer", "tipo": "Despesa", "cor": "#F97316", "icone": "🎉", "user_id": g.user_id},
            {"nome": "Vestuário", "tipo": "Despesa", "cor": "#84CC16", "icone": "👕", "user_id": g.user_id},
            {"nome": "Dívidas", "tipo": "Despesa", "cor": "#DC2626", "icone": "💳", "user_id": g.user_id},
            {"nome": "Mercado", "tipo": "Despesa", "cor": "#059669", "icone": "🛒", "user_id": g.user_id},
            {"nome": "Outras Despesas", "tipo": "Despesa", "cor": "#6B7280", "icone": "📋", "user_id": g.user_id}
        ]
        
        for data in categorias_entrada_data + categorias_saida_data:
            categorias_model.create(data)
        
        # Formas de Pagamento
        formas_pagamento_data = [
            {"nome": "Pix", "icone": "🔄", "user_id": g.user_id},
            {"nome": "Crédito", "icone": "💳", "user_id": g.user_id},
            {"nome": "Débito", "icone": "💰", "user_id": g.user_id},
            {"nome": "Boleto", "icone": "📄", "user_id": g.user_id},
            {"nome": "Transferência", "icone": "🏦", "user_id": g.user_id}
        ]
        
        for data in formas_pagamento_data:
            formas_pagamento_model.create(data)
        
        # Tipos de Gasto
        tipos_gasto_data = [
            {"nome": "Essencial", "cor": "#DC2626", "user_id": g.user_id},
            {"nome": "Não Essencial", "cor": "#F59E0B", "user_id": g.user_id},
            {"nome": "Investimento", "cor": "#10B981", "user_id": g.user_id}
        ]
        
        for data in tipos_gasto_data:
            tipos_gasto_model.create(data)
        
        # Periodicidades
        periodicidades_data = [
            {"nome": "Fixo", "user_id": g.user_id},
            {"nome": "Variável", "user_id": g.user_id}
        ]
        
        for data in periodicidades_data:
            periodicidades_model.create(data)
        
        return jsonify({"message": "Dados iniciais criados com sucesso!"}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


