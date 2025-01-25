const TABLA = 'productos';
const bd = require('../../DB/mysql');
const respuesta = require('../../helper/respuestas');
const validate = require('../../helper/validate');
const auth = require('../../auth/auth');
const jwtHelper = require('../../helper/jwt');

const get = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            res.json(respuesta.error(req, res, token.message, 401));
            return;
        }
        const items = await bd.query(
            `SELECT u.*, c.nombre AS categoria
            FROM ${TABLA} AS u
            JOIN categorias AS c ON u.categoria_id = c.id;`, []);

        res.json(respuesta.success(req, res, items, 200));
    } catch (err) {
        res.json(respuesta.error(req, res, 'Error al obtener los productos', 500));
    }
}

const store = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, tokenAccess.message, 401));
            return;
        }

        const errors = await validate([
            {
                field: 'nombre',
                type: 'string',
                required: true,
                min: 1,
                max: 50,
            },
            {
                field: 'categoria_id',
                type: 'number',
                required: true,
                mustExist: true,
                table: 'categorias',
                foreignField: 'id'
            },
            {
                field: 'precio',
                required: true,
            },
            {
                field: 'stock',
                required: true,
                type: 'number',
                min: 0
            }
        ], req);

        if (errors.hasErrors) {
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }

        await bd.query(`INSERT INTO ${TABLA} set ?`, [req.body]);
        res.json(respuesta.success(req, res, 'Producto creado', 200));
    } catch (err) {
        console.error('Error al guardar el producto:', err);
        res.json(respuesta.error(req, res, 'Error al guardar el producto', 500));
    }
}

const update = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, tokenAccess.message, 401));
            return;
        }
        const errors = await validate([
            {
                field: 'nombre',
                type: 'string',
                min: 1,
                max: 50,
            },
            {
                field: 'categoria_id',
                type: 'number',
                mustExist: true,
                table: 'categorias',
                foreignField: 'id'
            },
            {
                field: 'precio',
                type: 'number',
            },
            {
                field: 'stock',
                type: 'number',
                min: 0
            }
        ], req);

        if (errors.hasErrors) {
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }
        await bd.query(`UPDATE ${TABLA} SET ? WHERE id = ?`, [req.body, req.params.id]);
        res.json(respuesta.success(req, res, 'producto actualizado', 200));
    } catch (err) {
        res.json(respuesta.error(req, res, 'Error al actualizar el producto', 500));
    }
}

const toggleState = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, tokenAccess.message, 401));
            return;
        }

        const errors = await validate([
            {
                field: 'id',
                table: 'productos',
                mustExist: true,
                required: true,
                params: true,
            }
        ], req);

        if (errors.hasErrors) {
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }
        let currentState = await bd.query(`SELECT estado FROM ${TABLA} WHERE id = ?`, [req.params.id]);
        currentState = currentState[0].estado;
        const newState = currentState == 1 ? 0 : 1;
        await bd.query(`UPDATE ${TABLA} SET estado = ? WHERE id = ?`, [newState, req.params.id]);
        res.json(respuesta.success(req, res, 'Estado actualizado', 200));
    } catch (Error) {
        res.json(respuesta.error(req, res, 'Error al cambiar el estado', 500));
    }
}

module.exports = {
    get,
    store,
    update,
    toggleState
}