import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderForm } from "@/components/OrderForm";
import { OrderTable } from "@/components/OrderTable";
import { FileUploadDialog } from "@/components/FileUploadDialog";
import { Order, OrderFormData } from "@/types/order";
import { Plus, Package, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { listOrders, saveOrder, ApiError } from "@/services/api";

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newOrderForUpload, setNewOrderForUpload] = useState<Order | null>(null);

  // Load orders from backend
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await listOrders();
        // Convert backend orders to frontend format for compatibility
        const formattedOrders: Order[] = ordersData.map(apiOrder => ({
          id: apiOrder.id,
          titulo: apiOrder.nombre,
          descripcion: apiOrder.notas || '',
          fechaEntrega: '',
          persona: apiOrder.cliente || '',
          cantidad: 0,
          producto: 'OTROS' as const,
          prueba: 'SIN_ESTADO' as const,
          laser: 'SIN_ESTADO' as const,
          trivor: 'SIN_ESTADO' as const,
          manipulado: 'SIN_ESTADO' as const,
          laminado: 'SIN_ESTADO' as const,
          encuadernacion: apiOrder.estado === 'nuevo' ? 'SIN_ESTADO' as const : 'EN_CURSO' as const,
          carteleria: 'SIN_ESTADO' as const,
          subcontrataciones: 'SIN_ESTADO' as const,
          entrega: 'AVISAR' as const,
          terminado: false,
          createdAt: apiOrder.createdAt || new Date().toISOString(),
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        if (error instanceof ApiError) {
          toast({
            title: "Error al cargar pedidos",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };
    
    loadOrders();
  }, []);

  const handleCreateOrder = async (orderData: OrderFormData) => {
    try {
      const apiOrder = await saveOrder({
        nombre: orderData.titulo,
        cliente: orderData.persona,
        estado: 'nuevo',
        notas: orderData.descripcion,
      });
      
      // Convert API response to frontend format
      const newOrder: Order = {
        id: apiOrder.id,
        titulo: apiOrder.nombre,
        descripcion: apiOrder.notas || '',
        fechaEntrega: orderData.fechaEntrega,
        persona: apiOrder.cliente || '',
        cantidad: orderData.cantidad,
        producto: orderData.producto,
        prueba: orderData.prueba,
        laser: orderData.laser,
        trivor: orderData.trivor,
        manipulado: orderData.manipulado,
        laminado: orderData.laminado,
        encuadernacion: orderData.encuadernacion,
        carteleria: orderData.carteleria,
        subcontrataciones: orderData.subcontrataciones,
        entrega: orderData.entrega,
        terminado: false,
        createdAt: apiOrder.createdAt || new Date().toISOString(),
      };
      
      setOrders(prev => [newOrder, ...prev]);
      toast({
        title: "Pedido creado",
        description: `El pedido "${orderData.titulo}" ha sido creado exitosamente.`,
      });

      // Automatically open file upload dialog for the new order
      setNewOrderForUpload(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      if (error instanceof ApiError) {
        toast({
          title: "Error al crear pedido",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
    const order = orders.find(o => o.id === id);
    toast({
      title: "Pedido actualizado",
      description: `El pedido "${order?.titulo}" ha sido actualizado.`,
    });
  };

  const handleDeleteOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    setOrders(prev => prev.filter(order => order.id !== id));
    toast({
      title: "Pedido eliminado",
      description: `El pedido "${order?.titulo}" ha sido eliminado.`,
      variant: "destructive",
    });
  };

  const getStats = () => {
    const total = orders.length;
    const completed = orders.filter(o => o.terminado).length;
    const inProgress = orders.filter(o => !o.terminado).length;
    const pending = orders.filter(o => {
      const hasAnyStatus = [o.prueba, o.laser, o.trivor, o.manipulado, o.laminado, o.encuadernacion, o.carteleria, o.subcontrataciones].some(status => status !== 'SIN_ESTADO');
      return !hasAnyStatus;
    }).length;

    return { total, completed, inProgress, pending };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="sticky top-0 z-50 mb-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pedido</h1>
              <p className="text-muted-foreground">
                Administra y controla todos los pedidos de impresión
              </p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="w-fit">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pedido
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Total de pedidos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                Pedidos en proceso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                Pedidos terminados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sin Estado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Pedidos sin procesar
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTable 
              orders={orders} 
              onDeleteOrder={handleDeleteOrder}
              onUpdateOrder={handleUpdateOrder}
            />
          </CardContent>
        </Card>

        <OrderForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateOrder}
        />

        {newOrderForUpload && (
          <FileUploadDialog
            open={!!newOrderForUpload}
            orderTitle={newOrderForUpload.titulo}
            autoOpen={true}
            onOpenChange={(open) => {
              if (!open) setNewOrderForUpload(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
