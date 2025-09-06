const API_BASE_URL = '/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Contas
  async getContas() {
    return this.request('/contas')
  }

  async createConta(conta) {
    return this.request('/contas', {
      method: 'POST',
      body: conta,
    })
  }

  // Categorias
  async getCategorias(tipo = null) {
    const query = tipo ? `?tipo=${tipo}` : ''
    return this.request(`/categorias${query}`)
  }

  async createCategoria(categoria) {
    return this.request('/categorias', {
      method: 'POST',
      body: categoria,
    })
  }

  // Formas de Pagamento
  async getFormasPagamento() {
    return this.request('/formas-pagamento')
  }

  async createFormaPagamento(forma) {
    return this.request('/formas-pagamento', {
      method: 'POST',
      body: forma,
    })
  }

  // Tipos de Gasto
  async getTiposGasto() {
    return this.request('/tipos-gasto')
  }

  async createTipoGasto(tipoGasto) {
    return this.request('/tipos-gasto', {
      method: 'POST',
      body: tipoGasto,
    })
  }

  // Periodicidades
  async getPeriodicidades() {
    return this.request('/periodicidades')
  }

  async createPeriodicidade(periodicidade) {
    return this.request('/periodicidades', {
      method: 'POST',
      body: periodicidade,
    })
  }

  // Transações
  async getTransacoes(filters = {}) {
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        params.append(key, filters[key])
      }
    })
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request(`/transacoes${query}`)
  }

  async createTransacao(transacao) {
    return this.request('/transacoes', {
      method: 'POST',
      body: transacao,
    })
  }

  async updateTransacao(id, transacao) {
    return this.request(`/transacoes/${id}`, {
      method: 'PUT',
      body: transacao,
    })
  }

  async deleteTransacao(id) {
    return this.request(`/transacoes/${id}`, {
      method: 'DELETE',
    })
  }

  // Relatórios
  async getBalancoMensal(ano) {
    const query = ano ? `?ano=${ano}` : ''
    return this.request(`/balanco-mensal${query}`)
  }

  async getFormaPagamentoResumo(mes, ano) {
    const params = new URLSearchParams()
    if (mes) params.append('mes', mes)
    if (ano) params.append('ano', ano)
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request(`/forma-pagamento-resumo${query}`)
  }

  async getCategoriasResumo(mes, ano, tipo) {
    const params = new URLSearchParams()
    if (mes) params.append('mes', mes)
    if (ano) params.append('ano', ano)
    if (tipo) params.append('tipo', tipo)
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request(`/categorias-resumo${query}`)
  }

  async getTipoGastoResumo(mes, ano) {
    const params = new URLSearchParams()
    if (mes) params.append('mes', mes)
    if (ano) params.append('ano', ano)
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request(`/tipo-gasto-resumo${query}`)
  }

  async getPeriodicidadeResumo(mes, ano) {
    const params = new URLSearchParams()
    if (mes) params.append('mes', mes)
    if (ano) params.append('ano', ano)
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request(`/periodicidade-resumo${query}`)
  }

  async getDashboardData(mes, ano) {
    const params = new URLSearchParams()
    if (mes) params.append('mes', mes)
    if (ano) params.append('ano', ano)
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request(`/dashboard${query}`)
  }

  // Parcelamentos
  async getParcelamentos() {
    return this.request('/parcelamentos')
  }

  async createParcelamento(parcelamento) {
    return this.request('/parcelamentos', {
      method: 'POST',
      body: parcelamento,
    })
  }

  // Metas
  async getMetas() {
    return this.request('/metas')
  }

  async createMeta(metaData) {
    return this.request('/metas', {
      method: 'POST',
      body: metaData
    })
  }

  // Seed Data
  async seedData() {
    return this.request('/seed-data', {
      method: 'POST',
    })
  }
}

export default new ApiService()

