import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Building2 } from 'lucide-react'
import apiService from '../services/api'
import AddItemModal from './AddItemModal'

export default function ContasBancariasCards() {
  const [contas, setContas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    loadContas()
  }, [])

  const loadContas = async () => {
    try {
      setLoading(true)
      const data = await apiService.getContas()
      setContas(data)
    } catch (error) {
      console.error('Erro ao carregar contas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContaAdded = (novaConta) => {
    setContas(prev => [...prev, novaConta])
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const getBankLogo = (nomeBanco) => {
    const logos = {
      'itau': '/assets/Itaú-novo-logotipo.jpg',
      'nubank': '/assets/nubank-logo.png',
      'mercado pago': '/assets/logomercadopago.jpg',
      'banco do brasil': '/assets/bb-logo.png',
      'caixa': '/assets/caixa-logo.jpg',
      'santander': '/assets/santander-logo.jpg',
      'bradesco': '/assets/bradesco-logo.jpg',
      'inter': '/assets/inter-logo.png',
      'picpay': '/assets/picpay-logo.jpg'
    }
    
    const nomeNormalizado = nomeBanco.toLowerCase()
    for (const [banco, logo] of Object.entries(logos)) {
      if (nomeNormalizado.includes(banco)) {
        return logo
      }
    }
    return null
  }

  const getBankColor = (nomeBanco) => {
    const cores = {
      'itau': '#EC7000',
      'nubank': '#8A05BE',
      'mercado pago': '#00B1EA',
      'banco do brasil': '#FFF200',
      'caixa': '#0066CC',
      'santander': '#EC0000',
      'bradesco': '#CC092F',
      'inter': '#FF7A00',
      'picpay': '#21C25E'
    }
    
    const nomeNormalizado = nomeBanco.toLowerCase()
    for (const [banco, cor] of Object.entries(cores)) {
      if (nomeNormalizado.includes(banco)) {
        return cor
      }
    }
    return '#3B82F6'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-32 animate-pulse">
            <CardContent className="p-0 h-full bg-gray-200 rounded-lg" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Contas Bancárias</h3>
        <Button
          onClick={() => setModalOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {contas.map((conta) => {
          const logo = getBankLogo(conta.nome)
          const cor = getBankColor(conta.nome)
          
          return (
            <Card 
              key={conta.id} 
              className="h-32 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              style={{ backgroundColor: cor }}
            >
              <CardContent className="p-0 h-full relative">
                {/* Logo do banco */}
                <div className="h-20 flex items-center justify-center p-4">
                  {(conta.logo_url || logo) ? (
                    <img 
                      src={conta.logo_url || logo} 
                      alt={conta.nome}
                      className="max-h-full max-w-full object-contain filter brightness-0 invert"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div 
                    className="hidden items-center justify-center text-white font-bold text-lg"
                    style={{ display: (conta.logo_url || logo) ? 'none' : 'flex' }}
                  >
                    <Building2 className="h-8 w-8 mr-2" />
                    {conta.nome.split(' ').map(word => word[0]).join('').toUpperCase()}
                  </div>
                </div>
                
                {/* Informações da conta */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-3 w-3" />
                    <span className="text-xs font-medium truncate">{conta.nome}</span>
                  </div>
                  <div className="text-sm font-bold">
                    {formatCurrency(conta.saldo)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Card para adicionar nova conta */}
        <Card 
          className="h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors"
          onClick={() => setModalOpen(true)}
        >
          <CardContent className="p-0 h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-600">
            <Plus className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">Nova Conta</span>
          </CardContent>
        </Card>
      </div>

      {/* Modal para adicionar nova conta */}
      <AddItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemType="conta"
        onItemAdded={handleContaAdded}
        title="Nova Conta Bancária"
        description="Adicione uma nova conta bancária para suas transações."
      />
    </div>
  )
}

