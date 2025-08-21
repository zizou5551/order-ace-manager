# Servidor de Archivos para Pedidos

## Instalación en el servidor (192.168.5.4)

### 1. Preparar el servidor
```bash
# Asegúrate de tener Node.js instalado
node --version
npm --version
```

### 2. Subir archivos al servidor
Copia estos archivos a una carpeta en tu servidor (ej: `C:\pedidos-server\`):
- `server.js`
- `server-package.json` (renómbralo a `package.json`)
- `install.bat`
- `start-server.bat`

### 3. Instalar dependencias
Ejecuta `install.bat` o manualmente:
```bash
npm install
```

### 4. Iniciar el servidor
Ejecuta `start-server.bat` o manualmente:
```bash
npm start
```

El servidor estará disponible en: `http://192.168.5.4:3001`

## Características

✅ **Carpetas automáticas**: Crea carpeta con el nombre del pedido
✅ **Ruta fija**: Guarda en `D:\Shared\TRABAJOS\[nombre-pedido]\`
✅ **Múltiples archivos**: Acepta varios archivos por pedido
✅ **Acceso red local**: Accesible desde cualquier PC de la red
✅ **Logs detallados**: Muestra información de cada archivo guardado
✅ **Control de errores**: Manejo de errores y validaciones

## Estructura de carpetas que se crea:
```
D:\Shared\TRABAJOS\
├── RTVE 2803\
│   ├── archivo1.pdf
│   ├── archivo2.docx
│   └── imagen.jpg
├── Otro Pedido\
│   └── documento.pdf
```

## URL del endpoint para la app:
`http://192.168.5.4:3001/api/upload`

## Prueba de funcionamiento:
Visita: `http://192.168.5.4:3001/api/test`