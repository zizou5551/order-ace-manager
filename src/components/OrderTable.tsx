import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { EditableCell } from "./EditableCell";
import { Order } from "@/types/order";
import { Search, Eye, Trash2 } from "lucide-react";

interface OrderTableProps {
  orders: Order[];
  onDeleteOrder: (id: string) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
}

export function OrderTable({ orders, onDeleteOrder, onUpdateOrder }: OrderTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order =>
    order.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const handleUpdateField = (orderId: string, field: keyof Order, value: any) => {
    onUpdateOrder(orderId, { [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px]">Título</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Prueba</TableHead>
                <TableHead>Láser</TableHead>
                <TableHead>Trivor</TableHead>
                <TableHead>Manipulado</TableHead>
                <TableHead>Laminado</TableHead>
                <TableHead>Encuadernación</TableHead>
                <TableHead>Cartelería</TableHead>
                <TableHead>Subcontrataciones</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No se encontraron pedidos que coincidan con la búsqueda' : 'No hay pedidos registrados'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/25">
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <EditableCell
                          value={order.titulo}
                          onSave={(value) => handleUpdateField(order.id, 'titulo', value)}
                          className="font-semibold text-sm"
                        />
                        {order.fechaEntrega && (
                          <div className="text-xs text-muted-foreground">
                            Entrega: {formatDate(order.fechaEntrega)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={order.persona}
                        onSave={(value) => handleUpdateField(order.id, 'persona', value)}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={order.cantidad}
                        onSave={(value) => handleUpdateField(order.id, 'cantidad', value)}
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={order.producto}
                        onSave={(value) => handleUpdateField(order.id, 'producto', value)}
                        type="product"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={order.prueba}
                        onSave={(value) => handleUpdateField(order.id, 'prueba', value)}
                        type="proof"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={order.laser}
                        onSave={(value) => handleUpdateField(order.id, 'laser', value)}
                        type="process"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={order.trivor}
                        onSave={(value) => handleUpdateField(order.id, 'trivor', value)}
                        type="process"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={order.manipulado}
                        onSave={(value) => handleUpdateField(order.id, 'manipulado', value)}
                        type="process"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={order.laminado}
                        onSave={(value) => handleUpdateField(order.id, 'laminado', value)}
                        type="process"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={order.encuadernacion}
                        onSave={(value) => handleUpdateField(order.id, 'encuadernacion', value)}
                        type="process"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={order.carteleria}
                        onSave={(value) => handleUpdateField(order.id, 'carteleria', value)}
                        type="process"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={order.subcontrataciones}
                        onSave={(value) => handleUpdateField(order.id, 'subcontrataciones', value)}
                        type="process"
                      />
                    </TableCell>
                    <TableCell className="max-w-[150px]">
                      <EditableCell
                        value={order.entrega}
                        onSave={(value) => handleUpdateField(order.id, 'entrega', value)}
                        type="delivery"
                      />
                    </TableCell>
                    <TableCell>
                      {order.terminado ? (
                        <Badge variant="completed">Terminado</Badge>
                      ) : (
                        <Badge variant="pending">En Proceso</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteOrder(order.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{selectedOrder.titulo}</h2>
              <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Descripción</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedOrder.descripcion || 'Sin descripción'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Persona</h3>
                  <p className="text-sm">{selectedOrder.persona || '-'}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Cantidad</h3>
                  <p className="text-sm">{selectedOrder.cantidad || '-'}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Producto</h3>
                  <p className="text-sm">{selectedOrder.producto || '-'}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Fecha de Entrega</h3>
                  <p className="text-sm">{formatDate(selectedOrder.fechaEntrega) || '-'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Estados de Servicios</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Prueba', value: selectedOrder.prueba },
                    { label: 'Láser', value: selectedOrder.laser },
                    { label: 'Trivor', value: selectedOrder.trivor },
                    { label: 'Manipulado', value: selectedOrder.manipulado },
                    { label: 'Laminado', value: selectedOrder.laminado },
                    { label: 'Encuadernación', value: selectedOrder.encuadernacion },
                    { label: 'Cartelería', value: selectedOrder.carteleria },
                    { label: 'Subcontrataciones', value: selectedOrder.subcontrataciones },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-sm">{item.label}:</span>
                      <StatusBadge status={item.value} />
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedOrder.entrega && (
                <div>
                  <h3 className="font-medium mb-1">Entrega</h3>
                  <p className="text-sm">{selectedOrder.entrega}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}