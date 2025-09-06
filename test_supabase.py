#!/usr/bin/env python3
"""
Script para testar a conectividade com o Supabase
"""

import os
from dotenv import load_dotenv
from supabase import create_client

# Carregar variáveis de ambiente
load_dotenv()

def test_supabase_connection():
    """Testa a conexão com o Supabase"""
    
    print("🔧 Testando conectividade com Supabase...")
    
    # Configurações
    url = os.getenv("SUPABASE_URL")
    anon_key = os.getenv("SUPABASE_ANON_KEY")
    service_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    print(f"📡 URL: {url}")
    print(f"🔑 Anon Key: {anon_key[:20]}...")
    print(f"🔐 Service Key: {service_key[:20]}...")
    
    try:
        # Testar cliente com service key (admin)
        print("\n🧪 Testando cliente administrativo...")
        admin_client = create_client(url, service_key)
        
        # Testar uma operação simples
        result = admin_client.table("contas").select("*").limit(1).execute()
        print(f"✅ Conexão administrativa bem-sucedida!")
        print(f"📊 Resposta: {len(result.data) if result.data else 0} registros encontrados")
        
        # Testar cliente anônimo
        print("\n🧪 Testando cliente anônimo...")
        anon_client = create_client(url, anon_key)
        
        # Testar operação anônima (pode falhar se não houver políticas RLS configuradas)
        try:
            result = anon_client.table("contas").select("*").limit(1).execute()
            print(f"✅ Conexão anônima bem-sucedida!")
            print(f"📊 Resposta: {len(result.data) if result.data else 0} registros encontrados")
        except Exception as e:
            print(f"⚠️  Cliente anônimo limitado (normal): {str(e)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão: {str(e)}")
        return False

def list_tables():
    """Lista as tabelas disponíveis no banco"""
    
    print("\n📋 Listando tabelas do banco de dados...")
    
    url = os.getenv("SUPABASE_URL")
    service_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    try:
        client = create_client(url, service_key)
        
        # Tentar listar algumas tabelas conhecidas
        tables_to_check = [
            "contas", "categorias", "formas_pagamento", 
            "tipos_gasto", "periodicidades", "transacoes", 
            "metas", "parcelamentos"
        ]
        
        existing_tables = []
        
        for table in tables_to_check:
            try:
                result = client.table(table).select("*").limit(1).execute()
                existing_tables.append(table)
                print(f"✅ Tabela '{table}' encontrada")
            except Exception as e:
                print(f"❌ Tabela '{table}' não encontrada: {str(e)}")
        
        print(f"\n📊 Total de tabelas encontradas: {len(existing_tables)}")
        return existing_tables
        
    except Exception as e:
        print(f"❌ Erro ao listar tabelas: {str(e)}")
        return []

if __name__ == "__main__":
    print("🚀 Teste de Conectividade Supabase - Ultra Finanças\n")
    
    # Testar conexão
    if test_supabase_connection():
        # Listar tabelas
        existing_tables = list_tables()
        
        if existing_tables:
            print(f"\n🎉 Supabase configurado corretamente!")
            print(f"📁 Tabelas disponíveis: {', '.join(existing_tables)}")
        else:
            print(f"\n⚠️  Supabase conectado, mas tabelas precisam ser criadas.")
            print(f"📝 Execute o script SQL em 'supabase_setup.sql' no painel do Supabase.")
    else:
        print(f"\n❌ Falha na conexão com Supabase.")
        print(f"🔧 Verifique as credenciais no arquivo .env")