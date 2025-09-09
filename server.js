const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;
const DOMAIN = process.env.DOMAIN || 'localhost';
const UPLOADS_ROOT = process.env.UPLOADS_ROOT || 'D:\\Shared\\TRABAJOS';
const FRONTEND_DIR = process.env.FRONTEND_DIR || 'C:\\order-ace-manager\\frontend\\dist';
const DATA_DIR = process.env.DATA_DIR || 'C:\\order-ace-manager\\data';
const MAX_FILE_MB = parseInt(process.env.MAX_FILE_MB) || 500;
const MAX_FILES = parseInt(process.env.MAX_FILES) || 100;

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Create directories if they don't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

ensureDirectoryExists(DATA_DIR);
ensureDirectoryExists(UPLOADS_ROOT);

// Load orders from file
function loadOrders() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

// Save orders to file (atomic write)
function saveOrders(orders) {
  try {
    const tempFile = ORDERS_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(orders, null, 2), 'utf8');
    fs.renameSync(tempFile, ORDERS_FILE);
    return true;
  } catch (error) {
    console.error('Error saving orders:', error);
    return false;
  }
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const pedido = req.body.pedido || 'sin-nombre';
    const uploadPath = path.join(UPLOADS_ROOT, pedido);
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_MB * 1024 * 1024, // Convert MB to bytes
    files: MAX_FILES
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now
    cb(null, true);
  }
});

// API Routes

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ ok: true, msg: 'Servidor funcionando correctamente' });
});

// Get orders
app.get('/api/orders', (req, res) => {
  try {
    let orders = loadOrders();
    const { seccion, q } = req.query;
    
    // Filter by section
    if (seccion) {
      orders = orders.filter(order => order.seccion === seccion);
    }
    
    // Filter by search query (name, client, status, notes)
    if (q) {
      const query = q.toLowerCase();
      orders = orders.filter(order => 
        (order.nombre && order.nombre.toLowerCase().includes(query)) ||
        (order.cliente && order.cliente.toLowerCase().includes(query)) ||
        (order.estado && order.estado.toLowerCase().includes(query)) ||
        (order.notas && order.notas.toLowerCase().includes(query))
      );
    }
    
    // Sort by updatedAt descending
    orders.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    res.json({ ok: true, orders });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// Create or update order
app.post('/api/order', (req, res) => {
  try {
    const { id, nombre, cliente, estado, notas, seccion } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ ok: false, message: 'El nombre es requerido' });
    }
    
    if (!seccion) {
      return res.status(400).json({ ok: false, message: 'La sección es requerida' });
    }
    
    const orders = loadOrders();
    const now = new Date().toISOString();
    
    let order;
    
    if (id) {
      // Update existing order
      const orderIndex = orders.findIndex(o => o.id === id);
      if (orderIndex === -1) {
        return res.status(404).json({ ok: false, message: 'Pedido no encontrado' });
      }
      
      order = {
        ...orders[orderIndex],
        nombre,
        cliente: cliente || '',
        estado: estado || 'nuevo',
        notas: notas || '',
        seccion,
        updatedAt: now
      };
      
      orders[orderIndex] = order;
    } else {
      // Create new order
      order = {
        id: uuidv4(),
        nombre,
        cliente: cliente || '',
        estado: estado || 'nuevo',
        notas: notas || '',
        seccion,
        createdAt: now,
        updatedAt: now
      };
      
      orders.push(order);
    }
    
    if (saveOrders(orders)) {
      res.json({ ok: true, order });
    } else {
      res.status(500).json({ ok: false, message: 'Error al guardar el pedido' });
    }
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const orders = loadOrders();
    
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ ok: false, message: 'Pedido no encontrado' });
    }
    
    orders.splice(orderIndex, 1);
    
    if (saveOrders(orders)) {
      res.json({ ok: true });
    } else {
      res.status(500).json({ ok: false, message: 'Error al eliminar el pedido' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// Upload files
app.post('/api/upload', upload.array('files[]'), (req, res) => {
  try {
    const pedido = req.body.pedido;
    const files = req.files;
    
    if (!pedido) {
      return res.status(400).json({ ok: false, error: 'El nombre del pedido es requerido' });
    }
    
    if (!files || files.length === 0) {
      return res.status(400).json({ ok: false, error: 'No se han enviado archivos' });
    }
    
    const uploadPath = path.join(UPLOADS_ROOT, pedido);
    const fileDetails = files.map(file => ({
      filename: file.originalname,
      size: file.size
    }));
    
    res.json({
      success: true,
      path: uploadPath,
      files: fileDetails
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        ok: false,
        error: `Archivo demasiado grande. Límite: ${MAX_FILE_MB}MB`
      });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      res.status(413).json({
        ok: false,
        error: `Demasiados archivos. Límite: ${MAX_FILES} archivos`
      });
    } else {
      res.status(500).json({
        ok: false,
        error: 'Error interno del servidor'
      });
    }
  }
});

// Serve frontend
if (fs.existsSync(FRONTEND_DIR)) {
  app.use(express.static(FRONTEND_DIR));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
    } else {
      res.status(404).json({ ok: false, message: 'API endpoint not found' });
    }
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== Order Management Server ===`);
  console.log(`Server running on: http://${DOMAIN}:${PORT}`);
  console.log(`API Test URL: http://${DOMAIN}:${PORT}/api/test`);
  console.log(`Uploads directory: ${UPLOADS_ROOT}`);
  console.log(`Data directory: ${DATA_DIR}`);
  console.log(`Frontend directory: ${FRONTEND_DIR}`);
  console.log(`Max file size: ${MAX_FILE_MB}MB`);
  console.log(`Max files per upload: ${MAX_FILES}`);
  console.log('================================');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server...');
  process.exit(0);
});