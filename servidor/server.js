const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Permitir CORS para todas las IPs de la red local
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Configurar multer para manejar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const pedido = req.body.pedido;
    const baseDir = 'D:\\Shared\\TRABAJOS';
    const pedidoDir = path.join(baseDir, pedido);
    
    // Crear carpeta si no existe
    if (!fs.existsSync(pedidoDir)) {
      fs.mkdirSync(pedidoDir, { recursive: true });
    }
    
    cb(null, pedidoDir);
  },
  filename: (req, file, cb) => {
    // Mantener el nombre original del archivo
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB por archivo
  }
});

// Endpoint para subir archivos
app.post('/api/upload', upload.array('files[]'), (req, res) => {
  try {
    const { pedido } = req.body;
    const files = req.files;

    if (!pedido) {
      return res.status(400).json({ 
        error: 'El nombre del pedido es requerido' 
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ 
        error: 'No se recibieron archivos' 
      });
    }

    console.log(`✅ Pedido: ${pedido}`);
    console.log(`📁 Carpeta creada: D:\\Shared\\TRABAJOS\\${pedido}`);
    console.log(`📄 Archivos guardados: ${files.length}`);
    
    files.forEach(file => {
      console.log(`   - ${file.originalname} (${(file.size / 1024).toFixed(2)} KB)`);
    });

    res.json({
      success: true,
      message: `Se guardaron ${files.length} archivo(s) correctamente`,
      pedido: pedido,
      files: files.map(f => f.originalname),
      path: `D:\\Shared\\TRABAJOS\\${pedido}`
    });

  } catch (error) {
    console.error('❌ Error al procesar archivos:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    server: '192.168.5.4:3001'
  });
});

// Middleware para errores de multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'El archivo es demasiado grande (máximo 100MB)'
      });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`🌐 Accesible desde: http://192.168.5.4:${PORT}`);
  console.log(`📁 Carpeta de destino: D:\\Shared\\TRABAJOS`);
  console.log(`✅ Listo para recibir archivos...`);
});