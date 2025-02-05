import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RenderWithAnimation } from "../../../RenderWithAnimation"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { useContext, useEffect, useState } from "react"
import { FilterContext } from "../../../../context/Filter/FilterContext"
import { AuthContext } from "../../../../context/Auth/AuthContext"
import { useApi } from "../../../../hooks/useApi"
import apiRoutes from "../../../../services/apiRoutes"
import { useNavigate } from "react-router-dom"
import { ToastContext } from "../../../../context/Toast/ToastContext"

export const BarsButton = () => {
    const { toast, theme } = useContext(ToastContext)
    const { token } = useContext(AuthContext)
    const [categorias, setCategorias] = useState([]);
    const { setCategoria } = useContext(FilterContext);

    const { fetchApi } = useApi();

    const getCategories = async () => {
        const response = await fetchApi(apiRoutes.categorias.get, 'GET', null, token)
        if (response.success) {
            setCategorias(response.body);
        } else {
            toast.error(response.body.message || 'Error al obtener las categorías', { position: "bottom-right", theme: theme });
        }
    }

    const navigate = useNavigate();

    useEffect(() => {
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCategoriaClick = (value) => {
        setCategoria({id: value.id, nombre: value.nombre});
        if(window.location.pathname !== '/') {
            navigate('/')
        }
    }

    return (
        <>
            <RenderWithAnimation buttonClass="border-2 text-white rounded-md w-10 h-10 flex text-xl justify-center items-center cursor-pointer"
                buttonChildren={<FontAwesomeIcon icon={faBars} className="text-white" />}
                contClass="absolute duration-400 text-black bg-slate-100 w-xs dark:text-white dark:bg-zinc-900 left-0 top-16 transition-all ease-out transform"
                contStyle={{ height: 'calc(100vh - 4rem)' }}
                renderAnimationClass="opacity-100 translate-x-0 scale-100"
                exitAnimationClass="opacity-0 -translate-x-5 scale-95"
            >
                <div className={`duration-400 h-full max-h-full w-full overflow-y-scroll bar-scroll-${theme} py-1 px-2 flex flex-col gap-3`}>
                    <div className='py-1 px-2 border-b font-bold text-center'>
                        <h2>BUSCAR POR CATEGORÍA</h2>
                    </div>
                    <div onClick={() => handleCategoriaClick({id: '', nombre: 'Todas las Categorías'}) } className='duration-300 pb-1 px-3 border-b font-bold cursor-pointer hover:scale-105'>
                        <h2>Todas las Categorías</h2>
                    </div>
                    {
                        categorias.map(categoria => (
                            <div onClick={() => handleCategoriaClick({id: categoria.id, nombre: categoria.nombre})} key={categoria.id} className='duration-300 pb-1 px-3 border-b font-bold cursor-pointer hover:scale-105'>
                                <h2>{categoria.nombre}</h2>
                            </div>
                        ))
                    }
                </div>
            </RenderWithAnimation>
        </>
    )
}
