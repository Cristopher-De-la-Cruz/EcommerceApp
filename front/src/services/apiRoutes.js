import config from '../config';

const back_host = config.app.back_host;

const apiRoutes = {
    usuarios: {
        login: `${back_host}api/usuarios/login`,
        register: `${back_host}api/usuarios/register`,
    }
}

export default apiRoutes;