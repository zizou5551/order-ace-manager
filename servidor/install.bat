@echo off
echo ====================================
echo   INSTALADOR SERVIDOR DE PEDIDOS
echo ====================================
echo.
echo Instalando dependencias del servidor...
echo.
npm install
echo.
if %errorlevel% == 0 (
    echo ✅ Dependencias instaladas correctamente.
    echo.
    echo Para iniciar el servidor ejecuta: start-server.bat
    echo o manualmente: npm start
) else (
    echo ❌ Error al instalar dependencias.
    echo Verifica que Node.js esté instalado correctamente.
)
echo.
pause