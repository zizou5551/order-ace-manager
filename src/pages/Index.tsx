import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderForm } from "@/components/OrderForm";
import { OrderTable } from "@/components/OrderTable";
import { FileUploadDialog } from "@/components/FileUploadDialog";
import { Order, OrderFormData } from "@/types/order";
import { api } from "@/services/api";
import { Plus, Package, TrendingUp, Clock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newOrderForUpload, setNewOrderForUpload] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from backend
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const ordersData = await api.getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading orders:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los pedidos. Verifique la conexión con el servidor.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleCreateOrder = async (orderData: OrderFormData) => {
    try {
      const newOrder = await api.saveOrder({
        ...orderData,
        estado: orderData.estado || 'nuevo'
      });
      
      setOrders(prev => [newOrder, ...prev]);
      toast({
        title: "Pedido creado",
        description: `El pedido "${orderData.nombre}" ha sido creado exitosamente.`,
      });

      // Automatically open file upload dialog for the new order
      setNewOrderForUpload(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el pedido. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const orderToUpdate = orders.find(o => o.id === id);
      if (!orderToUpdate) return;

      const updatedOrder = await api.saveOrder({
        ...orderToUpdate,
        ...updates,
        id
      });

      setOrders(prev => prev.map(order => 
        order.id === id ? updatedOrder : order
      ));
      
      toast({
        title: "Pedido actualizado",
        description: `El pedido "${updatedOrder.nombre}" ha sido actualizado.`,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el pedido. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    setOrders(prev => prev.filter(order => order.id !== id));
    toast({
      title: "Pedido eliminado",
      description: `El pedido "${order?.nombre}" ha sido eliminado.`,
      variant: "destructive",
    });
  };

  const getStats = () => {
    const total = orders.length;
    const completed = orders.filter(o => o.estado === 'completado' || o.estado === 'entregado').length;
    const inProgress = orders.filter(o => o.estado && o.estado !== 'nuevo' && o.estado !== 'completado' && o.estado !== 'entregado').length;
    const pending = orders.filter(o => !o.estado || o.estado === 'nuevo').length;

    return { total, completed, inProgress, pending };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-none py-4 px-4 md:px-6">
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

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Cargando pedidos...</span>
              </div>
            ) : (
              <OrderTable 
                orders={orders} 
                onDeleteOrder={handleDeleteOrder}
                onUpdateOrder={handleUpdateOrder}
              />
            )}
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
            orderTitle={newOrderForUpload.nombre}
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
