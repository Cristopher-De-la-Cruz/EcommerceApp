const TABLA = 'productos';
const bd = require('../../DB/mysql');
const respuesta = require('../../helper/respuestas');
const validate = require('../../helper/validate');
const auth = require('../../auth/auth');
const jwtHelper = require('../../helper/jwt');
const { saveFile, deleteFile } = require('../../helper/handleFile');
const config = require('../../config');

const get = async (req, res) => {
    try {
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            res.json(respuesta.error(req, res, { message: token.message }, 401));
            return;
        }
        const items = await bd.query(
            `SELECT u.*, c.nombre AS categoria
            FROM ${TABLA} AS u
            JOIN categorias AS c ON u.categoria_id = c.id;`, []);

        const productos = await Promise.all(
            items.map(async (item) => {
                let imagenes = await bd.query(
                    `SELECT * FROM imagenes_producto WHERE producto_id = ? AND estado = 1`,
                    [item.id]
                );
                imagenes = imagenes.map(imagen => {
                    return { ...imagen, imagen: `${config.app.host}${imagen.imagen}` };
                });
                return { ...item, imagenes };
            })
        );


        res.json(respuesta.success(req, res, productos, 200));
    } catch (err) {
        res.json(respuesta.error(req, res, { message: 'Error al obtener los productos', error: err }, 500));
    }
}

const show = async (req, res) => {
    try {
        console.log(req.params['id']);
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            res.json(respuesta.error(req, res, { message: token.message }, 401));
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

        let producto = await bd.query(`SELECT p.*, c.nombre AS categoria
            FROM ${TABLA} AS p
            JOIN categorias AS c ON p.categoria_id = c.id
            WHERE p.id = ?;`, [req.params.id]);

        producto = producto[0];
        let imagenes = await bd.query(`SELECT * FROM imagenes_producto WHERE producto_id = ? AND estado = 1`, [req.params.id]);
        imagenes = imagenes.map(imagen => {
            return { ...imagen, imagen: `${config.app.host}${imagen.imagen}` };
        });
        producto.imagenes = imagenes;
        res.json(respuesta.success(req, res, producto, 200));
    } catch (err) {
        res.json(respuesta.error(req, res, { message: 'Error al obtener el producto', error: err }, 500));
    }
}

const showWithAllImages = async (req, res) => {
    try {
        console.log(req.params['id']);
        const token = jwtHelper.getTokenPayload(req);
        if (token.error) {
            res.json(respuesta.error(req, res, { message: token.message }, 401));
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

        let producto = await bd.query(`SELECT p.*, c.nombre AS categoria
            FROM ${TABLA} AS p
            JOIN categorias AS c ON p.categoria_id = c.id
            WHERE p.id = ?;`, [req.params.id]);

        producto = producto[0];
        let imagenes = await bd.query(`SELECT * FROM imagenes_producto WHERE producto_id = ?`, [req.params.id]);
        imagenes = imagenes.map(imagen => {
            return { ...imagen, imagen: `${config.app.host}${imagen.imagen}` };
        });
        producto.imagenes = imagenes;
        res.json(respuesta.success(req, res, producto, 200));
    } catch (err) {
        res.json(respuesta.error(req, res, { message: 'Error al obtener el producto', error: err }, 500));
    }
}

const store = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, { message: tokenAccess.message }, 401));
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
                field: 'descripcion',
                type: 'string',
                max: 255,
            },
            {
                field: 'categoria_id',
                // type: 'number',
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
                // type: 'number',
                // min: 0
            },
            {
                field: 'imagen',
                type: 'file',
                allowedExtensions: ['png', 'jpg', 'jpeg', 'jfif'],
                required: false,
                maxCount: 10
            }
        ], req);

        if (errors.hasErrors) {
            if (req.files) {
                // Eliminar archivos subidos en caso de error
                Object.values(req.files).flat().map(thisFile => {
                    deleteFile(thisFile.path);
                });
            }
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }

        let imagenes = [];
        if (req.files) {
            if (req.files['imagen']) {
                req.files['imagen'].map(img => {
                    let productoResult = saveFile(img, 'images/productos');
                    if (!productoResult.success) {
                        return res.json(respuesta.error(req, res, { message: productoResult.message, error: productoResult.error }, 400));
                    }
                    imagenes.push(productoResult.newPath);
                });
            }
        }

        const producto = await bd.query(`INSERT INTO ${TABLA} set ?`, [req.body]);
        if (imagenes.length > 0) {
            imagenes.map(async (imagen) => {
                await bd.query(`INSERT INTO imagenes_producto set ?`, [{ producto_id: producto.insertId, imagen: imagen }]);
            })
        } else {
            await bd.query(`INSERT INTO imagenes_producto set ?`, [{ producto_id: producto.insertId }]);
        }

        res.json(respuesta.success(req, res, { message: 'Producto creado' }, 200));
    } catch (err) {
        console.error('Error al guardar el producto:', err);
        res.json(respuesta.error(req, res, { message: 'Error al guardar el producto', error: err }, 500));
    }
}

