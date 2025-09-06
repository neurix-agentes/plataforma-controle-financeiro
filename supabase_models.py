from datetime import datetime, date
from typing import Optional, Dict, Any
from supabase_config import get_supabase_admin, get_supabase_client
import uuid

class SupabaseModel:
    """Classe base para modelos que interagem com Supabase"""
    
    def __init__(self, user_token=None):
        self.client = get_supabase_client(user_token) if user_token else get_supabase_admin()
    
    def to_dict(self):
        """Converte o objeto para dicionário"""
        return {k: v for k, v in self.__dict__.items() if not k.startswith('_') and k != 'client'}

class Conta:
    def __init__(self, user_token=None):
        self.client = get_supabase_client(user_token) if user_token else get_supabase_admin()
        self.table_name = 'contas'
    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Criar nova conta"""
        try:
            result = self.client.table(self.table_name).insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao criar conta: {str(e)}")
    
    def get_all(self, user_id: str) -> list:
        """Buscar todas as contas do usuário"""
        try:
            result = self.client.table(self.table_name).select("*").eq('user_id', user_id).eq('ativo', True).execute()
            return result.data
        except Exception as e:
            raise Exception(f"Erro ao buscar contas: {str(e)}")
    
    def get_by_id(self, conta_id: str, user_id: str) -> Dict[str, Any]:
        """Buscar conta por ID"""
        try:
            result = self.client.table(self.table_name).select("*").eq('id', conta_id).eq('user_id', user_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao buscar conta: {str(e)}")
    
    def update(self, conta_id: str, data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Atualizar conta"""
        try:
            result = self.client.table(self.table_name).update(data).eq('id', conta_id).eq('user_id', user_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao atualizar conta: {str(e)}")
    
    def delete(self, conta_id: str, user_id: str) -> bool:
        """Deletar conta (soft delete)"""
        try:
            self.client.table(self.table_name).update({'ativo': False}).eq('id', conta_id).eq('user_id', user_id).execute()
            return True
        except Exception as e:
            raise Exception(f"Erro ao deletar conta: {str(e)}")

class Categoria:
    def __init__(self, user_token=None):
        self.client = get_supabase_client(user_token) if user_token else get_supabase_admin()
        self.table_name = 'categorias'
    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Criar nova categoria"""
        try:
            result = self.client.table(self.table_name).insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao criar categoria: {str(e)}")
    
    def get_all(self, user_id: str, tipo: str = None) -> list:
        """Buscar todas as categorias do usuário"""
        try:
            # Simplificando: buscar apenas categorias sem user_id (padrão) por enquanto
            query = self.client.table(self.table_name).select("*").eq('ativo', True).is_('user_id', 'null')
            
            if tipo:
                query = query.eq('tipo', tipo)
            
            result = query.execute()
            return result.data
        except Exception as e:
            raise Exception(f"Erro ao buscar categorias: {str(e)}")
    
    def get_by_id(self, categoria_id: str, user_id: str) -> Dict[str, Any]:
        """Buscar categoria por ID"""
        try:
            result = self.client.table(self.table_name).select("*").eq('id', categoria_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao buscar categoria: {str(e)}")
    
    def update(self, categoria_id: str, data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Atualizar categoria"""
        try:
            result = self.client.table(self.table_name).update(data).eq('id', categoria_id).eq('user_id', user_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao atualizar categoria: {str(e)}")
    
    def delete(self, categoria_id: str, user_id: str) -> bool:
        """Deletar categoria (soft delete)"""
        try:
            self.client.table(self.table_name).update({'ativo': False}).eq('id', categoria_id).eq('user_id', user_id).execute()
            return True
        except Exception as e:
            raise Exception(f"Erro ao deletar categoria: {str(e)}")

class FormaPagamento:
    def __init__(self, user_token=None):
        self.client = get_supabase_client(user_token) if user_token else get_supabase_admin()
        self.table_name = 'formas_pagamento'
    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Criar nova forma de pagamento"""
        try:
            result = self.client.table(self.table_name).insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao criar forma de pagamento: {str(e)}")
    
    def get_all(self, user_id: str) -> list:
        """Buscar todas as formas de pagamento do usuário"""
        try:
            result = self.client.table(self.table_name).select("*").eq('ativo', True).is_('user_id', 'null').execute()
            return result.data
        except Exception as e:
            raise Exception(f"Erro ao buscar formas de pagamento: {str(e)}")

class TipoGasto:
    def __init__(self, user_token=None):
        self.client = get_supabase_client(user_token) if user_token else get_supabase_admin()
        self.table_name = 'tipos_gasto'
    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Criar novo tipo de gasto"""
        try:
            result = self.client.table(self.table_name).insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao criar tipo de gasto: {str(e)}")
    
    def get_all(self, user_id: str) -> list:
        """Buscar todos os tipos de gasto do usuário"""
        try:
            result = self.client.table(self.table_name).select("*").eq('ativo', True).is_('user_id', 'null').execute()
            return result.data
        except Exception as e:
            raise Exception(f"Erro ao buscar tipos de gasto: {str(e)}")

class Periodicidade:
    def __init__(self, user_token=None):
        self.client = get_supabase_client(user_token) if user_token else get_supabase_admin()
        self.table_name = 'periodicidades'
    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Criar nova periodicidade"""
        try:
            result = self.client.table(self.table_name).insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao criar periodicidade: {str(e)}")
    
    def get_all(self, user_id: str) -> list:
        """Buscar todas as periodicidades do usuário"""
        try:
            result = self.client.table(self.table_name).select("*").eq('ativo', True).is_('user_id', 'null').execute()
            return result.data
        except Exception as e:
            raise Exception(f"Erro ao buscar periodicidades: {str(e)}")

class Transacao:
    def __init__(self, user_token=None):
        self.client = get_supabase_client(user_token) if user_token else get_supabase_admin()
        self.table_name = 'transacoes'
    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Criar nova transação"""
        try:
            result = self.client.table(self.table_name).insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao criar transação: {str(e)}")
    
    def get_all(self, user_id: str = None, mes: int = None, ano: int = None) -> list:
        """Buscar todas as transações do usuário"""
        try:
            query = self.client.table(self.table_name).select("*")
            
            # Por enquanto, buscar todas as transações (para testes)
            # if user_id:
            #     query = query.eq('user_id', user_id)
            
            if mes:
                query = query.eq('mes_referencia', mes)
            if ano:
                query = query.eq('ano_referencia', ano)
            
            result = query.order('data_transacao', desc=True).execute()
            return result.data
        except Exception as e:
            raise Exception(f"Erro ao buscar transações: {str(e)}")
    
    def get_by_id(self, transacao_id: str, user_id: str) -> Dict[str, Any]:
        """Buscar transação por ID"""
        try:
            result = self.client.table(self.table_name).select("*").eq('id', transacao_id).eq('user_id', user_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao buscar transação: {str(e)}")
    
    def update(self, transacao_id: str, data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Atualizar transação"""
        try:
            result = self.client.table(self.table_name).update(data).eq('id', transacao_id).eq('user_id', user_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao atualizar transação: {str(e)}")
    
    def delete(self, transacao_id: str, user_id: str) -> bool:
        """Deletar transação"""
        try:
            self.client.table(self.table_name).delete().eq('id', transacao_id).eq('user_id', user_id).execute()
            return True
        except Exception as e:
            raise Exception(f"Erro ao deletar transação: {str(e)}")

class Meta:
    def __init__(self, user_token=None):
        self.client = get_supabase_client(user_token) if user_token else get_supabase_admin()
        self.table_name = 'metas'
    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Criar nova meta"""
        try:
            result = self.client.table(self.table_name).insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao criar meta: {str(e)}")
    
    def get_all(self, user_id: str) -> list:
        """Buscar todas as metas do usuário"""
        try:
            result = self.client.table(self.table_name).select("*").eq('user_id', user_id).execute()
            return result.data
        except Exception as e:
            raise Exception(f"Erro ao buscar metas: {str(e)}")

class Parcelamento:
    def __init__(self, user_token=None):
        self.client = get_supabase_client(user_token) if user_token else get_supabase_admin()
        self.table_name = 'parcelamentos'
    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Criar novo parcelamento"""
        try:
            result = self.client.table(self.table_name).insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Erro ao criar parcelamento: {str(e)}")
    
    def get_all(self, user_id: str) -> list:
        """Buscar todos os parcelamentos do usuário"""
        try:
            result = self.client.table(self.table_name).select("*").eq('user_id', user_id).execute()
            return result.data
        except Exception as e:
            raise Exception(f"Erro ao buscar parcelamentos: {str(e)}")

# Classe para autenticação
class Auth:
    def __init__(self):
        self.client = get_supabase_client()
    
    def sign_up(self, email: str, password: str) -> Dict[str, Any]:
        """Registrar novo usuário"""
        try:
            result = self.client.auth.sign_up({
                "email": email,
                "password": password
            })
            return result
        except Exception as e:
            raise Exception(f"Erro ao registrar usuário: {str(e)}")
    
    def sign_in(self, email: str, password: str) -> Dict[str, Any]:
        """Fazer login"""
        try:
            result = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            return result
        except Exception as e:
            raise Exception(f"Erro ao fazer login: {str(e)}")
    
    def sign_out(self) -> bool:
        """Fazer logout"""
        try:
            self.client.auth.sign_out()
            return True
        except Exception as e:
            raise Exception(f"Erro ao fazer logout: {str(e)}")
    
    def get_user(self, token: str) -> Dict[str, Any]:
        """Obter dados do usuário autenticado"""
        try:
            client = get_supabase_client()
            client.auth.set_session(token)
            user = client.auth.get_user()
            return user
        except Exception as e:
            raise Exception(f"Erro ao obter usuário: {str(e)}")

