const TABLA = 'carrito_compras';
const bd = require('../../DB/mysql');
const respuesta = require('../../helper/respuestas');
const validate = require('../../helper/validate');
const jwtHelper = require('../../helper/jwt');
const config = require('../../config');

const get = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            respuesta.error(req, res, { message: token.message }, 401);
            return;
        }
        if (token.payload.user_role == 1) {
            respuesta.error(req, res, { message: "Un administrador no puede ver los productos del carrito" }, 401);
            return;
        }
        const user_id = token.payload.user_id;
        const items = await bd.query(`SELECT c.*, p.nombre, p.precio, p.stock, p.estado as estado_producto
                FROM ${TABLA} AS c
                INNER JOIN productos AS p ON c.producto_id = p.id
                WHERE c.cliente_id = ? AND c.estado = 1`, [user_id]);

        //con imagenes del producto
        const productsCart = await Promise.all(items.map(async (item) => {
            let imagen = await bd.query(`SELECT * FROM imagenes_producto WHERE producto_id = ? AND estado = 1 LIMIT 1`, [item.producto_id]);
            imagen = imagen.length > 0 ? `${config.app.host}${imagen[0].imagen}` : `${config.app.host}uploads/images/productos/default.png`;
            return {...item, imagen: imagen};
        }));
        respuesta.success(req, res, productsCart, 200);
    } catch (err) {
        console.log(err);
        respuesta.error(req, res, { message: 'Error al obtener los productos del carrito' }, 500);
    }
}

const store = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            respuesta.error(req, res, { message: token.message }, 401);
            return;
        }

        if (token.payload.user_role == 1) {
            respuesta.error(req, res, { message: "Un administrador no puede agregar productos al carrito" }, 401);
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
            respuesta.error(req, res, errorsProducto.errors, 400);
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
            respuesta.error(req, res, errorsCantidad.errors, 400);
            return;
        }

        // Si ya hay un producto y cliente igual que este activo, no se agrega
        const dataCarrito = await bd.query(`SELECT * FROM ${TABLA} WHERE producto_id = ? AND cliente_id = ? AND estado = 1`, [req.body.producto_id, user_id]);
        if (dataCarrito.length > 0) {
            respuesta.error(req, res, { message: "Este producto ya esta en el carrito" }, 400);
            return;
        }

        const carrito = await bd.query(`INSERT INTO ${TABLA} (cliente_id, producto_id, cantidad) VALUES (?, ?, ?)`, [user_id, req.body.producto_id, req.body.cantidad]);
        respuesta.success(req, res, { message: 'Añadido al carrito', carrito_id: carrito.insertId, carrito: carrito }, 200);
    } catch (err) {
        console.error('Error al agregar al carrito:', err);
        respuesta.error(req, res, { message: 'Error al añadir al carrito' }, 500);
    }
}

const changeCantidad = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            respuesta.error(req, res, { message: token.message }, 401);
            return;
        }
        if (token.payload.user_role == 1) {
            respuesta.error(req, res, { message: "Un administrador no puede modificar la cantidad del producto" }, 401);
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
            respuesta.error(req, res, errors.errors, 400);
            return;
        }

        const dataCarrito = await bd.query(`SELECT p.stock, c.cantidad 
                FROM carrito_compras AS c
                INNER JOIN productos AS p ON c.producto_id = p.id
                WHERE c.id = ? AND c.cliente_id = ?`, [req.params.id, user_id]);

        // if (!dataCarrito[0].stock) {
        //     respuesta.error(req, res, { message: "No se puede agregar cantidad", a: dataCarrito[0].stock }, 402);
        //     return;
        // }

        const errorsCantidad = await validate([
            {
                field: 'cantidad',
                type: 'number',
                required: true,
                min: 0,
                max: dataCarrito[0].stock
            }
        ], req);

        // if (!dataCarrito[0].stock) {
        //     respuesta.error(req, res, { message: "No se puede agregar cantidad", a: dataCarrito[0].stock }, 402);
        //     return;
        // }

        if (errorsCantidad.hasErrors) {
            respuesta.error(req, res, errorsCantidad.errors, 400);
            return;
        }

        const estado = req.body.cantidad == 0 ? 0 : 1;

        await bd.query(`UPDATE ${TABLA} SET cantidad = ?, estado = ? WHERE id = ? AND cliente_id = ?`, [req.body.cantidad, estado, req.params.id, user_id]);
        respuesta.success(req, res, { message: 'cantidad actualizada' }, 200);
    } catch (err) {
        respuesta.error(req, res, { message: 'Error al actualizar la categoría' }, 500);
    }
}

const inactivate = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            respuesta.error(req, res, { message: token.message }, 401);
            return;
        }

        if (token.payload.user_role == 1) {
            respuesta.error(req, res, { message: "Un administrador no puede inactivar productos del carrito" }, 401);
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
            respuesta.error(req, res, errors.errors, 400);
            return;
        }
        let carrito = await bd.query(`SELECT * FROM ${TABLA} WHERE id = ? AND cliente_id = ?`, [req.params.id, user_id]);
        if (carrito.length < 1) {
            respuesta.error(req, res, { message: "No tiene permisos para inactivar el producto." }, 401);
            return;
        }
        await bd.query(`UPDATE ${TABLA} SET estado = ? WHERE id = ? AND cliente_id = ?`, [0, req.params.id, user_id]);
        respuesta.success(req, res, { message: 'Inactivado' }, 200);
    } catch (Error) {
        respuesta.error(req, res, { message: 'Error al inactivar' }, 500);
    }
}

module.exports = {
    get,
    store,
    changeCantidad,
    inactivate
}