const update = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, { message: tokenAccess.message }, 401));
            return;
        }
        const errors = await validate([
            {
                field: 'id',
                table: 'productos',
                mustExist: true,
                required: true,
                params: true,
            },
            {
                field: 'nombre',
                type: 'string',
                min: 1,
                max: 50,
            },
            {
                field: 'descripcion',
                type: 'string',
                max: 255,
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
        res.json(respuesta.success(req, res, { message: 'producto actualizado' }, 200));
    } catch (err) {
        res.json(respuesta.error(req, res, { message: 'Error al actualizar el producto' }, 500));
    }
}

const toggleState = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, { message: tokenAccess.message }, 401));
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
        res.json(respuesta.success(req, res, { message: 'Estado actualizado' }, 200));
    } catch (Error) {
        res.json(respuesta.error(req, res, { message: 'Error al cambiar el estado' }, 500));
    }
}

const inactiveImage = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, { message: tokenAccess.message }, 401));
            return;
        }

        const errors = await validate([
            {
                field: 'id',
                table: 'imagenes_producto',
                mustExist: true,
                required: true,
                params: true,
            }
        ], req);

        if (errors.hasErrors) {
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }
        // verificar que el producto tenga mas de una imagen
        const imagen = await bd.query(`SELECT producto_id FROM imagenes_producto WHERE id = ?`, [req.params.id]);
        const productoId = imagen[0].producto_id;
        const imagenes = await bd.query(`SELECT * FROM imagenes_producto WHERE producto_id = ? AND estado = 1`, [productoId]);
        console.log(imagenes.length);
        if (imagenes.length < 2) {
            res.json(respuesta.error(req, res, { message: 'No se puede inactivar la única imagen' }, 400));
            return;
        }

        await bd.query(`UPDATE imagenes_producto SET estado = ? WHERE id = ? AND imagen != 'uploads/images/productos/default.png'`, [0, req.params.id]);
        res.json(respuesta.success(req, res, { message: 'Imagen inactivada' }, 200));
    } catch (err) {
        res.json(respuesta.error(req, res, { message: 'Error al inactivar imagen', error: err }, 500));
    }
}

const reactiveImage = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, { message: tokenAccess.message }, 401));
            return;
        }

        const errors = await validate([
            {
                field: 'id',
                table: 'imagenes_producto',
                mustExist: true,
                required: true,
                params: true,
            }
        ], req);

        if (errors.hasErrors) {
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }

        // verificar que el producto tenga menos de 10 imagenes
        const imagenes = await bd.query(`SELECT * FROM imagenes_producto WHERE producto_id = ? AND estado = 1`, [req.params.id]);
        if (imagenes.length >= 10) {
            res.json(respuesta.error(req, res, { message: 'No se puede tener más de 10 imágenes' }, 400));
            return;
        }

        await bd.query(`UPDATE imagenes_producto SET estado = ? WHERE id = ?`, [1, req.params.id]);
        res.json(respuesta.success(req, res, { message: 'Imagen activada' }, 200));
    } catch (err) {
        res.json(respuesta.error(req, res, { message: 'Error al activar imagen', error: err }, 500));
    }
}

