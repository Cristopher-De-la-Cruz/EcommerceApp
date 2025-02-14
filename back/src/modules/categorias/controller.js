const TABLA = 'categorias';
const bd = require('../../DB/mysql');
const respuesta = require('../../helper/respuestas');
const validate = require('../../helper/validate');
const auth = require('../../auth/auth');
const jwtHelper = require('../../helper/jwt');

const get = async (req, res) => {
    try {
        // const token = jwtHelper.getTokenPayload(req);
        // if (token.error) {
        //     respuesta.error(req, res, { message: token.message }, 401);
        //     return;
        // }
        const { estado = 1, page, limit } = req.query;

        // Base de la consulta
        let query = `SELECT * FROM ${TABLA}`;
        const params = [];

        // Agregar filtros dinámicamente
        if (estado) {
            query += ' WHERE estado = ?';
            params.push(estado);
        }
        if (page) {
            const limite = limit || 12;
            const offset = (page - 1) * limite;
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(limite), parseInt(offset));
        }
        const maxItems = await bd.query(`SELECT * FROM ${TABLA} WHERE estado = ?`, [estado]);
        const maxCount = maxItems.length;
        const items = await bd.query(query, params);
        respuesta.success(req, res, {categorias: items, maxCount: maxCount}, 200);
        return;
    } catch (err) {
        console.log("Error al obtener categorias:" + err);
        respuesta.error(req, res, 'Error al obtener las categorías', 500);
        return;
    }
}

const store = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            respuesta.error(req, res, { message: tokenAccess.message }, 401);
            return;
        }

        //Validar
        const errors = await validate([
            {
                field: 'nombre',
                type: 'string',
                required: true,
                table: 'categorias',
                unique: true,
                min: 3,
                max: 50,
            }
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }

        await bd.query(`INSERT INTO ${TABLA} (nombre) VALUES (?)`, [req.body.nombre]);
        respuesta.success(req, res, {message: 'Categoría agregada'}, 200);
    } catch (err) {
        console.error('Error al guardar la categoría:', err);
        respuesta.error(req, res, {message: 'Error al guardar la categoría'}, 500);
    }
}

const update = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            respuesta.error(req, res, { message: tokenAccess.message }, 401);
            return;
        }
        const errors = await validate([
            {
                field: 'nombre',
                type: 'string',
                required: true,
                table: 'categorias',
                unique: true,
                min: 3,
                max: 50,
            },
            {
                field: 'id',
                table: 'categorias',
                mustExist: true,
                required: true,
                params: true,
            }
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }
        await bd.query(`UPDATE ${TABLA} SET nombre = ? WHERE id = ?`, [req.body.nombre, req.params.id]);
        respuesta.success(req, res, {message: 'Categoría actualizada'}, 200);
    } catch (err) {
        respuesta.error(req, res, {message: 'Error al actualizar la categoría'}, 500);
    }
}

const toggleState = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            respuesta.error(req, res, { message: tokenAccess.message }, 401);
            return;
        }

        const errors = await validate([
            {
                field: 'id',
                table: 'categorias',
                mustExist: true,
                required: true,
                params: true,
            }
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }
        let currentState = await bd.query(`SELECT estado FROM ${TABLA} WHERE id = ?`, [req.params.id]);
        currentState = currentState[0].estado;
        const newState = currentState == 1 ? 0 : 1;
        await bd.query(`UPDATE ${TABLA} SET estado = ? WHERE id = ?`, [newState, req.params.id]);
        respuesta.success(req, res, {message: 'Estado actualizado'}, 200);
    } catch (Error) {
        respuesta.error(req, res, {message: 'Error al cambiar el estado'}, 500);
    }
}

module.exports = {
    get,
    store,
    update,
    toggleState
}