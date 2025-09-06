import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { CalendarIcon, Target, Plus, TrendingUp, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import apiService from '../services/api'

export default function Metas() {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor_objetivo: '',
    valor_atual: '',
    data_inicio: new Date(),
    data_fim: new Date(),
    categoria_id: ''
  })

  const [metas, setMetas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadInitialData()
    loadMetas()
  }, [])

  const loadInitialData = async () => {
    try {
      const categoriasData = await apiService.getCategorias()
      setCategorias(categoriasData)
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error)
    }
  }

  const loadMetas = async () => {
    try {
      const metasData = await apiService.getMetas()
      setMetas(metasData)
    } catch (error) {
      console.error('Erro ao carregar metas:', error)
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
      const metaData = {
        ...formData,
        valor_objetivo: parseFloat(formData.valor_objetivo),
        valor_atual: parseFloat(formData.valor_atual || 0),
        data_inicio: format(formData.data_inicio, 'yyyy-MM-dd'),
        data_fim: format(formData.data_fim, 'yyyy-MM-dd'),
        categoria_id: formData.categoria_id ? parseInt(formData.categoria_id) : null
      }

      await apiService.createMeta(metaData)

      // Resetar formulário
      setFormData({
        nome: '',
        descricao: '',
        valor_objetivo: '',
        valor_atual: '',
        data_inicio: new Date(),
        data_fim: new Date(),
        categoria_id: ''
      })

      setShowForm(false)
      await loadMetas()
    } catch (error) {
      console.error('Erro ao salvar meta:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativa':
        return 'bg-blue-100 text-blue-800'
      case 'concluida':
        return 'bg-green-100 text-green-800'
      case 'cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (progresso) => {
    if (progresso >= 100) return 'bg-green-500'
    if (progresso >= 75) return 'bg-blue-500'
    if (progresso >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Metas e Objetivos
        </h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      {/* Resumo das Metas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metas.filter(meta => meta.status === 'ativa').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Concluídas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metas.filter(meta => meta.status === 'concluida').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Objetivos alcançados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metas.reduce((total, meta) => total + meta.valor_objetivo, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as metas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <Label htmlFor="nome">Nome da Meta *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Ex: Reserva de Emergência"
                    required
                  />
                </div>

                {/* Categoria */}
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formData.categoria_id} onValueChange={(value) => handleInputChange('categoria_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
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

                {/* Valor Objetivo */}
                <div>
                  <Label htmlFor="valor_objetivo">Valor Objetivo *</Label>
                  <Input
                    id="valor_objetivo"
                    type="number"
                    step="0.01"
                    value={formData.valor_objetivo}
                    onChange={(e) => handleInputChange('valor_objetivo', e.target.value)}
                    placeholder="10000.00"
                    required
                  />
                </div>

                {/* Valor Atual */}
                <div>
                  <Label htmlFor="valor_atual">Valor Atual</Label>
                  <Input
                    id="valor_atual"
                    type="number"
                    step="0.01"
                    value={formData.valor_atual}
                    onChange={(e) => handleInputChange('valor_atual', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Data de Início */}
                <div>
                  <Label>Data de Início *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.data_inicio ? (
                          format(formData.data_inicio, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.data_inicio}
                        onSelect={(date) => handleInputChange('data_inicio', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Data de Fim */}
                <div>
                  <Label>Data de Fim *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.data_fim ? (
                          format(formData.data_fim, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.data_fim}
                        onSelect={(date) => handleInputChange('data_fim', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descreva sua meta e como pretende alcançá-la"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Meta'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metas.map(meta => {
          const progresso = meta.progresso || 0
          
          return (
            <Card key={meta.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{meta.nome}</CardTitle>
                  <Badge className={getStatusColor(meta.status)}>
                    {meta.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Valores */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 text-sm">Valor Atual</span>
                    <div className="font-bold text-lg text-blue-600">
                      R$ {meta.valor_atual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Valor Objetivo</span>
                    <div className="font-bold text-lg">
                      R$ {meta.valor_objetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Progresso */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso</span>
                    <span>{progresso.toFixed(1)}%</span>
                  </div>
                  <Progress value={progresso} className="h-3" />
                  <div className="text-xs text-gray-500 mt-1">
                    Faltam R$ {(meta.valor_objetivo - meta.valor_atual).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Informações adicionais */}
                <div className="space-y-2 text-sm">
                  {meta.categoria && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Categoria:</span>
                      <span>{meta.categoria}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Período:</span>
                    <span>
                      {format(new Date(meta.data_inicio), 'dd/MM/yyyy')} - {format(new Date(meta.data_fim), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  {meta.descricao && (
                    <div>
                      <span className="text-gray-500">Descrição:</span>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">{meta.descricao}</p>
                    </div>
                  )}
                </div>

                {/* Ações */}
                {meta.status === 'ativa' && (
                  <div className="flex space-x-2 pt-2 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      Atualizar Valor
                    </Button>
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {metas.length === 0 && (
          <div className="col-span-2">
            <Card>
              <CardContent className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhuma meta encontrada
                </h3>
                <p className="text-gray-500 mb-4">
                  Defina suas metas financeiras e acompanhe seu progresso para alcançar seus objetivos.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Meta
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

