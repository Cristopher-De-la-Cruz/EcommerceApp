const express = require('express')
const config = require('./config')
const path = require('path')
const app = express()

//configuracion
app.set('port', config.app.port);

//Middleware
app.use(express.json()); // para parsear el req.body

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