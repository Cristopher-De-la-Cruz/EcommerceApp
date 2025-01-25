const jwt = require('jsonwebtoken');
const config = require('../config');

const getTokenPayload = (req) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return { error: true, message: 'No token ingresado' };
        } else {
            token = token.split(' ')[1];
            try {
                const payload = jwt.verify(token, config.jwt.secret);
                if (payload) {
                    if (payload.expires && Date.now() > payload.exp * 1000) {
                        return { error: true, message: 'Token expirado' };
                    } else {
                        return { error: false, payload };
                    }
                }
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    return { error: true, message: 'Token expirado' };
                } else if (err.name === 'JsonWebTokenError') {
                    return { error: true, message: 'Token inválido' };
                } else {
                    return { error: true, message: 'Error al verificar el token' };
                }
            }
        }
    } catch (err) {
        return { error: true, message: 'Error al procesar el token' };
    }
};

module.exports = {
    getTokenPayload
}