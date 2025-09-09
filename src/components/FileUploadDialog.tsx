
import React, { useEffect, useState } from "react";
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
import { uploadFiles, ApiError } from "@/services/api";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderTitle: string;
  autoOpen?: boolean;
}

export function FileUploadDialog({ open, onOpenChange, orderTitle, autoOpen = false }: FileUploadDialogProps) {
  const [endpointUrl, setEndpointUrl] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const storageKey = "fileUploadEndpoint";

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setEndpointUrl(saved);
  }, []);

  const handleSaveEndpoint = (value: string) => {
    setEndpointUrl(value);
    localStorage.setItem(storageKey, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      toast({ title: "Sin archivos", description: "Selecciona archivos para subir" });
      return;
    }

    try {
      const result = await uploadFiles(orderTitle, Array.from(files));
      toast({
        title: "Archivos guardados correctamente",
        description: `Se guardaron ${files.length} archivo(s)`,
      });
      setFiles(null);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      if (error instanceof ApiError) {
        if (error.status === 413) {
          toast({
            title: "Archivo demasiado grande",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error al guardar archivos",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error al guardar archivos",
          description: "Verifica que el servidor esté funcionando correctamente",
          variant: "destructive",
        });
      }
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
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
              <Button type="button" variant="outline" onClick={handleSkip}>
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
