const db = require('../DB/mysql');

const validate = async (validation = [], req) => {
    let errors = { "hasErrors": false, "errors": [] };

    try {
        for (const item of validation) {
            const fieldValue = item.params ? req.params[item.field] : req.body[item.field];
            // Validar si el campo es requerido
            if (item.required && !fieldValue) {
                errors.hasErrors = true;
                errors.errors.push(`${item.field} es obligatorio.`);
                continue; // Continuar con el siguiente campo
            }
            if(fieldValue || fieldValue == 0){
                // Validar tipo de datos
                if (item.type && typeof fieldValue !== item.type) {
                    errors.hasErrors = true;
                    errors.errors.push(`${item.field} debe ser un ${item.type}.`);
                    continue;
                }
    
                // Validar longitud mínima y máxima (para strings)
                if (item.min && fieldValue.length < item.min) {
                    errors.hasErrors = true;
                    errors.errors.push(`${item.field} debe tener al menos ${item.min} caracteres.`);
                }
                if (item.max && fieldValue.length > item.max) {
                    errors.hasErrors = true;
                    errors.errors.push(`${item.field} no puede tener más de ${item.max} caracteres.`);
                }
    
                // Validar valores únicos en base de datos
                if (item.unique) {
                    // Aquí deberías hacer la consulta a la base de datos para verificar si el valor ya existe
                    const exists = await db.query(`SELECT * FROM ${item.table} WHERE ${item.field} = ?`, [fieldValue]);
                    const maxLength = item.updating ? 1 : 0;
                    if (exists.length > maxLength) {
                        errors.hasErrors = true;
                        errors.errors.push(`${item.field} debe ser único.`);
                    }
                }
    
                if (item.mustExist) {
                    const field = item.foreignField ? item.foreignField : item.field;
                    // Aquí deberías hacer la consulta a la base de datos para verificar si el valor ya existe
                    const exists = await db.query(`SELECT * FROM ${item.table} WHERE ${field} = ?`, [fieldValue]);
                    if (exists.length < 1) {
                        errors.hasErrors = true;
                        errors.errors.push(`no existe ${item.field} ${fieldValue}.`);
                    }
                }
    
                // Validar valores numéricos
                if (item.type === 'number') {
                    if (isNaN(fieldValue)) {
                        errors.hasErrors = true;
                        errors.errors.push(`${item.field} debe ser un número.`);
                    }
                    
                    if (item.min && fieldValue < item.min) {
                        errors.hasErrors = true;
                        errors.errors.push(`${item.field} debe ser igual o mayor que ${item.min}.`);
                    }
    
                    if (item.max && fieldValue > item.max) {
                        errors.hasErrors = true;
                        errors.errors.push(`${item.field} debe ser igual o menor que ${item.max}.`);
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error al validar los campos:', err);
        errors.hasErrors = true;
        errors.errors.push('Error en la validación.');
    }

    return errors;
};

/*
    validation = [
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
            field: 'descripcion',
            type: 'string',
            required: true,
            min: 3,
            max: 50,
        },
        {
            field: 'precio',
            type: 'number',
            required: true,
            min: 0,
*/

module.exports = validate;