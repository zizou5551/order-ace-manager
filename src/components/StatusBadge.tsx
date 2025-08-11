import { Badge } from "@/components/ui/badge";
import { OrderStatus, ProofStatus, ProcessStatus } from "@/types/order";

interface StatusBadgeProps {
  status: OrderStatus | ProofStatus | ProcessStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status || status === 'SIN_ESTADO' || status === 'SIN_SELECCION') return null;

  const getVariant = (status: string) => {
    switch (status) {
      case 'HECHO':
      case 'OK CLIENTE':
        return 'completed';
      case 'EN_CURSO':
      case 'ENVIADA PRUEBA':
        return 'in-progress';
      case 'ESPERANDO':
      case 'PARADO':
        return 'pending';
      case 'PENDIENTE':
      case 'FERRO DIGITAL':
        return 'waiting';
      default:
        return 'default';
    }
  };

  const getLabel = (status: string) => {
    switch (status) {
      case 'HECHO':
        return 'Hecho';
      case 'EN_CURSO':
        return 'En Curso';
      case 'ESPERANDO':
        return 'Esperando';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'SIN_ESTADO':
        return 'Sin estado';
      case 'OK CLIENTE':
        return 'OK Cliente';
      case 'ENVIADA PRUEBA':
        return 'Enviada Prueba';
      case 'PARADO':
        return 'Parado';
      case 'FERRO DIGITAL':
        return 'Ferro Digital';
      default:
        return status;
    }
  };

  return (
    <Badge variant={getVariant(status)}>
      {getLabel(status)}
    </Badge>
  );
}