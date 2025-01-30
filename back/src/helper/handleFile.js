const multer = require('multer');
const fs = require('node:fs');
const respuesta = require('./respuestas');

const file = multer({
    dest: 'uploads/'
});

const saveFile = (file, path = '/') => {
    try {
        //Añadir extension del archivo: 
        const ext = file.originalname.split('.').pop();

        const name = Date.now() + Math.round(Math.random() * 1e9) + '.' + ext;

        const dirPath = `uploads/${path}`;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Nueva ruta completa del archivo
        const newPath = `${dirPath}/${name}`;

        // Mover el archivo al nuevo destino
        fs.renameSync(file.path, newPath);
        return { success: true, message: 'Archivo guardado exitosamente', file: file, newPath: newPath };
    } catch (err) {
        console.error(err);
        return { success: false, message: 'Error guardando archivo', error: err };
    }
};

const deleteFile = (path) => {
    try {
        fs.unlinkSync(path);
        return { success: true, message: 'Archivo eliminado exitosamente' };
    } catch (err) {
        console.error(err);
        return { success: false, message: 'Error eliminando archivo', error: err };
    }
};


const fileMiddleware = (fields = []) => {
    return (req, res, next) => {
        const upload = file.fields(fields);
        upload(req, res, (err) => {
            if (err) {
                console.log(err)
                return res.json(respuesta.error(req, res, ['Error guardando archivo'], 400));
            }
            next();
        });
    };
};


module.exports = {
    file,
    saveFile,
    deleteFile,
    fileMiddleware
};