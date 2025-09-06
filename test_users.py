#!/usr/bin/env python3
"""
Script para verificar e criar usuários de teste
"""

import os
from dotenv import load_dotenv
from supabase import create_client
import uuid

# Carregar variáveis de ambiente
load_dotenv()

def check_and_create_test_user():
    """Verifica se existe usuário de teste e cria se necessário"""
    
    url = os.getenv("SUPABASE_URL")
    service_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    try:
        client = create_client(url, service_key)
        
        test_user_id = "550e8400-e29b-41d4-a716-446655440000"
        
        # Verificar se usuário existe na tabela auth.users (do Supabase Auth)
        print("🔍 Verificando usuário de teste...")
        
        # Tentar buscar na tabela users (se existir)
        try:
            result = client.table("users").select("*").eq('id', test_user_id).execute()
            if result.data:
                print("✅ Usuário de teste já existe!")
                return True
            else:
                print("❌ Usuário não encontrado na tabela users")
        except Exception as e:
            print(f"⚠️  Tabela users não encontrada ou erro: {str(e)}")
        
        # Criar usuário de teste na tabela users (se a tabela existir)
        try:
            user_data = {
                "id": test_user_id,
                "email": "teste@ultrafinancas.com",
                "created_at": "2025-01-15T10:00:00Z"
            }
            
            result = client.table("users").insert(user_data).execute()
            if result.data:
                print("✅ Usuário de teste criado com sucesso!")
                return True
            else:
                print("❌ Falha ao criar usuário de teste")
                return False
                
        except Exception as e:
            print(f"❌ Erro ao criar usuário: {str(e)}")
            
            # Se falhou, pode ser que não exista tabela users
            # Vamos tentar criar uma conta diretamente
            print("🔄 Tentando criar conta sem usuário...")
            return create_test_account_without_user()
            
    except Exception as e:
        print(f"❌ Erro geral: {str(e)}")
        return False

def create_test_account_without_user():
    """Cria uma conta de teste sem referência de usuário"""
    
    url = os.getenv("SUPABASE_URL")
    service_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    try:
        client = create_client(url, service_key)
        
        # Criar conta sem user_id
        conta_data = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "nome": "Conta Teste",
            "saldo": 0.00,
            "ativo": True,
            "user_id": None  # Sem referência de usuário
        }
        
        result = client.table("contas").insert(conta_data).execute()
        if result.data:
            print("✅ Conta de teste criada sem usuário!")
            return True
        else:
            print("❌ Falha ao criar conta de teste")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao criar conta: {str(e)}")
        return False

def list_existing_users():
    """Lista usuários existentes"""
    
    url = os.getenv("SUPABASE_URL")
    service_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    try:
        client = create_client(url, service_key)
        
        print("👥 Listando usuários existentes...")
        
        # Tentar listar da tabela users
        try:
            result = client.table("users").select("id, email, created_at").limit(10).execute()
            if result.data:
                print(f"📊 Encontrados {len(result.data)} usuários:")
                for user in result.data:
                    print(f"  - {user.get('email', 'sem email')} ({user.get('id', 'sem id')})")
            else:
                print("📊 Nenhum usuário encontrado na tabela users")
        except Exception as e:
            print(f"⚠️  Erro ao listar usuários: {str(e)}")
            
    except Exception as e:
        print(f"❌ Erro geral: {str(e)}")

if __name__ == "__main__":
    print("👤 Verificação de Usuários - Ultra Finanças\n")
    
    list_existing_users()
    check_and_create_test_user()