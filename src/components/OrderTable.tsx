import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUploadDialog } from "@/components/FileUploadDialog";
import { Order } from "@/types/order";
import { Search, Eye, Upload, Trash2 } from "lucide-react";
import { EditableCell } from "./EditableCell";

interface OrderTableProps {
  orders: Order[];
  onDeleteOrder: (id: string) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
}

export const OrderTable = ({ orders, onDeleteOrder, onUpdateOrder }: OrderTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [uploadOrder, setUploadOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order =>
    order.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.cliente && order.cliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.estado && order.estado.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getEstadoBadgeVariant = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case 'completado':
      case 'entregado':
        return 'default';
      case 'en_proceso':
      case 'revision':
        return 'secondary';
      case 'cancelado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleUpdateField = (orderId: string, field: string, value: any) => {
    onUpdateOrder(orderId, { [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-2 p-4 border-b">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredOrders.length} de {orders.length} pedidos
        </div>
      </div>

      {/* Table with horizontal scroll */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="min-w-[200px]">Nombre</TableHead>
              <TableHead className="min-w-[150px]">Cliente</TableHead>
              <TableHead className="min-w-[120px]">Estado</TableHead>
              <TableHead className="min-w-[300px]">Notas</TableHead>
              <TableHead className="min-w-[140px]">Creado</TableHead>
              <TableHead className="min-w-[140px]">Actualizado</TableHead>
              <TableHead className="min-w-[120px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No se encontraron pedidos que coincidan con la búsqueda' : 'No hay pedidos disponibles'}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="py-2">
                    <EditableCell
                      value={order.nombre}
                      onSave={(value) => handleUpdateField(order.id, 'nombre', value)}
                      type="text"
                      className="font-medium"
                    />
                  </TableCell>
                  
                  <TableCell className="py-2">
                    <EditableCell
                      value={order.cliente || ''}
                      onSave={(value) => handleUpdateField(order.id, 'cliente', value)}
                      type="text"
                    />
                  </TableCell>
                  
                  <TableCell className="py-2">
                    <EditableCell
                      value={order.estado || 'nuevo'}
                      onSave={(value) => handleUpdateField(order.id, 'estado', value)}
                      type="estado"
                      className="w-fit"
                    />
                  </TableCell>
                  
                  <TableCell className="py-2">
                    <EditableCell
                      value={order.notas || ''}
                      onSave={(value) => handleUpdateField(order.id, 'notas', value)}
                      type="textarea"
                      className="max-w-xs"
                    />
                  </TableCell>
                  
                  <TableCell className="py-2 text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  
                  <TableCell className="py-2 text-sm text-muted-foreground">
                    {formatDate(order.updatedAt)}
                  </TableCell>
                  
                  <TableCell className="py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadOrder(order)}
                        className="h-8 w-8 p-0"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteOrder(order.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles del Pedido</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Nombre:</h4>
                <p>{selectedOrder.nombre}</p>
              </div>
              
              {selectedOrder.cliente && (
                <div>
                  <h4 className="font-semibold">Cliente:</h4>
                  <p>{selectedOrder.cliente}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold">Estado:</h4>
                <Badge variant={getEstadoBadgeVariant(selectedOrder.estado)}>
                  {selectedOrder.estado || 'Nuevo'}
                </Badge>
              </div>
              
              {selectedOrder.notas && (
                <div>
                  <h4 className="font-semibold">Notas:</h4>
                  <p className="whitespace-pre-wrap">{selectedOrder.notas}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Fecha de creación:</h4>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Última actualización:</h4>
                  <p>{formatDate(selectedOrder.updatedAt)}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* File Upload Dialog */}
      {uploadOrder && (
        <FileUploadDialog
          open={!!uploadOrder}
          orderTitle={uploadOrder.nombre}
          onOpenChange={(open) => {
            if (!open) setUploadOrder(null);
          }}
        />
      )}
    </div>
  );
};