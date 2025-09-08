import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderFormData } from "@/types/order";
import { X } from "lucide-react";

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const estadoOptions = [
  'nuevo',
  'en_proceso',
  'revision',
  'completado',
  'entregado',
  'cancelado'
];

export const OrderForm = ({ onSubmit, isOpen, onClose }: OrderFormProps) => {
  const [formData, setFormData] = useState<OrderFormData>({
    nombre: '',
    cliente: '',
    estado: 'nuevo',
    notas: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    
    onSubmit(formData);
    
    // Reset form
    setFormData({
      nombre: '',
      cliente: '',
      estado: 'nuevo',
      notas: ''
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Crear Nuevo Pedido</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Pedido *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Folletos empresa ABC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={formData.cliente || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
                placeholder="Nombre del cliente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select 
                value={formData.estado || 'nuevo'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {estadoOptions.map(estado => (
                    <SelectItem key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                value={formData.notas || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                placeholder="Notas adicionales sobre el pedido"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Crear Pedido
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};