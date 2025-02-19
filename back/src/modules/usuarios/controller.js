const TABLA = 'usuarios';
const bd = require('../../DB/mysql');
const respuesta = require('../../helper/respuestas');
const validate = require('../../helper/validate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const jwtHelper = require('../../helper/jwt');
const auth = require('../../auth/auth');

const get = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            respuesta.error(req, res, { message: tokenAccess.message }, 401);
            return;
        }

        const { estado = 1, page, limit } = req.query;

        // Base de la consulta
        let query = `SELECT * FROM ${TABLA}`;
        const params = [];

        // Agregar filtros dinámicamente
        if (estado) {
            query += ' WHERE estado = ?';
            params.push(estado);
        }
        query += ' ORDER BY role';

        if (page) {
            const limite = limit || 12;
            const offset = (page - 1) * limite;
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(limite), parseInt(offset));
        }
        const maxItems = await bd.query(`SELECT * FROM ${TABLA} WHERE estado = ?`, [estado]);
        const items = await bd.query(query, params);

        respuesta.success(req, res, { usuarios: items, maxCount: maxItems.length }, 200);
    } catch (err) {
        console.error(err);
        respuesta.error(req, res, { message: 'Error al obtener los usuarios' }, 500);
    }
}

const register = async (req, res) => {
    try {
        const errors = await validate([
            {
                field: 'nombre',
                type: 'string',
                required: true,
                min: 3,
                max: 50,
            },
            {
                field: 'email',
                type: 'string',
                required: true,
                table: 'usuarios',
                unique: true,
                min: 5,
                max: 200,
            },
            {
                field: 'password',
                type: 'string',
                required: true,
                min: 8,
                max: 30,
            }
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }
        // Reemplazar password por la clave encriptada
        const encryptedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = encryptedPassword;
        const user = await bd.query(`INSERT INTO ${TABLA} (nombre, email, password) VALUES (?, ?, ?)`, [req.body.nombre, req.body.email, req.body.password]);
        const token = jwt.sign({
            user_id: user.insertId,
            user_role: 2,
            exp: Date.now() * 60 * 1000,
            expires: false // no expirará
        }, config.jwt.secret);

        respuesta.success(req, res, { message: 'Usuario creado', token, user: { nombre: req.body.nombre, email: req.body.email, role: 2 } }, 200);
    } catch (err) {
        respuesta.error(req, res, { message: 'Error al guardar al usuario' }, 500);
    }
}

const update = async (req, res) => {
    try {
        // verificar token, un usuario solo puede editar su propio perfil
        const payload = jwtHelper.getTokenPayload(req);
        if (payload.error) {
            respuesta.error(req, res, { message: payload.message }, 401);
            return;
        }
        if (payload.payload.user_role != 1) {
            if (payload.payload.user_id != req.params.id) {
                respuesta.error(req, res, { message: 'No tienes permisos para editar este perfil' }, 401);
                return;
            }
        }
        const errors = await validate([
            {
                field: 'nombre',
                type: 'string',
                required: true,
                min: 3,
                max: 50,
            },
            {
                field: 'email',
                type: 'string',
                table: 'usuarios',
                required: true,
                unique: true,
                updating: true,
                updatingId: req.params.id,
                min: 5,
                max: 200,
            },
            {
                field: 'password',
                type: 'string',
                required: true,
                min: 5,
                max: 30,
            },
            {
                field: 'id',
                table: 'usuarios',
                mustExist: true,
                required: true,
                params: true
            }
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }

        if (req.body.password) {
            const encryptedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = encryptedPassword;
        }

        await bd.query(`UPDATE ${TABLA} SET ? WHERE id = ?`, [req.body, req.params.id]);
        respuesta.success(req, res, { message: 'Usuario actualizado' }, 200);
    } catch (err) {
        console.error(err);
        respuesta.error(req, res, { message: 'Error al actualizar el usuario' }, 500);
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
                table: 'usuarios',
                mustExist: true,
                required: true,
                params: true,
            }
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }

        if (req.params.id == 1) {
            respuesta.error(req, res, { message: 'No se puede alterar el estado de este usuario' }, 401);
            return;
        }

        let currentState = await bd.query(`SELECT estado FROM ${TABLA} WHERE id = ?`, [req.params.id]);
        currentState = currentState[0].estado;
        const newState = currentState == 1 ? 0 : 1;
        await bd.query(`UPDATE ${TABLA} SET estado = ? WHERE id = ?`, [newState, req.params.id]);
        respuesta.success(req, res, { message: 'Estado actualizado' }, 200);
    } catch (Error) {
        respuesta.error(req, res, { message: 'Error al cambiar el estado' }, 500);
    }
}

