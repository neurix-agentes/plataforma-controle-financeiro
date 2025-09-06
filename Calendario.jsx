import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import apiService from '../services/api'

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [transacoes, setTransacoes] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTransacoes()
  }, [currentDate])

  const loadTransacoes = async () => {
    try {
      setLoading(true)
      const transacoesData = await apiService.getTransacoes({
        mes: currentDate.getMonth() + 1,
        ano: currentDate.getFullYear()
      })
      setTransacoes(transacoesData)
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Agrupar transações por data
  const transacoesPorData = transacoes.reduce((acc, transacao) => {
    const data = format(new Date(transacao.data_transacao), 'yyyy-MM-dd')
    if (!acc[data]) {
      acc[data] = []
    }
    acc[data].push(transacao)
    return acc
  }, {})

  const getTransacoesDoDia = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd')
    return transacoesPorData[dateKey] || []
  }

  const getSaldoDoDia = (day) => {
    const transacoesDoDia = getTransacoesDoDia(day)
    return transacoesDoDia.reduce((total, transacao) => {
      return total + (transacao.tipo === 'entrada' ? transacao.valor : -transacao.valor)
    }, 0)
  }

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
    setSelectedDay(null)
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
    setSelectedDay(null)
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Calendário Financeiro
        </h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold min-w-48 text-center">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <Button variant="outline" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cabeçalho dos dias da semana */}
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(day => (
                      <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Dias do mês */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map(day => {
                      const transacoesDoDia = getTransacoesDoDia(day)
                      const saldoDoDia = getSaldoDoDia(day)
                      const isToday = isSameDay(day, new Date())
                      const isSelected = selectedDay && isSameDay(day, selectedDay)

                      return (
                        <div
                          key={day.toISOString()}
                          className={`
                            p-2 min-h-20 border border-gray-200 dark:border-gray-700 cursor-pointer
                            hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                            ${isToday ? 'bg-blue-50 dark:bg-blue-900 border-blue-300' : ''}
                            ${isSelected ? 'bg-blue-100 dark:bg-blue-800 border-blue-400' : ''}
                            ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                          `}
                          onClick={() => setSelectedDay(day)}
                        >
                          <div className="text-sm font-medium mb-1">
                            {format(day, 'd')}
                          </div>
                          
                          {transacoesDoDia.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-xs">
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  {transacoesDoDia.length}
                                </Badge>
                              </div>
                              {saldoDoDia !== 0 && (
                                <div className={`text-xs font-bold ${
                                  saldoDoDia > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {saldoDoDia > 0 ? '+' : ''}R$ {Math.abs(saldoDoDia).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do dia selecionado */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDay 
                  ? format(selectedDay, "dd 'de' MMMM", { locale: ptBR })
                  : 'Selecione um dia'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDay ? (
                <div className="space-y-4">
                  {getTransacoesDoDia(selectedDay).length > 0 ? (
                    <>
                      {/* Resumo do dia */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Resumo do dia
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Entradas:</span>
                            <span className="text-green-600 font-medium">
                              R$ {getTransacoesDoDia(selectedDay)
                                .filter(t => t.tipo === 'entrada')
                                .reduce((sum, t) => sum + t.valor, 0)
                                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saídas:</span>
                            <span className="text-red-600 font-medium">
                              R$ {getTransacoesDoDia(selectedDay)
                                .filter(t => t.tipo === 'saida')
                                .reduce((sum, t) => sum + t.valor, 0)
                                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-1">
                            <span>Saldo:</span>
                            <span className={getSaldoDoDia(selectedDay) >= 0 ? 'text-green-600' : 'text-red-600'}>
                              R$ {getSaldoDoDia(selectedDay).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Lista de transações */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Transações</h4>
                        {getTransacoesDoDia(selectedDay).map(transacao => (
                          <div key={transacao.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Badge variant={transacao.tipo === 'entrada' ? 'default' : 'destructive'}>
                                  {transacao.tipo === 'entrada' ? (
                                    <Plus className="h-3 w-3 mr-1" />
                                  ) : (
                                    <Minus className="h-3 w-3 mr-1" />
                                  )}
                                  {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                                </Badge>
                              </div>
                              <div className={`font-bold ${
                                transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                R$ {transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </div>
                            </div>
                            <div className="text-sm">
                              <div className="font-medium">{transacao.descricao}</div>
                              <div className="text-gray-500 mt-1">
                                {transacao.categoria} • {transacao.conta}
                              </div>
                              {transacao.forma_pagamento && (
                                <div className="text-gray-500">
                                  {transacao.forma_pagamento}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-2">📅</div>
                      <div>Nenhuma transação neste dia</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">👆</div>
                  <div>Clique em um dia do calendário para ver as transações</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legenda */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded"></div>
                <span>Hoje</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Badge variant="outline" className="text-xs">N</Badge>
                <span>Número de transações</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-green-600 font-bold text-xs">+R$ 100</span>
                <span>Saldo positivo</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-red-600 font-bold text-xs">-R$ 50</span>
                <span>Saldo negativo</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

