import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, X, Edit } from "lucide-react";
import { ProductType, ProofStatus, ProcessStatus, DeliveryType } from "@/types/order";

interface EditableCellProps {
  value: string | number;
  onSave: (value: any) => void;
  type?: 'text' | 'number' | 'date' | 'product' | 'proof' | 'process' | 'delivery';
  className?: string;
}

const productOptions: ProductType[] = ['SIN_SELECCION', 'LIBROS', 'REVISTAS', 'DIPTICOS / TRIPTICOS', 'TARJETAS / TARJETONES / FLYERS', 'WIRE-O', 'CARPETAS ANILLAS', 'CARTELES', 'OTROS'];
const proofOptions: ProofStatus[] = ['SIN_ESTADO', 'ESPERANDO', 'OK CLIENTE', 'ENVIADA PRUEBA', 'PARADO', 'FERRO DIGITAL'];
const processOptions: ProcessStatus[] = ['SIN_ESTADO', 'ESPERANDO', 'EN_CURSO'];
const deliveryOptions: DeliveryType[] = ['SIN_SELECCION', 'RECOGE EN FRAGMA', '2814', 'AVISAR', 'ENTREGA IMEDISA', 'ENTREGA JUANILLO', 'JUANILLO', 'STOCK FRAGMA'];

export function EditableCell({ value, onSave, type = 'text', className }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const renderInput = () => {
    switch (type) {
      case 'product':
        return (
          <Select value={editValue as string} onValueChange={setEditValue}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {productOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === 'SIN_SELECCION' ? 'Sin selección' : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'proof':
        return (
          <Select value={editValue as string} onValueChange={setEditValue}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {proofOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === 'SIN_ESTADO' ? 'Sin estado' :
                   option === 'OK CLIENTE' ? 'OK Cliente' :
                   option === 'ENVIADA PRUEBA' ? 'Enviada Prueba' :
                   option === 'FERRO DIGITAL' ? 'Ferro Digital' : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'process':
        return (
          <Select value={editValue as string} onValueChange={setEditValue}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {processOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === 'SIN_ESTADO' ? 'Sin estado' :
                   option === 'EN_CURSO' ? 'En Curso' : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'delivery':
        return (
          <Select value={editValue as string} onValueChange={setEditValue}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {deliveryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === 'SIN_SELECCION' ? 'Sin selección' : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value === '' ? 0 : parseInt(e.target.value))}
            className="h-8"
            autoFocus
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={editValue as string}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8"
            autoFocus
          />
        );
      default:
        return (
          <Input
            value={editValue as string}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8"
            autoFocus
          />
        );
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-[200px]">
        <div className="flex-1">
          {renderInput()}
        </div>
        <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0">
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between group cursor-pointer ${className}`} onClick={() => setIsEditing(true)}>
      <span className="flex-1 min-h-[32px] flex items-center">
        {type === 'product' && value === 'SIN_SELECCION' ? 'Sin selección' :
         type === 'delivery' && value === 'SIN_SELECCION' ? 'Sin selección' :
         type === 'proof' && value === 'SIN_ESTADO' ? 'Sin estado' :
         type === 'process' && value === 'SIN_ESTADO' ? 'Sin estado' :
         value || '-'}
      </span>
      <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
    </div>
  );
}