const express = require('express')
const config = require('./config')
const path = require('path')
const app = express()
const cors = require('cors');

//configuracion
app.set('port', config.app.port);

//Middleware
app.use(express.json()); // para parsear el req.body

// Cors
app.use(cors({
    origin: config.app.front_host,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir archivos estáticos desde el directorio uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


//Modules
const usuarios = require('./modules/usuarios/routes');
const categorias = require('./modules/categorias/routes');
const productos = require('./modules/productos/routes');
const carrito_compras = require('./modules/carrito_compras/routes');
const ventas = require('./modules/ventas/routes');

app.use('/api/usuarios', usuarios)
app.use('/api/categorias', categorias)
app.use('/api/productos', productos)
app.use('/api/carrito_compras', carrito_compras)
app.use('/api/ventas', ventas)

app.get('/', (req, res) => {
    res.send('Hola mundo desde el servidor');
});


module.exports = app;