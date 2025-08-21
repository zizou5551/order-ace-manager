
@echo off
chcp 65001 >nul 2>&1
echo ====================================
echo   SERVIDOR DE ARCHIVOS DE PEDIDOS
echo ====================================
echo.

:: Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js NO está instalado
    echo.
    echo Descarga e instala Node.js desde: https://nodejs.org
    echo.
    goto error
)

:: Verificar si package.json existe
if not exist "package.json" (
    echo ❌ ERROR: No se encuentra package.json
    echo Ejecuta primero install.bat
    echo.
    goto error
)

:: Verificar si node_modules existe
if not exist "node_modules" (
    echo ❌ ERROR: Dependencias no instaladas
    echo Ejecuta primero install.bat
    echo.
    goto error
)

:: Verificar si server.js existe
if not exist "server.js" (
    echo ❌ ERROR: No se encuentra server.js
    echo Verifica que todos los archivos estén en la carpeta
    echo.
    goto error
)

:: Crear carpeta de destino si no existe
if not exist "D:\Shared\TRABAJOS" (
    echo 📁 Creando carpeta: D:\Shared\TRABAJOS
    mkdir "D:\Shared\TRABAJOS" 2>nul
    if %errorlevel% neq 0 (
        echo ⚠️  No se pudo crear D:\Shared\TRABAJOS
        echo   Verifica permisos o crea la carpeta manualmente
        echo.
    )
)

echo ✅ Iniciando servidor...
echo.
echo 🌐 Servidor disponible en: http://192.168.5.4:3001
echo 📁 Archivos se guardan en: D:\Shared\TRABAJOS
echo.
echo ⚠️  NO CIERRES ESTA VENTANA - El servidor debe permanecer abierto
echo 🛑 Para detener el servidor presiona: Ctrl+C
echo.
echo ====================================
echo.

:: Iniciar el servidor
npm start

:: Si llegamos aquí, el servidor se detuvo
echo.
echo ⚠️  El servidor se ha detenido
echo.

:error
echo Presiona cualquier tecla para cerrar...
pause >nul
