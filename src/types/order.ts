export interface Order {
  id: string;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  persona: string;
  cantidad: number;
  producto: ProductType;
  prueba: ProofStatus;
  laser: ProcessStatus;
  trivor: ProcessStatus;
  manipulado: ProcessStatus;
  laminado: ProcessStatus;
  encuadernacion: ProcessStatus;
  carteleria: ProcessStatus;
  subcontrataciones: ProcessStatus;
  entrega: DeliveryType;
  terminado: boolean;
  createdAt: string;
}

export type OrderStatus = 'HECHO' | 'EN_CURSO' | 'ESPERANDO' | 'PENDIENTE' | 'SIN_ESTADO';

export type ProductType = 'LIBROS' | 'REVISTAS' | 'DIPTICOS / TRIPTICOS' | 'TARJETAS / TARJETONES / FLYERS' | 'WIRE-O' | 'CARPETAS ANILLAS' | 'CARTELES' | 'OTROS' | 'SIN_SELECCION';

export type ProofStatus = 'ESPERANDO' | 'OK CLIENTE' | 'ENVIADA PRUEBA' | 'PARADO' | 'FERRO DIGITAL' | 'SIN_ESTADO';

export type ProcessStatus = 'ESPERANDO' | 'EN_CURSO' | 'SIN_ESTADO';

export type DeliveryType = 'RECOGE EN FRAGMA' | '2814' | 'AVISAR' | 'ENTREGA IMEDISA' | 'ENTREGA JUANILLO' | 'JUANILLO' | 'STOCK FRAGMA' | 'SIN_SELECCION';

export interface OrderFormData {
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  persona: string;
  cantidad: number;
  producto: ProductType;
  prueba: ProofStatus;
  laser: ProcessStatus;
  trivor: ProcessStatus;
  manipulado: ProcessStatus;
  laminado: ProcessStatus;
  encuadernacion: ProcessStatus;
  carteleria: ProcessStatus;
  subcontrataciones: ProcessStatus;
  entrega: DeliveryType;
}