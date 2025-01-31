const TABLA = 'categorias';
const bd = require('../../DB/mysql');
const respuesta = require('../../helper/respuestas');
const validate = require('../../helper/validate');
const auth = require('../../auth/auth');

const get = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            res.json(respuesta.error(req, res, { message: token.message }, 401));
            return;
        }
        console.log(token);
        const items = await bd.query(`SELECT * FROM ${TABLA}`, []);
        res.json(respuesta.success(req, res, items, 200));
    } catch (err) {
        console.log(err);
        res.json(respuesta.error(req, res, 'Error al obtener las categorías', 500));
    }
}

const store = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, {message: tokenAccess.message}, 401));
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
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }

        await bd.query(`INSERT INTO ${TABLA} (nombre) VALUES (?)`, [req.body.nombre]);
        res.json(respuesta.success(req, res, 'Categoría creada', 200));
    } catch (err) {
        console.error('Error al guardar la categoría:', err);
        res.json(respuesta.error(req, res, 'Error al guardar la categoría', 500));
    }
}

const update = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, {message: tokenAccess.message}, 401));
            return;
        }
        const errors = await validate([
            {
                field: 'nombre',
                type: 'string',
                required: true,
                table: 'categorias',
                unique: true,
                updating: true,
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
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }
        await bd.query(`UPDATE ${TABLA} SET nombre = ? WHERE id = ?`, [req.body.nombre, req.params.id]);
        res.json(respuesta.success(req, res, 'Categoría actualizada', 200));
    } catch (err) {
        res.json(respuesta.error(req, res, 'Error al actualizar la categoría', 500));
    }
}

const toggleState = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, {message: tokenAccess.message}, 401));
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