// Backend API structure
export interface Order {
  id: string;
  nombre: string;
  cliente?: string;
  estado?: string;
  notas?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderFormData {
  nombre: string;
  cliente?: string;
  estado?: string;
  notas?: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface OrdersResponse {
  ok: boolean;
  orders: Order[];
}

export interface OrderResponse {
  ok: boolean;
  order: Order;
}