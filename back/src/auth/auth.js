const jwtHelper = require('../helper/jwt');

const AdminPermission = (req) => {
    const payload = jwtHelper.getTokenPayload(req);
    if(payload.error){
        return payload;
    } else {
        if(payload.payload.user_role == 1){
            return payload;
        } else {
            return {error: true, message: 'No tienes permisos para realizar esta acción'};
        }
    }
}
module.exports = {
    AdminPermission
}