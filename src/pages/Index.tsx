import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderForm } from "@/components/OrderForm";
import { OrderTable } from "@/components/OrderTable";
import { Order, OrderFormData } from "@/types/order";
import { Plus, Package, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load initial data with sample order
  useEffect(() => {
    const sampleOrder: Order = {
      id: '1',
      titulo: 'RTVE 2803',
      descripcion: '2 COPIAS DE 1 MANUAL TAMAÑO DIN A4 IMPRESOS A 1/1 NEGRO EN PAPEL OFFSET DE 80GR.\nENCUADERNADOS EN ESPIRAL METÁLICA NEGRA, CON ACETATOS TRASLUCIDO DELANTE, NEGRO DETRÁS.\nENCUADERNAR POR ORDEN NUMÉRICO\nENVIO A:\nHELENA FORTEZA GARCÍA\nPROGRAMA: "LOS CONCIERTOS DE LA 2"\nEDIF. TVE DESP. 420\nAVDA. DE LA RADIO TELEVISIÓN, Nº 4\n28223 POZUELO DE ALARCÓN-MADRID-',
      fechaEntrega: '2024-09-30',
      persona: 'Helena Forteza García',
      cantidad: 2,
      producto: 'ESPIRALES',
      prueba: 'SIN_ESTADO',
      laser: 'HECHO',
      trivor: 'SIN_ESTADO',
      manipulado: 'SIN_ESTADO',
      laminado: 'SIN_ESTADO',
      encuadernacion: 'EN_CURSO',
      carteleria: 'SIN_ESTADO',
      subcontrataciones: 'SIN_ESTADO',
      entrega: 'AGENCIA DE TRANSPORTES - GLS',
      terminado: false,
      createdAt: new Date().toISOString(),
    };
    setOrders([sampleOrder]);
  }, []);

  const handleCreateOrder = (orderData: OrderFormData) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      ...orderData,
      terminado: false,
      createdAt: new Date().toISOString(),
    };
    
    setOrders(prev => [newOrder, ...prev]);
    toast({
      title: "Pedido creado",
      description: `El pedido "${orderData.titulo}" ha sido creado exitosamente.`,
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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestión de Pedidos</h1>
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

        {/* Stats Cards */}
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

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTable 
              orders={orders} 
              onDeleteOrder={handleDeleteOrder}
            />
          </CardContent>
        </Card>

        {/* Order Form Modal */}
        <OrderForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateOrder}
        />
      </div>
    </div>
  );
};

export default Index;