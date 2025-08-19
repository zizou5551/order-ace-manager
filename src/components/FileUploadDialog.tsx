
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
    if (!endpointUrl) {
      toast({
        title: "Configura el servidor",
        description: "Introduce la URL del endpoint de tu servidor de dominio",
        variant: "destructive",
      });
      return;
    }
    if (!files || files.length === 0) {
      toast({ title: "Sin archivos", description: "Selecciona archivos para subir" });
      return;
    }

    const formData = new FormData();
    formData.append("pedido", orderTitle);
    formData.append("ruta", "D:\\Shared\\TRABAJOS");
    Array.from(files).forEach((file) => formData.append("files[]", file));

    try {
      const res = await fetch(endpointUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result = await res.json();
      toast({
        title: "Archivos guardados correctamente",
        description: `Se guardaron ${files.length} archivo(s) en D:\\Shared\\TRABAJOS\\${orderTitle}`,
      });
      setFiles(null);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al guardar archivos",
        description: "Verifica que el servidor esté funcionando correctamente",
        variant: "destructive",
      });
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
            <Label htmlFor="endpoint">Endpoint del servidor de tu empresa</Label>
            <Input
              id="endpoint"
              placeholder="https://tu-dominio-empresa.com/api/upload"
              value={endpointUrl}
              onChange={(e) => handleSaveEndpoint(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Los archivos se guardarán automáticamente en: D:\Shared\TRABAJOS\{orderTitle}
            </p>
          </div>

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
