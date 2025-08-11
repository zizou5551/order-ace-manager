import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order";

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status || status === 'SIN_ESTADO') return null;

  const getVariant = (status: OrderStatus) => {
    switch (status) {
      case 'HECHO':
        return 'completed';
      case 'EN_CURSO':
        return 'in-progress';
      case 'ESPERANDO':
        return 'pending';
      case 'PENDIENTE':
        return 'waiting';
      default:
        return 'default';
    }
  };

  const getLabel = (status: OrderStatus) => {
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