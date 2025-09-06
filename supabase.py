import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configurações do Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Cliente Supabase para operações administrativas (service role)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Cliente Supabase para operações do usuário (anon key)
supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_supabase_client(user_token=None):
    """
    Retorna o cliente Supabase apropriado.
    Se user_token for fornecido, configura o cliente para o usuário autenticado.
    """
    if user_token:
        client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        client.auth.set_session(user_token)
        return client
    return supabase_client

def get_supabase_admin():
    """
    Retorna o cliente Supabase com privilégios administrativos.
    """
    return supabase_admin

