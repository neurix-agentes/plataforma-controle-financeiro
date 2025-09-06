import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, Plus, Trash2, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import apiService from '../services/api'
import AddItemModal from '../components/AddItemModal'

export default function Lancamentos() {
  const [formData, setFormData] = useState({
    tipo: '',
    descricao: '',
    valor: '',
    data_transacao: new Date(),
    conta_id: '',
    categoria_id: '',
    forma_pagamento_id: '',
    tipo_gasto_id: '',
    periodicidade_id: '',
    observacoes: ''
  })

  const [contas, setContas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [formasPagamento, setFormasPagamento] = useState([])
  const [tiposGasto, setTiposGasto] = useState([])
  const [periodicidades, setPeriodicidades] = useState([])
  const [transacoes, setTransacoes] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Estados para modais de adicionar novos itens
  const [modalState, setModalState] = useState({
    conta: false,
    categoria: false,
    forma_pagamento: false,
    tipo_gasto: false,
    periodicidade: false
  })

  useEffect(() => {
    loadInitialData()
    loadTransacoes()
  }, [])

  const loadInitialData = async () => {
    try {
      const [contasData, formasData, tiposData, periodicidadesData] = await Promise.all([
        apiService.getContas(),
        apiService.getFormasPagamento(),
        apiService.getTiposGasto(),
        apiService.getPeriodicidades()
      ])

      setContas(contasData)
      setFormasPagamento(formasData)
      setTiposGasto(tiposData)
      setPeriodicidades(periodicidadesData)
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error)
    }
  }

  const loadCategorias = async (tipo) => {
    try {
      const categoriasData = await apiService.getCategorias(tipo)
      setCategorias(categoriasData)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const loadTransacoes = async () => {
    try {
      const currentDate = new Date()
      const transacoesData = await apiService.getTransacoes({
        mes: currentDate.getMonth() + 1,
        ano: currentDate.getFullYear()
      })
      setTransacoes(transacoesData)
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
    }
  }

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Carregar categorias quando o tipo for selecionado
    if (name === 'tipo' && value) {
      loadCategorias(value)
      // Limpar categoria selecionada
      setFormData(prev => ({
        ...prev,
        categoria_id: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const transacaoData = {
        ...formData,
        valor: parseFloat(formData.valor),
        data_transacao: format(formData.data_transacao, 'yyyy-MM-dd'),
        conta_id: parseInt(formData.conta_id),
        categoria_id: parseInt(formData.categoria_id),
        forma_pagamento_id: parseInt(formData.forma_pagamento_id),
        tipo_gasto_id: formData.tipo_gasto_id ? parseInt(formData.tipo_gasto_id) : null,
        periodicidade_id: formData.periodicidade_id ? parseInt(formData.periodicidade_id) : null
      }

      if (editingId) {
        await apiService.updateTransacao(editingId, transacaoData)
        setEditingId(null)
      } else {
        await apiService.createTransacao(transacaoData)
      }

      // Resetar formulário
      setFormData({
        tipo: '',
        descricao: '',
        valor: '',
        data_transacao: new Date(),
        conta_id: '',
        categoria_id: '',
        forma_pagamento_id: '',
        tipo_gasto_id: '',
        periodicidade_id: '',
        observacoes: ''
      })

      // Recarregar transações
      await loadTransacoes()
    } catch (error) {
      console.error('Erro ao salvar transação:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (transacao) => {
    setFormData({
      tipo: transacao.tipo,
      descricao: transacao.descricao,
      valor: transacao.valor.toString(),
      data_transacao: new Date(transacao.data_transacao),
      conta_id: transacao.conta_id?.toString() || '',
      categoria_id: transacao.categoria_id?.toString() || '',
      forma_pagamento_id: transacao.forma_pagamento_id?.toString() || '',
      tipo_gasto_id: transacao.tipo_gasto_id?.toString() || '',
      periodicidade_id: transacao.periodicidade_id?.toString() || '',
      observacoes: transacao.observacoes || ''
    })
    setEditingId(transacao.id)
    loadCategorias(transacao.tipo)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await apiService.deleteTransacao(id)
        await loadTransacoes()
      } catch (error) {
        console.error('Erro ao excluir transação:', error)
      }
    }
  }

  const openModal = (type) => {
    setModalState(prev => ({ ...prev, [type]: true }))
  }

  const closeModal = (type) => {
    setModalState(prev => ({ ...prev, [type]: false }))
  }

  const handleItemAdded = async (type, newItem) => {
    // Atualizar a lista correspondente
    switch (type) {
      case 'conta':
        setContas(prev => [...prev, newItem])
        break
      case 'categoria':
        setCategorias(prev => [...prev, newItem])
        break
      case 'forma_pagamento':
        setFormasPagamento(prev => [...prev, newItem])
        break
      case 'tipo_gasto':
        setTiposGasto(prev => [...prev, newItem])
        break
      case 'periodicidade':
        setPeriodicidades(prev => [...prev, newItem])
        break
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Lançamentos
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Editar Transação' : 'Nova Transação'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipo */}
              <div>
                <Label htmlFor="tipo">Tipo *</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="descricao">Descrição *</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descrição da transação"
                  required
                />
              </div>

              {/* Valor */}
              <div>
                <Label htmlFor="valor">Valor *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => handleInputChange('valor', e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>

              {/* Data */}
              <div>
                <Label>Data *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.data_transacao ? (
                        format(formData.data_transacao, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.data_transacao}
                      onSelect={(date) => handleInputChange('data_transacao', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Conta */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="conta">Conta *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openModal('conta')}
                    className="h-6 px-2 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Nova
                  </Button>
                </div>
                <Select value={formData.conta_id} onValueChange={(value) => handleInputChange('conta_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                  <SelectContent>
                    {contas.map(conta => (
                      <SelectItem key={conta.id} value={conta.id.toString()}>
                        {conta.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Categoria */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openModal('categoria')}
                    className="h-6 px-2 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Nova
                  </Button>
                </div>
                <Select value={formData.categoria_id} onValueChange={(value) => handleInputChange('categoria_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria.id} value={categoria.id.toString()}>
                        {categoria.icone} {categoria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Forma de Pagamento */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="forma_pagamento">Forma de Pagamento *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openModal('forma_pagamento')}
                    className="h-6 px-2 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Nova
                  </Button>
                </div>
                <Select value={formData.forma_pagamento_id} onValueChange={(value) => handleInputChange('forma_pagamento_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {formasPagamento.map(forma => (
                      <SelectItem key={forma.id} value={forma.id.toString()}>
                        {forma.icone} {forma.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Gasto (apenas para saídas) */}
              {formData.tipo === 'saida' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="tipo_gasto">Tipo de Gasto</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openModal('tipo_gasto')}
                      className="h-6 px-2 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Novo
                    </Button>
                  </div>
                  <Select value={formData.tipo_gasto_id} onValueChange={(value) => handleInputChange('tipo_gasto_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de gasto" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposGasto.map(tipo => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {tipo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Periodicidade */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="periodicidade">Periodicidade</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openModal('periodicidade')}
                    className="h-6 px-2 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Nova
                  </Button>
                </div>
                <Select value={formData.periodicidade_id} onValueChange={(value) => handleInputChange('periodicidade_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a periodicidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodicidades.map(periodicidade => (
                      <SelectItem key={periodicidade.id} value={periodicidade.id.toString()}>
                        {periodicidade.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Observações adicionais"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  {loading ? 'Salvando...' : (editingId ? 'Atualizar' : 'Adicionar')}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingId(null)
                      setFormData({
                        tipo: '',
                        descricao: '',
                        valor: '',
                        data_transacao: new Date(),
                        conta_id: '',
                        categoria_id: '',
                        forma_pagamento_id: '',
                        tipo_gasto_id: '',
                        periodicidade_id: '',
                        observacoes: ''
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Transações */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transacoes.map(transacao => (
                <div key={transacao.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transacao.tipo === 'entrada' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                      <span className="font-medium">{transacao.descricao}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {transacao.categoria} • {transacao.conta} • {format(new Date(transacao.data_transacao), 'dd/MM/yyyy')}
                    </div>
                    <div className={`font-bold ${
                      transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      R$ {transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(transacao)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(transacao.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {transacoes.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Nenhuma transação encontrada
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modais para adicionar novos itens */}
      <AddItemModal
        isOpen={modalState.conta}
        onClose={() => closeModal('conta')}
        itemType="conta"
        onItemAdded={(newItem) => handleItemAdded('conta', newItem)}
        title="Nova Conta Bancária"
        description="Adicione uma nova conta bancária para suas transações."
      />

      <AddItemModal
        isOpen={modalState.categoria}
        onClose={() => closeModal('categoria')}
        itemType="categoria"
        onItemAdded={(newItem) => handleItemAdded('categoria', newItem)}
        title="Nova Categoria"
        description="Adicione uma nova categoria para classificar suas transações."
      />

      <AddItemModal
        isOpen={modalState.forma_pagamento}
        onClose={() => closeModal('forma_pagamento')}
        itemType="forma_pagamento"
        onItemAdded={(newItem) => handleItemAdded('forma_pagamento', newItem)}
        title="Nova Forma de Pagamento"
        description="Adicione uma nova forma de pagamento para suas transações."
      />

      <AddItemModal
        isOpen={modalState.tipo_gasto}
        onClose={() => closeModal('tipo_gasto')}
        itemType="tipo_gasto"
        onItemAdded={(newItem) => handleItemAdded('tipo_gasto', newItem)}
        title="Novo Tipo de Gasto"
        description="Adicione um novo tipo de gasto para classificar suas despesas."
      />

      <AddItemModal
        isOpen={modalState.periodicidade}
        onClose={() => closeModal('periodicidade')}
        itemType="periodicidade"
        onItemAdded={(newItem) => handleItemAdded('periodicidade', newItem)}
        title="Nova Periodicidade"
        description="Adicione uma nova periodicidade para suas transações."
      />
    </div>
  )
}

