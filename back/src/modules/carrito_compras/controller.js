const TABLA = 'carrito_compras';
const bd = require('../../DB/mysql');
const respuesta = require('../../helper/respuestas');
const validate = require('../../helper/validate');
const jwtHelper = require('../../helper/jwt');

const get = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            res.json(respuesta.error(req, res, {message: token.message}, 401));
            return;
        }
        if(token.payload.user_role == 1){
            res.json(respuesta.error(req, res, {message: "Un administrador no puede ver los productos del carrito"}, 401));
            return;
        }
        const user_id = token.payload.user_id;
        const items = await bd.query(`SELECT c.*, p.nombre, p.precio, p.stock, p.estado as estado_producto
                FROM ${TABLA} AS c
                INNER JOIN productos AS p ON c.producto_id = p.id
                WHERE c.cliente_id = ? AND c.estado = 1`, [user_id]);
        res.json(respuesta.success(req, res, items, 200));
    } catch (err) {
        console.log(err);
        res.json(respuesta.error(req, res, {message: 'Error al obtener los productos del carrito'}, 500));
    }
}

const store = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            res.json(respuesta.error(req, res, {message: token.message}, 401));
            return;
        }

        if(token.payload.user_role == 1){
            res.json(respuesta.error(req, res, {message: "Un administrador no puede agregar productos al carrito"}, 401));
            return;
        }

        const user_id = token.payload.user_id;

        //Validar producto
        const errorsProducto = await validate([
            {
                field: 'producto_id',
                type: 'number',
                required: true,
                table: 'productos',
                mustExist: true,
                foreignField: 'id',
            }
        ], req);

        if (errorsProducto.hasErrors) {
            res.json(respuesta.error(req, res, errorsProducto.errors, 400));
            return;
        }

        //verificar stock del producto
        const stock = await bd.query(`SELECT stock FROM productos WHERE id = ?`, [req.body.producto_id]);
        
        //Validar errores de la cantidad
        const errorsCantidad = await validate([
            {
                field: 'cantidad',
                type: 'number',
                required: true,
                min: 1,
                max: stock[0].stock
            }
        ], req);

        if (errorsCantidad.hasErrors) {
            res.json(respuesta.error(req, res, errorsCantidad.errors, 400));
            return;
        }

        // Si ya hay un producto y cliente igual que este activo, no se agrega
        const dataCarrito = await bd.query(`SELECT * FROM ${TABLA} WHERE producto_id = ? AND cliente_id = ? AND estado = 1`, [req.body.producto_id, user_id]);
        if(dataCarrito.length > 0){
            res.json(respuesta.error(req, res, {message: "Este producto ya esta en el carrito"}, 400));
            return;
        }

        await bd.query(`INSERT INTO ${TABLA} (cliente_id, producto_id, cantidad) VALUES (?, ?, ?)`, [user_id, req.body.producto_id, req.body.cantidad]);
        res.json(respuesta.success(req, res, {message: 'Añadido al carrito'}, 200));
    } catch (err) {
        console.error('Error al agregar al carrito:', err);
        res.json(respuesta.error(req, res, {message: 'Error al añadir al carrito'}, 500));
    }
}

const changeCantidad = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            res.json(respuesta.error(req, res, {message: token.message}, 401));
            return;
        }
        if(token.payload.user_role == 1){
            res.json(respuesta.error(req, res, {message: "Un administrador no puede modificar la cantidad del producto"}, 401));
            return;
        }
        const user_id = token.payload.user_id;
        const errors = await validate([
            {
                field: 'id',
                table: 'carrito_compras',
                mustExist: true,
                required: true,
                params: true,
            }
        ], req);

        if (errors.hasErrors) {
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }

        const dataCarrito = await bd.query(`SELECT p.stock, c.cantidad 
                FROM carrito_compras AS c
                INNER JOIN productos AS p ON c.producto_id = p.id
                WHERE c.id = ? AND c.cliente_id = ?`, [req.params.id, user_id]);
        
        if(!dataCarrito[0].stock){
            res.json(respuesta.error(req, res, {message: "No se puede agregar cantidad"}, 400));
            return;
        }

        const errorsCantidad = await validate([
            {
                field: 'cantidad',
                type: 'number',
                required: true,
                min: 1,
                max: dataCarrito[0].stock
            }
        ], req);

        if (errorsCantidad.hasErrors) {
            res.json(respuesta.error(req, res, errorsCantidad.errors, 400));
            return;
        }

        await bd.query(`UPDATE ${TABLA} SET cantidad = ? WHERE id = ? AND cliente_id = ?`, [req.body.cantidad, req.params.id, user_id]);
        res.json(respuesta.success(req, res, 'cantidad actualizada', 200));
    } catch (err) {
        res.json(respuesta.error(req, res, 'Error al actualizar la categoría', 500));
    }
}

const inactivate = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            res.json(respuesta.error(req, res, {message: token.message}, 401));
            return;
        }
        
        if(token.payload.user_role == 1){
            res.json(respuesta.error(req, res, {message: "Un administrador no puede inactivar productos del carrito"}, 401));
            return;
        }

        const user_id = token.payload.user_id;

        const errors = await validate([
            {
                field: 'id',
                table: 'carrito_compras',
                mustExist: true,
                required: true,
                params: true,
            }
        ], req);

        if (errors.hasErrors) {
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }
        let carrito = await bd.query(`SELECT * FROM ${TABLA} WHERE id = ? AND cliente_id = ?`, [req.params.id, user_id]);
        if(carrito.length < 1){
            res.json(respuesta.error(req, res, {message: "No tiene permisos para inactivar el producto."}, 401));
            return;
        }
        await bd.query(`UPDATE ${TABLA} SET estado = ? WHERE id = ? AND cliente_id = ?`, [0, req.params.id, user_id]);
        res.json(respuesta.success(req, res, 'Inactivado', 200));
    } catch (Error) {
        res.json(respuesta.error(req, res, 'Error al inactivar', 500));
    }
}

module.exports = {
    get,
    store,
    changeCantidad,
    inactivate
}