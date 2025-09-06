from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from decimal import Decimal

db = SQLAlchemy()

class Conta(db.Model):
    __tablename__ = 'contas'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    logo_url = db.Column(db.String(255))
    saldo = db.Column(db.Numeric(10, 2), default=0.00)
    ativo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    transacoes = db.relationship('Transacao', backref='conta', lazy=True)

class Categoria(db.Model):
    __tablename__ = 'categorias'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)  # 'entrada' ou 'saida'
    cor = db.Column(db.String(7))  # hex color
    icone = db.Column(db.String(50))
    ativo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    transacoes = db.relationship('Transacao', backref='categoria', lazy=True)

class FormaPagamento(db.Model):
    __tablename__ = 'formas_pagamento'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), nullable=False)
    icone = db.Column(db.String(50))
    ativo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    transacoes = db.relationship('Transacao', backref='forma_pagamento', lazy=True)

class TipoGasto(db.Model):
    __tablename__ = 'tipos_gasto'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), nullable=False)  # Essencial, Não Essencial, Investimento
    cor = db.Column(db.String(7))  # hex color
    ativo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    transacoes = db.relationship('Transacao', backref='tipo_gasto', lazy=True)

class Periodicidade(db.Model):
    __tablename__ = 'periodicidades'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), nullable=False)  # Fixo, Variável
    ativo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    transacoes = db.relationship('Transacao', backref='periodicidade', lazy=True)

class Transacao(db.Model):
    __tablename__ = 'transacoes'
    
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(20), nullable=False)  # 'entrada' ou 'saida'
    descricao = db.Column(db.String(255), nullable=False)
    valor = db.Column(db.Numeric(10, 2), nullable=False)
    data_transacao = db.Column(db.Date, nullable=False)
    mes_referencia = db.Column(db.Integer, nullable=False)  # 1-12
    ano_referencia = db.Column(db.Integer, nullable=False)
    observacoes = db.Column(db.Text)
    
    # Chaves estrangeiras
    conta_id = db.Column(db.Integer, db.ForeignKey('contas.id'), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)
    forma_pagamento_id = db.Column(db.Integer, db.ForeignKey('formas_pagamento.id'), nullable=False)
    tipo_gasto_id = db.Column(db.Integer, db.ForeignKey('tipos_gasto.id'))
    periodicidade_id = db.Column(db.Integer, db.ForeignKey('periodicidades.id'))
    
    # Campos de auditoria
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'tipo': self.tipo,
            'descricao': self.descricao,
            'valor': float(self.valor),
            'data_transacao': self.data_transacao.isoformat(),
            'mes_referencia': self.mes_referencia,
            'ano_referencia': self.ano_referencia,
            'observacoes': self.observacoes,
            'conta': self.conta.nome if self.conta else None,
            'categoria': self.categoria.nome if self.categoria else None,
            'forma_pagamento': self.forma_pagamento.nome if self.forma_pagamento else None,
            'tipo_gasto': self.tipo_gasto.nome if self.tipo_gasto else None,
            'periodicidade': self.periodicidade.nome if self.periodicidade else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Meta(db.Model):
    __tablename__ = 'metas'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.Text)
    valor_objetivo = db.Column(db.Numeric(10, 2), nullable=False)
    valor_atual = db.Column(db.Numeric(10, 2), default=0.00)
    data_inicio = db.Column(db.Date, nullable=False)
    data_fim = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='ativa')  # ativa, concluida, cancelada
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    categoria = db.relationship('Categoria', backref='metas')
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'valor_objetivo': float(self.valor_objetivo),
            'valor_atual': float(self.valor_atual),
            'data_inicio': self.data_inicio.isoformat(),
            'data_fim': self.data_fim.isoformat(),
            'status': self.status,
            'categoria': self.categoria.nome if self.categoria else None,
            'progresso': float((self.valor_atual / self.valor_objetivo) * 100) if self.valor_objetivo > 0 else 0,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Parcelamento(db.Model):
    __tablename__ = 'parcelamentos'
    
    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(255), nullable=False)
    valor_total = db.Column(db.Numeric(10, 2), nullable=False)
    valor_parcela = db.Column(db.Numeric(10, 2), nullable=False)
    parcelas_total = db.Column(db.Integer, nullable=False)
    parcelas_pagas = db.Column(db.Integer, default=0)
    data_primeira_parcela = db.Column(db.Date, nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)
    conta_id = db.Column(db.Integer, db.ForeignKey('contas.id'), nullable=False)
    status = db.Column(db.String(20), default='ativo')  # ativo, concluido, cancelado
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    categoria = db.relationship('Categoria', backref='parcelamentos')
    conta = db.relationship('Conta', backref='parcelamentos')
    
    def to_dict(self):
        return {
            'id': self.id,
            'descricao': self.descricao,
            'valor_total': float(self.valor_total),
            'valor_parcela': float(self.valor_parcela),
            'parcelas_total': self.parcelas_total,
            'parcelas_pagas': self.parcelas_pagas,
            'parcelas_restantes': self.parcelas_total - self.parcelas_pagas,
            'data_primeira_parcela': self.data_primeira_parcela.isoformat(),
            'categoria': self.categoria.nome if self.categoria else None,
            'conta': self.conta.nome if self.conta else None,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

