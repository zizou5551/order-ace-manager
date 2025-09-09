# Order Management System

Sistema de gestión de pedidos de imprenta con React frontend y Node.js backend.

## Características

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Persistencia**: JSON file-based storage
- **Subida de archivos**: Multer con límites configurables
- **Secciones**: Cartelería, Trivor, Manipulados, Logística, Impresión Digital
- **Filtros**: Por sección y búsqueda de texto libre
- **Red local**: Accesible desde otros equipos de la LAN

## Instalación en Windows 11

### Prerrequisitos

1. **Instalar Node.js LTS**
   - Descargar desde: https://nodejs.org/
   - Versión recomendada: LTS (Long Term Support)

### Configuración del Backend

1. **Abrir PowerShell como Administrador**

2. **Navegar al directorio del proyecto**
   ```powershell
   cd C:\order-ace-manager
   ```

3. **Instalar dependencias del backend**
   ```powershell
   npm install
   ```

4. **Crear archivo de configuración**
   - Copiar `.env.example` a `.env`
   - Ajustar las rutas según tu configuración:
   ```env
   DOMAIN=192.168.1.100    # Tu IP local
   PORT=80
   UPLOADS_ROOT=D:\Shared\TRABAJOS
   FRONTEND_DIR=C:\order-ace-manager\frontend\dist
   DATA_DIR=C:\order-ace-manager\data
   MAX_FILE_MB=500
   MAX_FILES=100
   ```

### Configuración del Frontend

1. **Navegar al directorio del frontend**
   ```powershell
   cd frontend
   ```

2. **Instalar dependencias**
   ```powershell
   npm install
   ```

3. **Compilar para producción**
   ```powershell
   npm run build
   ```

4. **Copiar archivos compilados**
   ```powershell
   xcopy /E /I /Y dist C:\order-ace-manager\frontend\dist
   ```

### Instalación del servicio con PM2

1. **Instalar PM2 globalmente**
   ```powershell
   npm install -g pm2
   ```

2. **Iniciar la aplicación**
   ```powershell
   pm2 start server.js --name order-api
   ```

3. **Guardar configuración de PM2**
   ```powershell
   pm2 save
   ```

4. **Configurar auto-inicio al arrancar Windows**
   ```powershell
   pm2 startup
   ```
   - Ejecutar el comando que PM2 muestra en pantalla

### Verificación

1. **Probar el servidor**
   - Abrir navegador en: `http://localhost/api/test`
   - Debe mostrar: `{"ok":true,"msg":"Servidor funcionando correctamente"}`

2. **Acceder a la aplicación**
   - URL local: `http://localhost/`
   - URL en LAN: `http://[TU-IP]/`

## Uso

### Gestión de Pedidos

1. **Crear pedido**:
   - Hacer clic en "Nuevo Pedido"
   - Completar formulario (nombre y sección son obligatorios)
   - Guardar

2. **Filtrar pedidos**:
   - Usar las pestañas para cambiar de sección
   - Usar el campo de búsqueda para filtrar por texto

3. **Eliminar pedidos**:
   - Hacer clic en el icono de papelera
   - Confirmar la eliminación

4. **Subir archivos**:
   - Hacer clic en el icono de subida en la tabla
   - Seleccionar archivos múltiples
   - Los archivos se guardan en: `UPLOADS_ROOT\[nombre-del-pedido]\`

### Endpoints de la API

- `GET /api/test` - Verificar estado del servidor
- `GET /api/orders?seccion=...&q=...` - Obtener pedidos
- `POST /api/order` - Crear/actualizar pedido
- `DELETE /api/orders/:id` - Eliminar pedido
- `POST /api/upload` - Subir archivos

## Estructura de Directorios

```
C:\order-ace-manager\
├── server.js              # Servidor backend
├── package.json           # Dependencias backend
├── .env                   # Configuración
├── frontend\
│   ├── dist\              # Frontend compilado
│   └── src\               # Código fuente frontend
├── data\
│   └── orders.json        # Base de datos de pedidos
└── README.md
```

## Comandos de PM2 Útiles

```powershell
# Ver estado de procesos
pm2 status

# Ver logs en tiempo real
pm2 logs order-api

# Reiniciar aplicación
pm2 restart order-api

# Detener aplicación
pm2 stop order-api

# Eliminar aplicación de PM2
pm2 delete order-api
```

## Solución de Problemas

### El servidor no arranca en puerto 80
- Verificar que no hay otros servicios usando el puerto 80
- Cambiar el puerto en el archivo `.env` si es necesario

### No se pueden subir archivos
- Verificar que la ruta `UPLOADS_ROOT` existe y tiene permisos de escritura
- Verificar que el tamaño del archivo no excede `MAX_FILE_MB`

### La aplicación no es accesible desde otros equipos
- Verificar la configuración del firewall de Windows
- Verificar que `DOMAIN` en `.env` contiene la IP correcta
- Verificar que el servidor está escuchando en `0.0.0.0`

### Los pedidos no se guardan
- Verificar que la ruta `DATA_DIR` existe y tiene permisos de escritura
- Verificar los logs con `pm2 logs order-api`

## Desarrollo

Para desarrollo local:

```powershell
# Backend (modo desarrollo)
npm run dev

# Frontend (modo desarrollo)
cd frontend
npm run dev
```

## Licencia

Uso interno de la empresa.