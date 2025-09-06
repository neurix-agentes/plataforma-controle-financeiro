import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import apiService from '../services/api'
import ContasBancariasCards from '../components/ContasBancariasCards'

export default function Painel() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [balanceData, setBalanceData] = useState({})
  const [paymentMethodData, setPaymentMethodData] = useState([])
  const [expenseTypeData, setExpenseTypeData] = useState([])
  const [periodicityData, setPeriodicityData] = useState([])
  const [contas, setContas] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPanelData()
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    loadContas()
  }, [])

  const loadContas = async () => {
    try {
      const contasData = await apiService.getContas()
      setContas(contasData)
    } catch (error) {
      console.error('Erro ao carregar contas:', error)
    }
  }

  const loadPanelData = async () => {
    try {
      setLoading(true)

      // Carregar balanço mensal
      const balance = await apiService.getBalancoMensal(selectedYear)
      setBalanceData(balance)

      // Carregar resumos
      const [paymentMethods, expenseTypes, periodicity] = await Promise.all([
        apiService.getFormaPagamentoResumo(selectedMonth, selectedYear),
        apiService.getTipoGastoResumo(selectedMonth, selectedYear),
        apiService.getPeriodicidadeResumo(selectedMonth, selectedYear)
      ])

      setPaymentMethodData(paymentMethods)
      setExpenseTypeData(expenseTypes)
      setPeriodicityData(periodicity)

    } catch (error) {
      console.error('Erro ao carregar dados do painel:', error)
    } finally {
      setLoading(false)
    }
  }

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Painel de Controle
        </h1>
        <div className="flex space-x-4">
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contas Bancárias */}
      <ContasBancariasCards />

      {/* Balanço Mensal - Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Balanço Mensal - {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Entradas</TableHead>
                <TableHead className="text-right">Saídas</TableHead>
                <TableHead className="text-right">Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(balanceData).map(month => {
                const monthData = balanceData[month]
                const monthName = months.find(m => m.value === parseInt(month))?.label || month
                
                return (
                  <TableRow key={month}>
                    <TableCell className="font-medium">{monthName}</TableCell>
                    <TableCell className="text-right text-green-600">
                      R$ {monthData.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      R$ {monthData.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={monthData.resultado >= 0 ? 'default' : 'destructive'}>
                        R$ {monthData.resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resumos por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forma de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Por Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethodData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">{item.forma_pagamento}</span>
                  <span className="text-red-600 font-bold">
                    R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              {paymentMethodData.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  Nenhum dado encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tipo de Gasto */}
        <Card>
          <CardHeader>
            <CardTitle>Por Tipo de Gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">{item.tipo_gasto}</span>
                  <span className="text-red-600 font-bold">
                    R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              {expenseTypeData.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  Nenhum dado encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Periodicidade */}
        <Card>
          <CardHeader>
            <CardTitle>Por Periodicidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {periodicityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">{item.periodicidade}</span>
                  <span className="text-red-600 font-bold">
                    R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              {periodicityData.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  Nenhum dado encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balanço Mensal - Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Balanço Mensal - Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.keys(balanceData).map(month => {
              const monthData = balanceData[month]
              const monthName = months.find(m => m.value === parseInt(month))?.label || month
              
              return (
                <div key={month} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{monthName} {selectedYear}</h3>
                    <Badge variant={monthData.resultado >= 0 ? 'default' : 'destructive'}>
                      {monthData.resultado >= 0 ? 'Positivo' : 'Negativo'}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Entradas:</span>
                      <span className="text-green-600 font-medium">
                        R$ {monthData.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saídas:</span>
                      <span className="text-red-600 font-medium">
                        R$ {monthData.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Resultado:</span>
                      <span className={monthData.resultado >= 0 ? 'text-green-600' : 'text-red-600'}>
                        R$ {monthData.resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

