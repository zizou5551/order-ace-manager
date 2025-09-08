import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderTitle: string;
  autoOpen?: boolean;
}

export function FileUploadDialog({ open, onOpenChange, orderTitle, autoOpen = false }: FileUploadDialogProps) {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files || files.length === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona al menos un archivo",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('pedido', orderTitle);
      
      Array.from(files).forEach(file => {
        formData.append('files[]', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(result.error || 'Archivo demasiado grande');
        }
        throw new Error(result.error || `Error ${response.status}: ${response.statusText}`);
      }

      toast({
        title: "Archivos subidos exitosamente",
        description: `Se subieron ${files.length} archivo(s) para el pedido: ${orderTitle}${result.folder ? ` en la carpeta: ${result.folder}` : ''}`,
      });
      
      setFiles(null);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error al subir archivos",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {autoOpen ? "¿Quieres subir archivos ahora?" : "Subir archivos"}
          </DialogTitle>
          <DialogDescription>
            Pedido: <span className="font-medium">{orderTitle}</span>
            <br />
            {autoOpen && "Se ha creado el pedido. Puedes subir archivos ahora o hacerlo más tarde."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="files">Archivos del pedido</Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <p className="text-xs text-muted-foreground">
              Selecciona todos los archivos relacionados con este pedido
            </p>
          </div>

          <DialogFooter className="gap-2">
            {autoOpen && (
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Subir más tarde
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar archivos</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}