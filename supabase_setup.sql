-- Script de configuração do banco de dados Supabase para Ultra Finanças
-- Executar no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de contas bancárias
CREATE TABLE IF NOT EXISTS contas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    logo_url TEXT,
    saldo DECIMAL(10, 2) DEFAULT 0.00,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Receita', 'Despesa')),
    cor VARCHAR(7),
    icone VARCHAR(50),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de formas de pagamento
CREATE TABLE IF NOT EXISTS formas_pagamento (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(50) NOT NULL,
    icone VARCHAR(50),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de tipos de gasto
CREATE TABLE IF NOT EXISTS tipos_gasto (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(50) NOT NULL,
    cor VARCHAR(7),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de periodicidades
CREATE TABLE IF NOT EXISTS periodicidades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(50) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de transações
CREATE TABLE IF NOT EXISTS transacoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_transacao DATE NOT NULL,
    mes_referencia INTEGER NOT NULL CHECK (mes_referencia BETWEEN 1 AND 12),
    ano_referencia INTEGER NOT NULL,
    observacoes TEXT,
    conta_id UUID REFERENCES contas(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
    forma_pagamento_id UUID REFERENCES formas_pagamento(id) ON DELETE CASCADE,
    tipo_gasto_id UUID REFERENCES tipos_gasto(id) ON DELETE SET NULL,
    periodicidade_id UUID REFERENCES periodicidades(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de metas
CREATE TABLE IF NOT EXISTS metas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    valor_objetivo DECIMAL(10, 2) NOT NULL,
    valor_atual DECIMAL(10, 2) DEFAULT 0.00,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'cancelada')),
    categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de parcelamentos
CREATE TABLE IF NOT EXISTS parcelamentos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    descricao VARCHAR(255) NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    valor_parcela DECIMAL(10, 2) NOT NULL,
    parcelas_total INTEGER NOT NULL,
    parcelas_pagas INTEGER DEFAULT 0,
    data_primeira_parcela DATE NOT NULL,
    categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
    conta_id UUID REFERENCES contas(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar RLS (Row Level Security)
ALTER TABLE contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE formas_pagamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_gasto ENABLE ROW LEVEL SECURITY;
ALTER TABLE periodicidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcelamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para contas
CREATE POLICY "Usuários podem ver suas próprias contas" ON contas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias contas" ON contas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias contas" ON contas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias contas" ON contas
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para categorias
CREATE POLICY "Usuários podem ver suas próprias categorias" ON categorias
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias categorias" ON categorias
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias categorias" ON categorias
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias categorias" ON categorias
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para formas de pagamento
CREATE POLICY "Usuários podem ver suas próprias formas de pagamento" ON formas_pagamento
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias formas de pagamento" ON formas_pagamento
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias formas de pagamento" ON formas_pagamento
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias formas de pagamento" ON formas_pagamento
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para tipos de gasto
CREATE POLICY "Usuários podem ver seus próprios tipos de gasto" ON tipos_gasto
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios tipos de gasto" ON tipos_gasto
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios tipos de gasto" ON tipos_gasto
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios tipos de gasto" ON tipos_gasto
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para periodicidades
CREATE POLICY "Usuários podem ver suas próprias periodicidades" ON periodicidades
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias periodicidades" ON periodicidades
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias periodicidades" ON periodicidades
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias periodicidades" ON periodicidades
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para transações
CREATE POLICY "Usuários podem ver suas próprias transações" ON transacoes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias transações" ON transacoes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias transações" ON transacoes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias transações" ON transacoes
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para metas
CREATE POLICY "Usuários podem ver suas próprias metas" ON metas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias metas" ON metas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias metas" ON metas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias metas" ON metas
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para parcelamentos
CREATE POLICY "Usuários podem ver seus próprios parcelamentos" ON parcelamentos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios parcelamentos" ON parcelamentos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios parcelamentos" ON parcelamentos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios parcelamentos" ON parcelamentos
    FOR DELETE USING (auth.uid() = user_id);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_contas_updated_at BEFORE UPDATE ON contas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_formas_pagamento_updated_at BEFORE UPDATE ON formas_pagamento
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tipos_gasto_updated_at BEFORE UPDATE ON tipos_gasto
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_periodicidades_updated_at BEFORE UPDATE ON periodicidades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transacoes_updated_at BEFORE UPDATE ON transacoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metas_updated_at BEFORE UPDATE ON metas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parcelamentos_updated_at BEFORE UPDATE ON parcelamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados iniciais padrão
INSERT INTO categorias (user_id, nome, tipo, icone) VALUES
(NULL, 'Vendas', 'Receita', '💰'),
(NULL, 'Investimentos', 'Receita', '📈'),
(NULL, 'Outras Receitas', 'Receita', '💵'),
(NULL, 'Salário', 'Receita', '💼'),
(NULL, 'Água', 'Despesa', '💧'),
(NULL, 'Luz', 'Despesa', '💡'),
(NULL, 'Telefone', 'Despesa', '📞'),
(NULL, 'Internet', 'Despesa', '🌐'),
(NULL, 'Condomínio', 'Despesa', '🏢'),
(NULL, 'Streaming', 'Despesa', '📺'),
(NULL, 'Alimentação', 'Despesa', '🍽️'),
(NULL, 'Lazer', 'Despesa', '🎮'),
(NULL, 'Vestuário', 'Despesa', '👕'),
(NULL, 'Dívidas', 'Despesa', '💳'),
(NULL, 'Mercado', 'Despesa', '🛒'),
(NULL, 'Outras Despesas', 'Despesa', '📋')
ON CONFLICT DO NOTHING;

INSERT INTO formas_pagamento (user_id, nome, icone) VALUES
(NULL, 'Pix', '📱'),
(NULL, 'Crédito', '💳'),
(NULL, 'Débito', '💰'),
(NULL, 'Boleto', '📄'),
(NULL, 'Transferência', '🏦')
ON CONFLICT DO NOTHING;

INSERT INTO tipos_gasto (user_id, nome) VALUES
(NULL, 'Essencial'),
(NULL, 'Não Essencial'),
(NULL, 'Investimento')
ON CONFLICT DO NOTHING;

INSERT INTO periodicidades (user_id, nome) VALUES
(NULL, 'Fixo'),
(NULL, 'Variável')
ON CONFLICT DO NOTHING;

