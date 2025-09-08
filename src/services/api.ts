import { Order, OrderFormData, OrdersResponse, OrderResponse } from '@/types/order';

const BASE_URL = '';

export const api = {
  // Get all orders
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await fetch('/api/orders');
      const data: OrdersResponse = await response.json();
      
      if (!response.ok || !data.ok) {
        throw new Error('Error al cargar pedidos');
      }
      
      return data.orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Create or update order
  saveOrder: async (orderData: OrderFormData & { id?: string }): Promise<Order> => {
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const data: OrderResponse = await response.json();
      
      if (!response.ok || !data.ok) {
        throw new Error('Error al guardar pedido');
      }
      
      return data.order;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  },

  // Upload files
  uploadFiles: async (pedidoNombre: string, files: FileList): Promise<{ message: string; folder: string; count: number }> => {
    try {
      const formData = new FormData();
      formData.append('pedido', pedidoNombre);
      
      Array.from(files).forEach(file => {
        formData.append('files[]', file);
      });
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(data.error || 'Archivo demasiado grande');
        }
        throw new Error(data.error || 'Error al subir archivos');
      }
      
      return {
        message: data.message || 'Archivos subidos exitosamente',
        folder: data.folder || '',
        count: Array.from(files).length
      };
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },

  // Test connection
  testConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/test');
      return response.ok;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  }
};