const store = async (req, res) => {
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
                min: 3,
                max: 50,
            },
            {
                field: 'email',
                type: 'string',
                required: true,
                table: 'usuarios',
                unique: true,
                min: 5,
                max: 200,
            },
            {
                field: 'password',
                type: 'string',
                required: true,
                min: 5,
                max: 30,
            },
            {
                field: 'role',
                type: 'number',
                min: 1,
                max: 2,
            }
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }
        // Reemplazar password por la clave encriptada
        const encryptedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = encryptedPassword;
        await bd.query(`INSERT INTO ${TABLA} set ?`, [req.body]);
        respuesta.success(req, res, { message: 'Usuario creado' }, 200);
    } catch (err) {
        respuesta.error(req, res, { message: 'Error al guardar al usuario' }, 500);
    }
}

const login = async (req, res) => {
    try {
        const errors = await validate([
            {
                field: 'email',
                type: 'string',
                required: true,
                min: 5,
                max: 200,
            },
            {
                field: 'password',
                type: 'string',
                required: true,
                min: 8,
                max: 30
            },
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }

        let user = await bd.query(`SELECT * FROM ${TABLA} WHERE email = ? AND estado = 1`, [req.body.email]);
        if (user.length > 0) {
            user = user[0];
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    respuesta.error(req, res, { message: 'email o contraseña incorrectos' }, 401);
                }
                if (result) {
                    const token = jwt.sign({
                        user_id: user.id,
                        user_role: user.role,
                        exp: Date.now() + 60 * 1000,
                        expires: false
                    }, config.jwt.secret);
                    respuesta.success(req, res, { message: "logueado exitosamente", token, user }, 200);
                } else {
                    respuesta.error(req, res, { message: 'email o contraseña incorrectos' }, 401);
                }
            });
        } else {
            respuesta.error(req, res, { message: 'email o contraseña incorrectos' }, 401);
        }
    } catch (err) {
        console.error('Error al loguear:', err);
        respuesta.error(req, res, { message: 'Error al loguear' }, 500);
    }
}

const editNameEmail = async (req, res) => {
    try {
        // verificar token, un usuario solo puede editar su propio perfil
        const payload = jwtHelper.getTokenPayload(req);
        if (payload.error) {
            respuesta.error(req, res, { message: payload.message }, 401);
            return;
        }
        
        const user_id = payload.payload.user_id;

        const errors = await validate([
            {
                field: 'nombre',
                type: 'string',
                required: true,
                min: 3,
                max: 50,
            },
            {
                field: 'email',
                type: 'string',
                table: 'usuarios',
                required: true,
                unique: true,
                updating: true,
                updatingId: user_id,
                min: 5,
                max: 200,
            }
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }

        await bd.query(`UPDATE ${TABLA} SET nombre = ?, email = ? WHERE id = ?`, [req.body.nombre, req.body.email, user_id]);
        respuesta.success(req, res, { message: 'Editado exitosamente.' }, 200);
    } catch (err) {
        console.error(err);
        respuesta.error(req, res, { message: 'Error al editar.' }, 500);
    }
}

const editPassword = async (req, res) => {
    try {
        // verificar token, un usuario solo puede editar su propio perfil
        const payload = jwtHelper.getTokenPayload(req);
        if (payload.error) {
            respuesta.error(req, res, { message: payload.message }, 401);
            return;
        }
        
        const user_id = payload.payload.user_id;

        const errors = await validate([
            {
                field: 'past_password',
                type: 'string',
                required: true,
                min: 8,
                max: 30,
            },
            {
                field: 'new_password',
                type: 'string',
                required: true,
                min: 8,
                max: 30,
            }
        ], req);

        if (errors.hasErrors) {
            respuesta.error(req, res, errors.errors, 400);
            return;
        }

        //Chequear contraseña anterior
        const user = await bd.query(`SELECT password FROM ${TABLA} WHERE id = ?`, [user_id]);
        if(user.length < 1){
            respuesta.error(req, res, { message: 'Usuario no encontrado.' }, 401);
            return;
        }
        const verifyPssword = await bcrypt.compare(req.body.past_password, user[0].password);
        if(!verifyPssword){
            respuesta.error(req, res, { message: 'Contraseña incorrecta.' }, 401);
            return;
        }

        //Actualizar contraseña
        const encryptedPassword = await bcrypt.hash(req.body.new_password, 10);
        await bd.query(`UPDATE ${TABLA} SET password = ? WHERE id = ?`, [encryptedPassword, user_id]);

        respuesta.success(req, res, { message: 'Editado exitosamente.' }, 200);
    } catch (err) {
        console.error(err);
        respuesta.error(req, res, { message: 'Error al editar.' }, 500);
    }
}



module.exports = {
    get,
    register,
    update,
    toggleState,
    login,
    store,
    editNameEmail,
    editPassword
}