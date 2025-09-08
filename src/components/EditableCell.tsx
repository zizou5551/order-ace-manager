import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableCellProps {
  value: string;
  onSave: (value: string) => void;
  type?: 'text' | 'textarea' | 'estado';
  className?: string;
}

const estadoOptions = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'revision', label: 'Revisión' },
  { value: 'completado', label: 'Completado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' }
];

export const EditableCell = ({ value, onSave, type = 'text', className }: EditableCellProps) => {
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

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'completado':
      case 'entregado':
        return 'default';
      case 'en_proceso':
      case 'revision':
        return 'secondary';
      case 'cancelado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            className="min-h-[60px]"
            autoFocus
          />
        );
      
      case 'estado':
        return (
          <Select value={editValue} onValueChange={setEditValue}>
            <SelectTrigger className="w-fit min-w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {estadoOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            autoFocus
          />
        );
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        {renderInput()}
        <div className="flex gap-1">
          <Button size="sm" onClick={handleSave} className="h-6 px-2">
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 px-2">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  const displayValue = () => {
    if (type === 'estado') {
      const estadoOption = estadoOptions.find(opt => opt.value === value);
      return (
        <Badge variant={getEstadoBadgeVariant(value)}>
          {estadoOption?.label || value || 'Nuevo'}
        </Badge>
      );
    }
    
    if (type === 'textarea') {
      return (
        <div className="max-w-xs truncate" title={value}>
          {value || 'Sin notas'}
        </div>
      );
    }
    
    return value || 'Sin valor';
  };

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded px-1 py-0.5 hover:bg-muted/50 transition-colors",
        className
      )}
      onClick={() => setIsEditing(true)}
    >
      {displayValue()}
      <Edit className="absolute right-1 top-1 h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
    </div>
  );
};