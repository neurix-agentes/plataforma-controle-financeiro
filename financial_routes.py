from flask import Blueprint, request, jsonify, g
from supabase_models import (
    Conta, Categoria, FormaPagamento, TipoGasto, 
    Periodicidade, Transacao, Meta, Parcelamento
)
from datetime import datetime, date
import calendar

financial_bp = Blueprint("financial", __name__)

def get_user_token():
    """Extrai o token do usuário do header Authorization"""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    return None

def get_user_id():
    """Obtém o ID do usuário autenticado"""
    # Por enquanto, retorna um UUID fixo válido para teste
    # Em produção, isso deve ser extraído do token JWT
    return "550e8400-e29b-41d4-a716-446655440000"

# Rotas para Contas
@financial_bp.route("/contas", methods=["GET"])
def get_contas():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        conta_model = Conta(user_token)
        contas = conta_model.get_all(user_id)
        return jsonify(contas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/contas", methods=["POST"])
def create_conta():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        data = request.get_json()
        data["user_id"] = user_id
        
        conta_model = Conta(user_token)
        conta = conta_model.create(data)
        return jsonify(conta), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rotas para Categorias
@financial_bp.route("/categorias", methods=["GET"])
def get_categorias():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        tipo = request.args.get("tipo")
        
        categoria_model = Categoria(user_token)
        categorias = categoria_model.get_all(user_id, tipo)
        return jsonify(categorias), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/categorias", methods=["POST"])
def create_categoria():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        data = request.get_json()
        data["user_id"] = user_id
        
        categoria_model = Categoria(user_token)
        categoria = categoria_model.create(data)
        return jsonify(categoria), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rotas para Formas de Pagamento
@financial_bp.route("/formas-pagamento", methods=["GET"])
def get_formas_pagamento():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        
        forma_pagamento_model = FormaPagamento(user_token)
        formas = forma_pagamento_model.get_all(user_id)
        return jsonify(formas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/formas-pagamento", methods=["POST"])
def create_forma_pagamento():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        data = request.get_json()
        data["user_id"] = user_id
        
        forma_pagamento_model = FormaPagamento(user_token)
        forma = forma_pagamento_model.create(data)
        return jsonify(forma), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rotas para Tipos de Gasto
@financial_bp.route("/tipos-gasto", methods=["GET"])
def get_tipos_gasto():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        
        tipo_gasto_model = TipoGasto(user_token)
        tipos = tipo_gasto_model.get_all(user_id)
        return jsonify(tipos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/tipos-gasto", methods=["POST"])
def create_tipo_gasto():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        data = request.get_json()
        data["user_id"] = user_id
        
        tipo_gasto_model = TipoGasto(user_token)
        tipo = tipo_gasto_model.create(data)
        return jsonify(tipo), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rotas para Periodicidades
@financial_bp.route("/periodicidades", methods=["GET"])
def get_periodicidades():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        
        periodicidade_model = Periodicidade(user_token)
        periodicidades = periodicidade_model.get_all(user_id)
        return jsonify(periodicidades), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/periodicidades", methods=["POST"])
def create_periodicidade():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        data = request.get_json()
        data["user_id"] = user_id
        
        periodicidade_model = Periodicidade(user_token)
        periodicidade = periodicidade_model.create(data)
        return jsonify(periodicidade), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rotas para Transações
@financial_bp.route("/transacoes", methods=["GET"])
def get_transacoes():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        mes = request.args.get("mes", type=int)
        ano = request.args.get("ano", type=int)
        
        transacao_model = Transacao(user_token)
        transacoes = transacao_model.get_all(user_id, mes, ano)
        return jsonify(transacoes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/transacoes", methods=["POST"])
def create_transacao():
    try:
        user_token = get_user_token()
        data = request.get_json()
        # Por enquanto, não exigir user_id para testes
        # data["user_id"] = get_user_id()
        
        # Extrair mês e ano da data da transação
        data_transacao = datetime.strptime(data["data_transacao"], "%Y-%m-%d").date()
        data["mes_referencia"] = data_transacao.month
        data["ano_referencia"] = data_transacao.year
        
        transacao_model = Transacao(user_token)
        transacao = transacao_model.create(data)
        return jsonify(transacao), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/transacoes/<transacao_id>", methods=["PUT"])
def update_transacao(transacao_id):
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        data = request.get_json()
        
        # Atualizar mês e ano se a data foi alterada
        if "data_transacao" in data:
            data_transacao = datetime.strptime(data["data_transacao"], "%Y-%m-%d").date()
            data["mes_referencia"] = data_transacao.month
            data["ano_referencia"] = data_transacao.year
        
        transacao_model = Transacao(user_token)
        transacao = transacao_model.update(transacao_id, data, user_id)
        return jsonify(transacao), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/transacoes/<transacao_id>", methods=["DELETE"])
def delete_transacao(transacao_id):
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        
        transacao_model = Transacao(user_token)
        transacao_model.delete(transacao_id, user_id)
        return jsonify({"message": "Transação excluída com sucesso"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rotas para Metas
@financial_bp.route("/metas", methods=["GET"])
def get_metas():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        
        meta_model = Meta(user_token)
        metas = meta_model.get_all(user_id)
        return jsonify(metas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/metas", methods=["POST"])
def create_meta():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        data = request.get_json()
        data["user_id"] = user_id
        
        meta_model = Meta(user_token)
        meta = meta_model.create(data)
        return jsonify(meta), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rotas para Parcelamentos
@financial_bp.route("/parcelamentos", methods=["GET"])
def get_parcelamentos():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        
        parcelamento_model = Parcelamento(user_token)
        parcelamentos = parcelamento_model.get_all(user_id)
        return jsonify(parcelamentos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/parcelamentos", methods=["POST"])
def create_parcelamento():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        data = request.get_json()
        data["user_id"] = user_id
        
        # Calcular valor da parcela
        data["valor_parcela"] = float(data["valor_total"]) / int(data["parcelas_total"])
        
        parcelamento_model = Parcelamento(user_token)
        parcelamento = parcelamento_model.create(data)
        return jsonify(parcelamento), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rotas para Dashboard e Relatórios
@financial_bp.route("/dashboard", methods=["GET"])
def get_dashboard_data():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        mes = request.args.get("mes", type=int, default=datetime.now().month)
        ano = request.args.get("ano", type=int, default=datetime.now().year)
        
        transacao_model = Transacao(user_token)
        conta_model = Conta(user_token)
        
        # Buscar transações do mês
        transacoes = transacao_model.get_all(user_id, mes, ano)
        contas = conta_model.get_all(user_id)
        
        # Calcular totais
        entradas = sum(t["valor"] for t in transacoes if t["tipo"] == "entrada")
        saidas = sum(t["valor"] for t in transacoes if t["tipo"] == "saida")
        saldo_total = sum(c["saldo"] for c in contas)
        resultado_mensal = entradas - saidas
        
        dashboard_data = {
            "saldo_total": saldo_total,
            "entradas_mes": entradas,
            "saidas_mes": saidas,
            "resultado_mensal": resultado_mensal,
            "transacoes_recentes": transacoes[:10],
            "total_transacoes": len(transacoes)
        }
        
        return jsonify(dashboard_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/balanco-mensal", methods=["GET"])
def get_balanco_mensal():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        ano = request.args.get("ano", type=int, default=datetime.now().year)
        
        transacao_model = Transacao(user_token)
        
        balanco = []
        for mes in range(1, 13):
            transacoes = transacao_model.get_all(user_id, mes, ano)
            entradas = sum(t["valor"] for t in transacoes if t["tipo"] == "entrada")
            saidas = sum(t["valor"] for t in transacoes if t["tipo"] == "saida")
            
            balanco.append({
                "mes": mes,
                "mes_nome": calendar.month_name[mes],
                "entradas": entradas,
                "saidas": saidas,
                "resultado": entradas - saidas
            })
        
        return jsonify(balanco), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rotas de resumo por categoria, forma de pagamento, etc.
@financial_bp.route("/categorias-resumo", methods=["GET"])
def get_categorias_resumo():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        mes = request.args.get("mes", type=int)
        ano = request.args.get("ano", type=int)
        tipo = request.args.get("tipo")
        
        transacao_model = Transacao(user_token)
        transacoes = transacao_model.get_all(user_id, mes, ano)
        
        if tipo:
            transacoes = [t for t in transacoes if t["tipo"] == tipo]
        
        # Agrupar por categoria
        resumo = {}
        for transacao in transacoes:
            categoria = transacao.get("categoria", "Sem categoria")
            if categoria not in resumo:
                resumo[categoria] = 0
            resumo[categoria] += transacao["valor"]
        
        resultado = [{"categoria": k, "total": v} for k, v in resumo.items()]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/forma-pagamento-resumo", methods=["GET"])
def get_forma_pagamento_resumo():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        mes = request.args.get("mes", type=int)
        ano = request.args.get("ano", type=int)
        
        transacao_model = Transacao(user_token)
        transacoes = transacao_model.get_all(user_id, mes, ano)
        
        # Agrupar por forma de pagamento
        resumo = {}
        for transacao in transacoes:
            forma = transacao.get("forma_pagamento", "Sem forma")
            if forma not in resumo:
                resumo[forma] = 0
            resumo[forma] += transacao["valor"]
        
        resultado = [{"forma_pagamento": k, "total": v} for k, v in resumo.items()]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/tipo-gasto-resumo", methods=["GET"])
def get_tipo_gasto_resumo():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        mes = request.args.get("mes", type=int)
        ano = request.args.get("ano", type=int)
        
        transacao_model = Transacao(user_token)
        transacoes = transacao_model.get_all(user_id, mes, ano)
        
        # Filtrar apenas saídas
        transacoes = [t for t in transacoes if t["tipo"] == "saida"]
        
        # Agrupar por tipo de gasto
        resumo = {}
        for transacao in transacoes:
            tipo = transacao.get("tipo_gasto", "Sem tipo")
            if tipo not in resumo:
                resumo[tipo] = 0
            resumo[tipo] += transacao["valor"]
        
        resultado = [{"tipo_gasto": k, "total": v} for k, v in resumo.items()]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@financial_bp.route("/periodicidade-resumo", methods=["GET"])
def get_periodicidade_resumo():
    try:
        user_id = get_user_id()
        user_token = get_user_token()
        mes = request.args.get("mes", type=int)
        ano = request.args.get("ano", type=int)
        
        transacao_model = Transacao(user_token)
        transacoes = transacao_model.get_all(user_id, mes, ano)
        
        # Agrupar por periodicidade
        resumo = {}
        for transacao in transacoes:
            periodicidade = transacao.get("periodicidade", "Sem periodicidade")
            if periodicidade not in resumo:
                resumo[periodicidade] = 0
            resumo[periodicidade] += transacao["valor"]
        
        resultado = [{"periodicidade": k, "total": v} for k, v in resumo.items()]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500