import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Plus } from 'lucide-react'
import apiService from '../services/api'

export default function AddItemModal({ 
  isOpen, 
  onClose, 
  itemType, 
  onItemAdded,
  title,
  description 
}) {
  const [formData, setFormData] = useState({
    nome: '',
    icone: '',
    tipo: '',
    cor: '#3B82F6',
    imagem_url: ''
  })
  const [loading, setLoading] = useState(false)

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
      let newItem
      
      switch (itemType) {
        case 'conta':
          newItem = await apiService.createConta({
            nome: formData.nome,
            cor: formData.cor,
            logo_url: formData.imagem_url
          })
          break
        case 'categoria':
          newItem = await apiService.createCategoria({
            nome: formData.nome,
            icone: formData.icone,
            tipo: formData.tipo
          })
          break
        case 'forma-pagamento':
          newItem = await apiService.createFormaPagamento({
            nome: formData.nome,
            icone: formData.icone
          })
          break
        case 'tipo-gasto':
          newItem = await apiService.createTipoGasto({
            nome: formData.nome
          })
          break
        case 'periodicidade':
          newItem = await apiService.createPeriodicidade({
            nome: formData.nome
          })
          break
        default:
          throw new Error('Tipo de item não reconhecido')
      }

      onItemAdded(newItem)
      handleClose()
    } catch (error) {
      console.error('Erro ao criar item:', error)
      alert('Erro ao criar item. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      nome: '',
      icone: '',
      tipo: '',
      cor: '#3B82F6',
      imagem_url: ''
    })
    onClose()
  }

  const renderFormFields = () => {
    switch (itemType) {
      case 'conta':
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Digite o nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="imagem_url">URL da Imagem</Label>
              <Input
                id="imagem_url"
                placeholder="https://exemplo.com/logo-banco.png"
                value={formData.imagem_url}
                onChange={(e) => handleInputChange('imagem_url', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Cole aqui a URL da imagem do logo do banco (opcional)
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cor">Cor</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cor"
                  type="color"
                  value={formData.cor}
                  onChange={(e) => handleInputChange('cor', e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={formData.cor}
                  onChange={(e) => handleInputChange('cor', e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>
          </>
        )

      case 'categoria':
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Digite o nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icone">Ícone</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="icone"
                  placeholder="Escolha um emoji"
                  value={formData.icone}
                  onChange={(e) => handleInputChange('icone', e.target.value)}
                  className="flex-1"
                />
                <div className="flex gap-1">
                  {['🍽️', '🏠', '🚗', '🎮', '👕', '💊'].map(emoji => (
                    <Button
                      key={emoji}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('icone', emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      case 'forma-pagamento':
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Digite o nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icone">Ícone</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="icone"
                  placeholder="Escolha um emoji"
                  value={formData.icone}
                  onChange={(e) => handleInputChange('icone', e.target.value)}
                  className="flex-1"
                />
                <div className="flex gap-1">
                  {['💳', '💰', '🏦', '📱', '💸'].map(emoji => (
                    <Button
                      key={emoji}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('icone', emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )

      default:
        return (
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              placeholder="Digite o nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              required
            />
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {renderFormFields()}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading || !formData.nome.trim()}
          >
            {loading ? 'Criando...' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

