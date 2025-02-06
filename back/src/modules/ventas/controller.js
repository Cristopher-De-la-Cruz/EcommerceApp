const TABLA = 'ventas';
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
        const user_id = token.payload.user_id;

        const where = token.payload.user_role == 1 ? 'WHERE 1=1' : `WHERE cliente_id = ${user_id}`
        const { desde, hasta, page = 1, limit = 12 } = req.query;

        let query = `SELECT * FROM ${TABLA} ${where}`;
        const params = [];
        if (desde) {
            query += ' AND fecha >= ?';
            params.push(desde);
        }
        if (hasta) {
            query += ' AND fecha <= ?';
            params.push(hasta);
        }

        const itemsNoLimit = await bd.query(query, params);
        const maxCount = itemsNoLimit.length;
        const offset = (page - 1) * limit;
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const items = await bd.query(query, params);
        const ventas = await Promise.all(
            items.map(async (item) => {
                let detalle = await bd.query(`SELECT dv.*, p.nombre 
                        FROM detalle_ventas as dv
                        INNER JOIN productos as p ON dv.producto_id = p.id
                        WHERE dv.venta_id = ?`, [item.id]);
                let total = 0;
                detalle.map(item => {
                    item.precio = item.sub_total / item.cantidad;
                    total += item.sub_total;
                    //redondear total a dos decimales
                    total = Math.round(total * 100) / 100;
                });

                return { ...item, total, detalle };
            })
        );

        respuesta.success(req, res, {ventas: ventas, maxCount: maxCount}, 200);
    } catch (err) {
        console.log(err);
        respuesta.error(req, res, { message: 'Error al obtener datos' }, 500);
    }
}

const show = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            respuesta.error(req, res, { message: token.message }, 401);
            return;
        }
        const user_id = token.payload.user_id;

        const errors = await validate([
            {
                field: 'id',
                table: 'ventas',
                required: true,
                params: true,
            }
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }

        const where = token.payload.user_role == 1 ? 'WHERE 1=1' : `WHERE cliente_id = ${user_id}`;

        let query = `SELECT * FROM ${TABLA} ${where} AND id = ?`;
        const params = [req.params.id];

        const items = await bd.query(query, params);
        if (items.length < 1) {
            respuesta.error(req, res, { message: 'No se encontró la compra' }, 404);
            return;
        }

        const venta = await Promise.all(
            items.map(async (item) => {
                const detalle = await Promise.all(
                    (await bd.query(
                        `SELECT dv.*, p.nombre 
                        FROM detalle_ventas as dv
                        INNER JOIN productos as p ON dv.producto_id = p.id
                        WHERE dv.venta_id = ?`, [item.id]
                    )).map(async (detalleItem) => {
                        // Obtener imágenes activas
                        const imagenes = (await bd.query(
                            `SELECT * FROM imagenes_producto WHERE producto_id = ? AND estado = 1`,
                            [detalleItem.producto_id]
                        )).map((imagen) => ({
                            ...imagen,
                            imagen: `${config.app.host}${imagen.imagen}`,
                        }));
                        
                        // Calcular precio unitario
                        const precio = detalleItem.sub_total / detalleItem.cantidad;

                        return { ...detalleItem, imagenes, precio };
                    })
                );

                // Calcular total
                const total = detalle.reduce((acc, d) => acc + d.sub_total, 0);
                // Calcular unidades
                const unidades = detalle.reduce((acc, d) => acc + d.cantidad, 0);

                return { ...item, total: Math.round(total * 100) / 100, unidades,detalle };
            })
        );

        respuesta.success(req, res, venta[0], 200);
    } catch (err) {
        console.error(err);
        respuesta.error(req, res, { message: 'Error al obtener datos' }, 500);
    }
};

const store = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            respuesta.error(req, res, { message: token.message }, 401);
            return;
        }

        if (token.payload.user_role == 1) {
            respuesta.error(req, res, { message: "Un administrador no puede realizar ventas" }, 401);
            return;
        }
        const user_id = token.payload.user_id;

        //Validar producto
        const errors = await validate([
            {
                field: 'fecha',
                type: 'date',
                required: true,
            },
            {
                field: 'lugar_entrega',
                type: 'string',
                required: true,
                min: 5,
                max: 255
            },
            {
                field: 'numero_tarjeta',
                type: 'string',
                required: true,
                min: 16,
                max: 16
            },
            {
                field: 'fecha_expiracion',
                type: 'string',
                required: true,
                min: 5,
                max: 5
            },
            {
                field: 'csv',
                type: 'string',
                required: true,
                min: 3,
                max: 3
            }
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }

        //validar cuenta bancaria
        const cuenta_bancaria = await bd.query(`SELECT * FROM cuentas_bancarias WHERE numero_tarjeta = ? AND fecha_expiracion = ? AND csv = ?`, [req.body.numero_tarjeta, req.body.fecha_expiracion, req.body.csv]);

        if (cuenta_bancaria.length < 1) {
            respuesta.error(req, res, { message: 'La cuenta bancaria no existe' }, 402);
            return;
        }

        //traer datos del carrito
        const carrito = await bd.query(`SELECT c.*, p.nombre, p.precio, p.stock, p.estado as estado_producto 
                FROM carrito_compras AS c
                INNER JOIN productos AS p ON c.producto_id = p.id
                WHERE c.cliente_id = ? AND c.estado = 1`, [user_id]);

        if (carrito.length < 1) {
            respuesta.error(req, res, { message: 'No hay productos en el carrito' }, 402);
            return;
        }

        //validar condicion del producto
        carrito.map(item => {
            if (item.estado_producto != 1) {
                respuesta.error(req, res, { message: `El producto ${item.nombre} ya no se encuentra disponible`, code: 'PRODUCTO_INACTIVO' }, 402);
                return;
            }

            if (item.stock < item.cantidad) {
                respuesta.error(req, res, { message: `No hay suficiente stock de ${item.nombre}`, code: 'STOCK_INSUFFICIENT' }, 402);
                return;
            }
        });

        //Realizar ventas
        const venta = await bd.query(`INSERT INTO ventas (cliente_id, fecha, lugar_entrega) VALUES (?, ?, ?)`, [user_id, req.body.fecha, req.body.lugar_entrega]);

        carrito.map(async (item) => {
            let subtotal = item.cantidad * item.precio;
            let newStock = item.stock - item.cantidad;
            await bd.query(`INSERT INTO detalle_ventas (producto_id, venta_id, cantidad, sub_total) VALUES (?, ?, ?, ?)`, [item.producto_id, venta.insertId, item.cantidad, subtotal]);
            await bd.query(`UPDATE productos SET stock = ? WHERE id = ?`, [newStock, item.producto_id]);
            await bd.query(`UPDATE carrito_compras SET estado = 0 WHERE id = ?`, [item.id]);
        });

        respuesta.success(req, res, { message: 'Venta realizada' }, 200);
    } catch (err) {
        console.error('Error al realizar venta:', err);
        respuesta.error(req, res, { message: 'Error al realizar la venta' }, 500);
    }
}


module.exports = {
    get,
    show,
    store,
}