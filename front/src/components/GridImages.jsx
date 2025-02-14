import { PropTypes } from 'prop-types'

export const GridImages = ({imagenes}) => {
    
    return (
        <div>
            <div className="w-full h-full grid grid-cols-3 gap-2 ">
                {imagenes.map((imagen, index) => (
                    <div key={imagen.id}
                        className={`w-full h-full ${imagenes.length % 2 == 0 ? index != 0 && (index + 1) == imagenes.length && 'md:col-span-3' : ''} rounded-xl overflow-hidden ${index % 3 == 0 ? index + 1 == imagenes.length ? 'md:col-span-3' : 'md:col-span-2 md:row-span-2' : ''}`}
                    >
                        <img
                            src={imagen?.imagen}
                            alt={imagen?.nombre || 'Image'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

GridImages.propTypes = {
    imagenes: PropTypes.array,
}
