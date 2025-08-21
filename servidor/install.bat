
@echo off
chcp 65001 >nul 2>&1
echo ====================================
echo   INSTALADOR SERVIDOR DE PEDIDOS
echo ====================================
echo.

:: Verificar si Node.js está instalado
echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js NO está instalado
    echo.
    echo Descarga e instala Node.js desde: https://nodejs.org
    echo Necesitas la versión LTS más reciente
    echo.
    goto end
)

echo ✅ Node.js encontrado: 
node --version
echo.

:: Verificar si npm está disponible
echo Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: npm NO está disponible
    echo.
    goto end
)

echo ✅ npm encontrado: 
npm --version
echo.

:: Verificar si package.json existe
if not exist "package.json" (
    echo ❌ ERROR: No se encuentra package.json
    echo Asegúrate de estar en la carpeta correcta
    echo.
    goto end
)

echo ✅ package.json encontrado
echo.

:: Instalar dependencias
echo Instalando dependencias del servidor...
echo Esto puede tomar unos minutos...
echo.
npm install

if %errorlevel% == 0 (
    echo.
    echo ✅ ¡Dependencias instaladas correctamente!
    echo.
    echo 🚀 Para iniciar el servidor ejecuta: start-server.bat
    echo    o manualmente: npm start
    echo.
) else (
    echo.
    echo ❌ Error al instalar dependencias.
    echo.
    echo Posibles soluciones:
    echo 1. Ejecutar como Administrador
    echo 2. Verificar conexión a internet
    echo 3. Limpiar caché: npm cache clean --force
    echo.
)

:end
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
