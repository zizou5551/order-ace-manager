
@echo off
chcp 65001 >nul 2>&1
echo ====================================
echo      DIAGNÓSTICO DEL SERVIDOR
echo ====================================
echo.

echo 1. Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js NO instalado
    goto end
)
echo ✅ Node.js OK
echo.

echo 2. Verificando npm...
npm --version
if %errorlevel% neq 0 (
    echo ❌ npm NO disponible
    goto end
)
echo ✅ npm OK
echo.

echo 3. Verificando archivos...
if exist "package.json" (
    echo ✅ package.json encontrado
) else (
    echo ❌ package.json NO encontrado
)

if exist "server.js" (
    echo ✅ server.js encontrado
) else (
    echo ❌ server.js NO encontrado
)

if exist "node_modules" (
    echo ✅ node_modules encontrado
) else (
    echo ❌ node_modules NO encontrado - Ejecuta install.bat
)
echo.

echo 4. Verificando carpeta de destino...
if exist "D:\Shared\TRABAJOS" (
    echo ✅ D:\Shared\TRABAJOS existe
) else (
    echo ⚠️  D:\Shared\TRABAJOS no existe - Se creará automáticamente
)
echo.

echo 5. Probando conexión de red...
ping -n 1 192.168.5.4 >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ IP 192.168.5.4 accesible
) else (
    echo ⚠️  No se puede hacer ping a 192.168.5.4
    echo     Verifica la configuración de red
)
echo.

:end
echo ====================================
echo Diagnóstico completado
echo ====================================
echo.
echo Si todo está OK, ejecuta: start-server.bat
echo.
pause
