export interface ApiOrder {
  id: string;
  nombre: string;
  cliente?: string;
  estado?: string;
  notas?: string;
  seccion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  orders?: T[];
  order?: T;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const listOrders = async (params?: { seccion?: string; q?: string }): Promise<ApiOrder[]> => {
  try {
    const url = new URL('/api/orders', window.location.origin);
    if (params?.seccion) url.searchParams.set('seccion', params.seccion);
    if (params?.q) url.searchParams.set('q', params.q);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new ApiError(`Error ${response.status}`, response.status);
    }
    
    const data: ApiResponse<ApiOrder> = await response.json();
    
    if (!data.ok) {
      throw new ApiError(data.message || 'Error al obtener pedidos');
    }
    
    return data.orders || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Error de conexión al servidor');
  }
};

export const saveOrder = async (input: { id?: string; nombre: string; cliente?: string; estado?: string; notas?: string; seccion?: string }): Promise<ApiOrder> => {
  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      throw new ApiError(`Error ${response.status}`, response.status);
    }
    
    const data: ApiResponse<ApiOrder> = await response.json();
    
    if (!data.ok || !data.order) {
      throw new ApiError(data.message || 'Error al guardar pedido');
    }
    
    return data.order;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Error de conexión al servidor');
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new ApiError(`Error ${response.status}`, response.status);
    }
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new ApiError(data.message || 'Error al eliminar pedido');
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Error de conexión al servidor');
  }
};

export const uploadFiles = async (pedido: string, files: File[]): Promise<{ success: boolean; path: string; files: { filename: string; size: number }[] }> => {
  try {
    const formData = new FormData();
    formData.append('pedido', pedido);
    files.forEach((file) => formData.append('files[]', file));
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      if (response.status === 413) {
        const errorData = await response.json();
        throw new ApiError(errorData.message || 'Archivo demasiado grande', 413, errorData);
      }
      throw new ApiError(`Error ${response.status}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Error de conexión al servidor');
  }
};