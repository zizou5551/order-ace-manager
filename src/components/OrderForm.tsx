import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderFormData, ProductType, ProofStatus, ProcessStatus, DeliveryType } from "@/types/order";
import { Plus, X } from "lucide-react";

interface OrderFormProps {
  onSubmit: (order: OrderFormData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const productOptions: ProductType[] = ['SIN_SELECCION', 'LIBROS', 'REVISTAS', 'DIPTICOS / TRIPTICOS', 'TARJETAS / TARJETONES / FLYERS', 'WIRE-O', 'CARPETAS ANILLAS', 'CARTELES', 'OTROS'];

const proofOptions: ProofStatus[] = ['SIN_ESTADO', 'ESPERANDO', 'OK CLIENTE', 'ENVIADA PRUEBA', 'PARADO', 'FERRO DIGITAL'];

const processOptions: ProcessStatus[] = ['SIN_ESTADO', 'ESPERANDO', 'EN_CURSO'];

const deliveryOptions: DeliveryType[] = ['SIN_SELECCION', 'RECOGE EN FRAGMA', '2814', 'AVISAR', 'ENTREGA IMEDISA', 'ENTREGA JUANILLO', 'JUANILLO', 'STOCK FRAGMA'];

export function OrderForm({ onSubmit, isOpen, onClose }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    titulo: '',
    descripcion: '',
    fechaEntrega: '',
    persona: '',
    cantidad: 0,
    producto: 'SIN_SELECCION',
    prueba: 'SIN_ESTADO',
    laser: 'SIN_ESTADO',
    trivor: 'SIN_ESTADO',
    manipulado: 'SIN_ESTADO',
    laminado: 'SIN_ESTADO',
    encuadernacion: 'SIN_ESTADO',
    carteleria: 'SIN_ESTADO',
    subcontrataciones: 'SIN_ESTADO',
    entrega: 'SIN_SELECCION',
    seccion: 'carteleria',
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
      producto: 'SIN_SELECCION',
      prueba: 'SIN_ESTADO',
      laser: 'SIN_ESTADO',
      trivor: 'SIN_ESTADO',
      manipulado: 'SIN_ESTADO',
      laminado: 'SIN_ESTADO',
      encuadernacion: 'SIN_ESTADO',
      carteleria: 'SIN_ESTADO',
      subcontrataciones: 'SIN_ESTADO',
      entrega: 'SIN_SELECCION',
      seccion: 'carteleria',
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
                <Label htmlFor="seccion">Sección *</Label>
                <Select
                  value={formData.seccion}
                  onValueChange={(value) => setFormData({...formData, seccion: value as OrderFormData["seccion"]})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sección" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carteleria">Cartelería</SelectItem>
                    <SelectItem value="trivor">Trivor</SelectItem>
                    <SelectItem value="manipulados">Manipulados</SelectItem>
                    <SelectItem value="logistica">Logística</SelectItem>
                    <SelectItem value="impresion digital">Impresión Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="producto">Producto</Label>
                <Select
                  value={formData.producto}
                  onValueChange={(value) => setFormData({...formData, producto: value as ProductType})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productOptions.map((product) => (
                      <SelectItem key={product} value={product}>
                        {product === 'SIN_SELECCION' ? 'Sin selección' : product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Estados de Servicios</h3>
              
              {/* Prueba section */}
              <div className="space-y-2">
                <Label className="capitalize">Prueba</Label>
                <Select
                  value={formData.prueba}
                  onValueChange={(value) => setFormData({...formData, prueba: value as ProofStatus})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {proofOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === 'SIN_ESTADO' ? 'Sin estado' : 
                         status === 'OK CLIENTE' ? 'OK Cliente' :
                         status === 'ENVIADA PRUEBA' ? 'Enviada Prueba' :
                         status === 'FERRO DIGITAL' ? 'Ferro Digital' : status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  'laser', 'trivor', 'manipulado', 'laminado',
                  'encuadernacion', 'carteleria', 'subcontrataciones'
                ].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label className="capitalize">{field}</Label>
                    <Select
                      value={formData[field as keyof OrderFormData] as string}
                      onValueChange={(value) => setFormData({...formData, [field]: value as ProcessStatus})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {processOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status === 'SIN_ESTADO' ? 'Sin estado' : 
                             status === 'EN_CURSO' ? 'En Curso' : status}
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
              <Select
                value={formData.entrega}
                onValueChange={(value) => setFormData({...formData, entrega: value as DeliveryType})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar entrega" />
                </SelectTrigger>
                <SelectContent>
                  {deliveryOptions.map((delivery) => (
                    <SelectItem key={delivery} value={delivery}>
                      {delivery === 'SIN_SELECCION' ? 'Sin selección' : delivery}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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