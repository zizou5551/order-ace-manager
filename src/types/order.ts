export interface Order {
  id: string;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  persona: string;
  cantidad: number;
  producto: string;
  prueba: OrderStatus;
  laser: OrderStatus;
  trivor: OrderStatus;
  manipulado: OrderStatus;
  laminado: OrderStatus;
  encuadernacion: OrderStatus;
  carteleria: OrderStatus;
  subcontrataciones: OrderStatus;
  entrega: string;
  terminado: boolean;
  createdAt: string;
}

export type OrderStatus = 'HECHO' | 'EN_CURSO' | 'ESPERANDO' | 'PENDIENTE' | '';

export interface OrderFormData {
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  persona: string;
  cantidad: number;
  producto: string;
  prueba: OrderStatus;
  laser: OrderStatus;
  trivor: OrderStatus;
  manipulado: OrderStatus;
  laminado: OrderStatus;
  encuadernacion: OrderStatus;
  carteleria: OrderStatus;
  subcontrataciones: OrderStatus;
  entrega: string;
}