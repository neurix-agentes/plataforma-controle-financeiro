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
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, CreditCard, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import apiService from '../services/api'

export default function Parcelamentos() {
  const [formData, setFormData] = useState({
    descricao: '',
    valor_total: '',
    parcelas_total: '',
    data_primeira_parcela: new Date(),
    categoria_id: '',
    conta_id: ''
  })

  const [parcelamentos, setParcelamentos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [contas, setContas] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadInitialData()
    loadParcelamentos()
  }, [])

  const loadInitialData = async () => {
    try {
      const [categoriasData, contasData] = await Promise.all([
        apiService.getCategorias('saida'), // Parcelamentos são sempre saídas
        apiService.getContas()
      ])

      setCategorias(categoriasData)
      setContas(contasData)
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error)
    }
  }

  const loadParcelamentos = async () => {
    try {
      const parcelamentosData = await apiService.getParcelamentos()
      setParcelamentos(parcelamentosData)
    } catch (error) {
      console.error('Erro ao carregar parcelamentos:', error)
    }
  }

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const parcelamentoData = {
        ...formData,
        valor_total: parseFloat(formData.valor_total),
        valor_parcela: parseFloat(formData.valor_total) / parseInt(formData.parcelas_total),
        parcelas_total: parseInt(formData.parcelas_total),
        data_primeira_parcela: format(formData.data_primeira_parcela, 'yyyy-MM-dd'),
        categoria_id: parseInt(formData.categoria_id),
        conta_id: parseInt(formData.conta_id)
      }

      await apiService.createParcelamento(parcelamentoData)

      // Resetar formulário
      setFormData({
        descricao: '',
        valor_total: '',
        parcelas_total: '',
        data_primeira_parcela: new Date(),
        categoria_id: '',
        conta_id: ''
      })

      setShowForm(false)
      await loadParcelamentos()
    } catch (error) {
      console.error('Erro ao salvar parcelamento:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo':
        return 'bg-blue-100 text-blue-800'
      case 'concluido':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Parcelamentos
        </h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Parcelamento
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Parcelamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Descrição */}
                <div>
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    placeholder="Descrição do parcelamento"
                    required
                  />
                </div>

                {/* Valor Total */}
                <div>
                  <Label htmlFor="valor_total">Valor Total *</Label>
                  <Input
                    id="valor_total"
                    type="number"
                    step="0.01"
                    value={formData.valor_total}
                    onChange={(e) => handleInputChange('valor_total', e.target.value)}
                    placeholder="0,00"
                    required
                  />
                </div>

                {/* Número de Parcelas */}
                <div>
                  <Label htmlFor="parcelas_total">Número de Parcelas *</Label>
                  <Input
                    id="parcelas_total"
                    type="number"
                    min="2"
                    value={formData.parcelas_total}
                    onChange={(e) => handleInputChange('parcelas_total', e.target.value)}
                    placeholder="12"
                    required
                  />
                </div>

                {/* Valor da Parcela (calculado) */}
                <div>
                  <Label>Valor da Parcela</Label>
                  <Input
                    value={
                      formData.valor_total && formData.parcelas_total
                        ? `R$ ${(parseFloat(formData.valor_total) / parseInt(formData.parcelas_total)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        : 'R$ 0,00'
                    }
                    disabled
                  />
                </div>

                {/* Data da Primeira Parcela */}
                <div>
                  <Label>Data da Primeira Parcela *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.data_primeira_parcela ? (
                          format(formData.data_primeira_parcela, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.data_primeira_parcela}
                        onSelect={(date) => handleInputChange('data_primeira_parcela', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Categoria */}
                <div>
                  <Label htmlFor="categoria">Categoria *</Label>
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

                {/* Conta */}
                <div>
                  <Label htmlFor="conta">Conta *</Label>
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
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Parcelamento'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Parcelamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parcelamentos.map(parcelamento => {
          const progresso = (parcelamento.parcelas_pagas / parcelamento.parcelas_total) * 100
          
          return (
            <Card key={parcelamento.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{parcelamento.descricao}</CardTitle>
                  <Badge className={getStatusColor(parcelamento.status)}>
                    {parcelamento.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Informações básicas */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Valor Total:</span>
                    <div className="font-bold text-lg">
                      R$ {parcelamento.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Valor da Parcela:</span>
                    <div className="font-bold text-lg">
                      R$ {parcelamento.valor_parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Progresso */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso</span>
                    <span>{parcelamento.parcelas_pagas} de {parcelamento.parcelas_total} parcelas</span>
                  </div>
                  <Progress value={progresso} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    {progresso.toFixed(1)}% concluído
                  </div>
                </div>

                {/* Informações adicionais */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Categoria:</span>
                    <span>{parcelamento.categoria}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Conta:</span>
                    <span>{parcelamento.conta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Primeira Parcela:</span>
                    <span>{format(new Date(parcelamento.data_primeira_parcela), 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Parcelas Restantes:</span>
                    <span className="font-medium">{parcelamento.parcelas_restantes}</span>
                  </div>
                </div>

                {/* Ações */}
                {parcelamento.status === 'ativo' && (
                  <div className="flex space-x-2 pt-2 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Marcar Parcela Paga
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {parcelamentos.length === 0 && (
          <div className="col-span-2">
            <Card>
              <CardContent className="text-center py-12">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum parcelamento encontrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Comece criando seu primeiro parcelamento para controlar suas compras parceladas.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Parcelamento
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

