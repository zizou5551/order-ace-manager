import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderForm } from "@/components/OrderForm";
import { OrderTable } from "@/components/OrderTable";
import { FileUploadDialog } from "@/components/FileUploadDialog";
import { Order, OrderFormData } from "@/types/order";
import { Plus, Package, TrendingUp, Clock, CheckCircle, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { listOrders, saveOrder, deleteOrder, ApiError, ApiOrder } from "@/services/api";

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newOrderForUpload, setNewOrderForUpload] = useState<Order | null>(null);
  const [currentSection, setCurrentSection] = useState<Order["seccion"]>("carteleria");
  const [searchQuery, setSearchQuery] = useState("");

  // Load orders from backend
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await listOrders({ seccion: currentSection, q: searchQuery });
        // Convert backend orders to frontend format for compatibility
        const formattedOrders: Order[] = ordersData.map(apiOrder => ({
          id: apiOrder.id,
          nombre: apiOrder.nombre,
          cliente: apiOrder.cliente,
          estado: apiOrder.estado,
          notas: apiOrder.notas,
          seccion: (apiOrder.seccion as Order["seccion"]) || 'carteleria',
          createdAt: apiOrder.createdAt || new Date().toISOString(),
          updatedAt: apiOrder.updatedAt || new Date().toISOString(),
          // Legacy fields for compatibility with existing UI
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
  }, [currentSection, searchQuery]);

  const handleCreateOrder = async (orderData: OrderFormData) => {
    try {
      const apiOrder = await saveOrder({
        nombre: orderData.titulo,
        cliente: orderData.persona,
        estado: 'nuevo',
        notas: orderData.descripcion,
        seccion: orderData.seccion,
      });
      
      // Convert API response to frontend format
      const newOrder: Order = {
        id: apiOrder.id,
        nombre: apiOrder.nombre,
        cliente: apiOrder.cliente,
        estado: apiOrder.estado,
        notas: apiOrder.notas,
        seccion: apiOrder.seccion as Order["seccion"] || 'carteleria',
        createdAt: apiOrder.createdAt || new Date().toISOString(),
        updatedAt: apiOrder.updatedAt || new Date().toISOString(),
        // Legacy fields for compatibility with existing UI
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

  const handleDeleteOrder = async (id: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    const confirmed = window.confirm(`¿Estás seguro de que quieres eliminar el pedido "${order.titulo}"?`);
    if (!confirmed) return;
    
    try {
      await deleteOrder(id);
      setOrders(prev => prev.filter(order => order.id !== id));
      toast({
        title: "Pedido eliminado",
        description: `El pedido "${order.titulo}" ha sido eliminado.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      if (error instanceof ApiError) {
        toast({
          title: "Error al eliminar pedido",
          description: error.message,
          variant: "destructive",
        });
      }
    }
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle>Lista de Pedidos</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pedidos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[250px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as Order["seccion"])}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="carteleria">Cartelería</TabsTrigger>
                <TabsTrigger value="trivor">Trivor</TabsTrigger>
                <TabsTrigger value="manipulados">Manipulados</TabsTrigger>
                <TabsTrigger value="logistica">Logística</TabsTrigger>
                <TabsTrigger value="impresion digital">Impresión Digital</TabsTrigger>
              </TabsList>
              
              {(["carteleria", "trivor", "manipulados", "logistica", "impresion digital"] as const).map((section) => (
                <TabsContent key={section} value={section} className="mt-6">
                  <OrderTable 
                    orders={orders.filter(order => order.seccion === section)} 
                    onDeleteOrder={handleDeleteOrder}
                    onUpdateOrder={handleUpdateOrder}
                  />
                </TabsContent>
              ))}
            </Tabs>
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
