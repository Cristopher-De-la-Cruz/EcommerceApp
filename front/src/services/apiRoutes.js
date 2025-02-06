import config from '../config';

const back_host = config.app.back_host;

const apiRoutes = {
    usuarios: {
        login: `${back_host}api/usuarios/login`,
        register: `${back_host}api/usuarios/register`,
    },
    categorias: {
        get: `${back_host}api/categorias`,
        store: `${back_host}api/categorias`,
        update: `${back_host}api/categorias/`,
        toggleState: `${back_host}api/categorias/toggleState/`,
    },
    productos: {
        get: `${back_host}api/productos`,
        show: `${back_host}api/productos/`,
        showWithAllImages: `${back_host}api/productos/showWithAllImages/`,
        store: `${back_host}api/productos`,
        update: `${back_host}api/productos`,
        toggleState: `${back_host}api/productos/toggleState/`,
        inactiveImage: `${back_host}api/productos/inactiveImage/`,
        reactiveImage: `${back_host}api/productos/reactiveImage/`,
        deleteImage: `${back_host}api/productos/deleteImage/`,
        addImages: `${back_host}api/productos/addImages`,
    },
    carrito: {
        get: `${back_host}api/carrito_compras`,
        store: `${back_host}api/carrito_compras`,
        changeCantidad: `${back_host}api/carrito_compras/changeCantidad/`,
        inactivate: `${back_host}api/carrito_compras/inactivate/`,
    },
    ventas: {
        get: `${back_host}api/ventas`,
        show: `${back_host}api/ventas/show/`,
        store: `${back_host}api/ventas`,
    }
}

export default apiRoutes;