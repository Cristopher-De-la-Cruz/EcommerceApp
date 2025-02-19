const TABLA = 'ventas';
const bd = require('../../DB/mysql');
const respuesta = require('../../helper/respuestas');
const validate = require('../../helper/validate');
const jwtHelper = require('../../helper/jwt');
const config = require('../../config');
const auth = require('../../auth/auth')

const get = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            respuesta.error(req, res, { message: token.message }, 401);
            return;
        }
        const user_id = token.payload.user_id;

        const where = token.payload.user_role == 1 ? 'WHERE 1=1' : `WHERE v.cliente_id = ${user_id}`
        const { desde, hasta, page = 1, limit = 12 } = req.query;

        let query = `SELECT v.*, c.nombre as cliente
            FROM ${TABLA} as v
            INNER JOIN usuarios c ON v.cliente_id = c.id
            ${where}
            `;
        const params = [];
        if (desde) {
            query += ' AND v.fecha >= ?';
            params.push(desde);
        }
        if (hasta) {
            query += ' AND v.fecha <= ?';
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

        respuesta.success(req, res, { ventas: ventas, maxCount: maxCount }, 200);
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

        const where = token.payload.user_role == 1 ? 'WHERE 1=1' : `WHERE v.cliente_id = ${user_id}`;

        let query = `SELECT v.*, c.nombre as cliente
        FROM ${TABLA} as v
        INNER JOIN usuarios c ON v.cliente_id = c.id
        ${where} AND v.id = ?`;

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

                return { ...item, total: Math.round(total * 100) / 100, unidades, detalle };
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

const getDashboard = async (req, res) => {
    try {
        const token = auth.AdminPermission(req); // Verifica si el usuario tiene permisos de admin
        if (token.error) {
            respuesta.error(req, res, { message: token.message }, 401);
            return;
        }

        // Definimos el año actual
        const year = new Date().getFullYear();

        // Consulta de la cantidad de ventas realizadas en el año actual
        const totalSalesQuery = `
            SELECT COUNT(*) AS total_ventas
            FROM ventas
            WHERE YEAR(fecha) = ? AND estado = 1
        `;
        const totalSales = await bd.query(totalSalesQuery, [year]);

        // Consulta de la cantidad de unidades vendidas en el año actual
        const totalUnitsQuery = `
            SELECT SUM(dv.cantidad) AS total_unidades
            FROM detalle_ventas dv
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE YEAR(v.fecha) = ? AND v.estado = 1
        `;
        const totalUnits = await bd.query(totalUnitsQuery, [year]);

        // Consulta de los ingresos totales en el año actual
        const totalIncomeQuery = `
            SELECT SUM(dv.sub_total) AS total_ingreso
            FROM detalle_ventas dv
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE YEAR(v.fecha) = ? AND v.estado = 1
        `;
        const totalIncome = await bd.query(totalIncomeQuery, [year]);

        // Consulta de los 10 productos que generaron más ingresos en el año
        const topProductsQuery = `
            SELECT p.id, p.nombre, SUM(dv.sub_total) AS ingreso
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE YEAR(v.fecha) = ? AND v.estado = 1
            GROUP BY dv.producto_id
            ORDER BY ingreso DESC
            LIMIT 10
        `;
        const topProducts = await bd.query(topProductsQuery, [year]);

        // Consulta de las 5 categorías con más ventas en el año
        const topCategoriesQuery = `
            SELECT c.id, c.nombre, COUNT(dv.id) AS total_sales
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            INNER JOIN categorias c ON p.categoria_id = c.id
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE YEAR(v.fecha) = ? AND v.estado = 1
            GROUP BY c.id
            ORDER BY total_sales DESC
            LIMIT 5
        `;
        const topCategories = await bd.query(topCategoriesQuery, [year]);

        // Responder con los resultados
        respuesta.success(req, res, {
            total_ventas: totalSales[0].total_ventas,
            total_unidades: totalUnits[0].total_unidades,
            total_ingreso: totalIncome[0].total_ingreso,
            top_products: topProducts,
            top_categories: topCategories
        }, 200);

    } catch (err) {
        console.error('Error al obtener los datos de ventas:', err);
        respuesta.error(req, res, { message: 'Error al obtener datos' }, 500);
    }
};



module.exports = {
    get,
    show,
    store,
    getDashboard
}