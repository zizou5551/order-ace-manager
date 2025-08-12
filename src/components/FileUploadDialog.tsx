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
}

export function FileUploadDialog({ open, onOpenChange, orderTitle }: FileUploadDialogProps) {
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
        description: "Introduce la URL del endpoint en tu Lightsail",
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
    Array.from(files).forEach((file) => formData.append("files[]", file));

    try {
      const res = await fetch(endpointUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      toast({
        title: "Subida completada",
        description: `Se enviaron ${files.length} archivo(s) para el pedido "${orderTitle}"`,
      });
      setFiles(null);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al subir",
        description: "Verifica CORS y el endpoint del servidor",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir archivos</DialogTitle>
          <DialogDescription>
            Pedido: <span className="font-medium">{orderTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint de tu servidor (HTTPS)</Label>
            <Input
              id="endpoint"
              placeholder="https://tu-dominio/api/upload"
              value={endpointUrl}
              onChange={(e) => handleSaveEndpoint(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              El servicio debe crear la carpeta con el nombre del pedido y guardar los archivos dentro.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Archivos</Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <p className="text-xs text-muted-foreground">
              Se enviarán como multipart/form-data con campos: pedido y files[]
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Subir</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
