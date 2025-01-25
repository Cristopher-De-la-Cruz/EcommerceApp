const express = require('express')
const config = require('./config')
const app = express()

//configuracion
app.set('port', config.app.port);

//Middleware
app.use(express.json()); // para parsear el req.body


//Modules
const usuarios = require('./modules/usuarios/routes');
const categorias = require('./modules/categorias/routes');
const productos = require('./modules/productos/routes');

app.use('/api/usuarios', usuarios)
app.use('/api/categorias', categorias)
app.use('/api/productos', productos)

app.get('/', (req, res) => {
    res.send('Hola mundo desde el servidor');
});


module.exports = app;