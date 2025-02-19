const db = require('../DB/mysql');

const validate = async (validation = [], req) => {
    let errors = { hasErrors: false, errors: [] };

    try {
        for (const item of validation) {
            let fieldValues = item.params ? req.params[item.field] : req.body[item.field];

            // Si es un array, aseguramos que `fieldValues` sea un array
            if (item.array) {
                fieldValues = Array.isArray(fieldValues) ? fieldValues : [fieldValues];
            } else {
                // Si no es un array, trabajamos directamente con el valor único
                fieldValues = [fieldValues];
            }

            for (const fieldValue of fieldValues) {
                // Validar si el campo es requerido
                console.log(`${item.field}: ${fieldValue != Number(0)}`)
                if (item.type != "file" && item.required && fieldValue !== 0 && (fieldValue === null || fieldValue === undefined || fieldValue === "")) {
                    errors.hasErrors = true;
                    errors.errors.push({ message: `${item.field} es obligatorio.` });
                    continue;
                }

                // Validar tipo de archivo
                if (item.type === "file") {
                    let files = req.files && req.files[item.field] ? req.files[item.field] : [];; // Inicializamos el array de archivos

                    if (item.required && files.length === 0) {
                        errors.hasErrors = true;
                        errors.errors.push({ message: `${item.field} es obligatorio.` });
                        continue;
                    }
                    if (files.length > item.maxCount) {
                        errors.hasErrors = true;
                        errors.errors.push({ message: `${item.field} debe tener como máximo ${item.maxCount} archivo${item.maxCount == 1 ? '' : 's'}.` });
                        continue;
                    }

                    if (files.length > 0) {
                        for (const file of files) {
                            if (file) {
                                // Validar extensiones permitidas
                                const fileExtension = file.originalname?.split(".").pop().toLowerCase();
                                if (item.allowedExtensions && !item.allowedExtensions.includes(fileExtension)) {
                                    errors.hasErrors = true;
                                    errors.errors.push(
                                        { message: `${file.originalname} tiene una extensión no permitida (${fileExtension}). Extensiones permitidas: ${item.allowedExtensions.join(", ")}.` }
                                    );
                                }

                                // Validar tamaño máximo del archivo
                                if (item.maxSize && file.size > item.maxSize) {
                                    errors.hasErrors = true;
                                    errors.errors.push({ message: `${file.originalname} excede el tamaño máximo permitido (${item.maxSize} bytes).` });
                                }
                            }
                        }
                    }
                }

                if (fieldValue) {

                    // Validar tipo de datos (por ejemplo: string, number, etc.)
                    if (item.type === 'date') {
                        const isValidDate = !isNaN(Date.parse(fieldValue));
                        if (!isValidDate) {
                            errors.hasErrors = true;
                            errors.errors.push({ message: `${item.field} debe ser una fecha válida.` });
                        }
                    } else if (item.type && item.type !== 'file' && typeof fieldValue !== item.type) {
                        errors.hasErrors = true;
                        errors.errors.push({ message: `${item.field} debe ser un ${item.type}.` });
                        continue;
                    }
                    // Validar longitud mínima y máxima (para strings)
                    if (item.min && fieldValue.length < item.min) {
                        errors.hasErrors = true;
                        errors.errors.push({ message: `${item.field} debe tener al menos ${item.min} caracteres.` });
                    }
                    if (item.max && fieldValue.length > item.max) {
                        errors.hasErrors = true;
                        errors.errors.push({ message: `${item.field} no puede tener más de ${item.max} caracteres.` });
                    }

                    // Validar valores únicos en base de datos
                    if (item.unique) {
                        const exists = await db.query(`SELECT * FROM ${item.table} WHERE ${item.field} = ? ${item.updating ? `AND id != ${item.updatingId}` : ''}`, [fieldValue]);
                        if (exists.length > 0) {
                            errors.hasErrors = true;
                            errors.errors.push({ message: `${item.field} debe ser único.` });
                        }
                    }

                    // Validar si el valor debe existir en la base de datos
                    if (item.mustExist) {
                        const field = item.foreignField ? item.foreignField : item.field;
                        const exists = await db.query(`SELECT * FROM ${item.table} WHERE ${field} = ?`, [fieldValue]);
                        if (exists.length < 1) {
                            errors.hasErrors = true;
                            errors.errors.push({ message: `No existe ${item.field} con el valor ${fieldValue}.` });
                        }
                    }

                    // Validar valores numéricos
                    if (item.type === "number") {
                        if (isNaN(fieldValue)) {
                            errors.hasErrors = true;
                            errors.errors.push({ message: `${item.field} debe ser un número.` });
                        }

                        if (item.min && fieldValue < item.min) {
                            errors.hasErrors = true;
                            errors.errors.push({ message: `${item.field} debe ser igual o mayor que ${item.min}.` });
                        }

                        if (item.max && fieldValue > item.max) {
                            errors.hasErrors = true;
                            errors.errors.push({ message: `${item.field} debe ser igual o menor que ${item.max}.` });
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error("Error al validar los campos:", err);
        errors.hasErrors = true;
        errors.errors.push({ message: "Error en la validación.", error: err });
    }

    return errors;
};


module.exports = validate;