const deleteImage = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, { message: tokenAccess.message }, 401));
            return;
        }

        const errors = await validate([
            {
                field: 'id',
                table: 'imagenes_producto',
                mustExist: true,
                required: true,
                params: true,
            }
        ], req);

        if (errors.hasErrors) {
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }
        let imagen = await bd.query(`SELECT * FROM imagenes_producto WHERE id = ?`, [req.params.id]);
        console.log(imagen)
        if (imagen[0].estado == 0) {
            imagen = imagen[0].imagen;
            if (imagen != 'uploads/images/productos/default.png') {
                const result = deleteFile(imagen);
                if (!result.success) {
                    res.json(respuesta.error(req, res, { message: result.message, error: result.error }, 400));
                    return;
                }

                await bd.query(`DELETE FROM imagenes_producto WHERE id = ?`, [req.params.id]);
                res.json(respuesta.success(req, res, { message: 'Imagen eliminada' }, 200));
            } else {
                res.json(respuesta.error(req, res, { message: 'No se puede eliminar la imagen por defecto' }, 400));
            }
        } else {
            res.json(respuesta.error(req, res, { message: 'No se puede eliminar una imagen activa' }, 400));
        }
    } catch (err) {
        res.json(respuesta.error(req, res, { message: 'Error al eliminar imagen', error: err }, 500));
    }
}

const addImages = async (req, res) => {
    try {
        const tokenAccess = auth.AdminPermission(req);
        if (tokenAccess.error) {
            res.json(respuesta.error(req, res, { message: tokenAccess.message }, 401));
            return;
        }

        //Exceptuar la imagen uploads/images/productos/default.png y estado 0
        const imagenesProducto = await bd.query(`SELECT * FROM imagenes_producto WHERE producto_id = ? AND imagen != 'uploads/images/productos/default.png' AND estado = 1`, [req.body.producto_id]);
        const maxCount = 10 - imagenesProducto.length;
        if (maxCount < 1) {
            if (req.files) {
                Object.values(req.files).flat().map(thisFile => {
                    deleteFile(thisFile.path);
                });
            }
            res.json(respuesta.error(req, res, { message: 'No se puede tener más de 10 imágenes' }, 400));
            return;
        }
        const errors = await validate([
            {
                field: 'imagenes',
                type: 'file',
                allowedExtensions: ['png', 'jpg', 'jpeg', 'jfif'],
                required: true,
                maxCount: maxCount
            },
            {
                field: 'producto_id',
                table: 'productos',
                foreignField: 'id',
                mustExist: true,
                required: true,
            }
        ], req);
        if (errors.hasErrors) {
            if (req.files) {
                Object.values(req.files).flat().map(thisFile => {
                    deleteFile(thisFile.path);
                });
            }
            res.json(respuesta.error(req, res, errors.errors, 400));
            return;
        }

        let imagenes = [];
        if (req.files) {
            if (req.files['imagenes']) {
                req.files['imagenes'].map(img => {
                    let productoResult = saveFile(img, 'images/productos');
                    if (!productoResult.success) {
                        return res.json(respuesta.error(req, res, { message: productoResult.message, error: productoResult.error }, 400));
                    }
                    imagenes.push(productoResult.newPath);
                });
            }
        }
        imagenes.map(async (imagen) => {
            await bd.query(`INSERT INTO imagenes_producto set ?`, [{ producto_id: req.body.producto_id, imagen: imagen }]);
        })
        //Eliminar uploads/images/productos/default.png de la base de datos
        await bd.query(`DELETE FROM imagenes_producto WHERE producto_id = ? AND imagen = 'uploads/images/productos/default.png'`, [req.body.producto_id]);
        res.json(respuesta.success(req, res, { message: 'Imagenes agregadas' }, 200));
    } catch (err) {
        if (req.files) {
            Object.values(req.files).flat().map(thisFile => {
                deleteFile(thisFile.path);
            });
        }
        res.json(respuesta.error(req, res, { message: 'Error al agregar imagenes', error: err }, 500));
    }
}

module.exports = {
    get,
    show,
    showWithAllImages,
    store,
    update,
    toggleState,
    inactiveImage,
    reactiveImage,
    deleteImage,
    addImages,
};