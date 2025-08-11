import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderFormData, OrderStatus } from "@/types/order";
import { Plus, X } from "lucide-react";

interface OrderFormProps {
  onSubmit: (order: OrderFormData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions: OrderStatus[] = ['', 'HECHO', 'EN_CURSO', 'ESPERANDO', 'PENDIENTE'];

export function OrderForm({ onSubmit, isOpen, onClose }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    titulo: '',
    descripcion: '',
    fechaEntrega: '',
    persona: '',
    cantidad: 0,
    producto: '',
    prueba: '',
    laser: '',
    trivor: '',
    manipulado: '',
    laminado: '',
    encuadernacion: '',
    carteleria: '',
    subcontrataciones: '',
    entrega: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      titulo: '',
      descripcion: '',
      fechaEntrega: '',
      persona: '',
      cantidad: 0,
      producto: '',
      prueba: '',
      laser: '',
      trivor: '',
      manipulado: '',
      laminado: '',
      encuadernacion: '',
      carteleria: '',
      subcontrataciones: '',
      entrega: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Nuevo Pedido</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="persona">Persona</Label>
                <Input
                  id="persona"
                  value={formData.persona}
                  onChange={(e) => setFormData({...formData, persona: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
                <Input
                  id="fechaEntrega"
                  type="date"
                  value={formData.fechaEntrega}
                  onChange={(e) => setFormData({...formData, fechaEntrega: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="0"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({...formData, cantidad: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="producto">Producto</Label>
                <Input
                  id="producto"
                  value={formData.producto}
                  onChange={(e) => setFormData({...formData, producto: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Estados de Servicios</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  'prueba', 'laser', 'trivor', 'manipulado',
                  'laminado', 'encuadernacion', 'carteleria', 'subcontrataciones'
                ].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label className="capitalize">{field}</Label>
                    <Select
                      value={formData[field as keyof OrderFormData] as string}
                      onValueChange={(value) => setFormData({...formData, [field]: value as OrderStatus})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status === '' ? 'Sin estado' : 
                             status === 'HECHO' ? 'Hecho' :
                             status === 'EN_CURSO' ? 'En Curso' :
                             status === 'ESPERANDO' ? 'Esperando' :
                             status === 'PENDIENTE' ? 'Pendiente' : status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entrega">Entrega</Label>
              <Input
                id="entrega"
                value={formData.entrega}
                onChange={(e) => setFormData({...formData, entrega: e.target.value})}
                placeholder="Ej: AGENCIA DE TRANSPORTES - GLS"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Crear Pedido
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}