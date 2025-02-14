import { PropTypes } from 'prop-types'
// import { ExpansiveImage } from '../../../ExpansiveImage'
import { ProductImage } from './ProductImage'

export const ProductImages = ({ imagenes, fetchAgain }) => {

    return (
        <>
            <div className="w-full grid grid-cols-2 gap-2 z-10 ">
                {imagenes.map((imagen) => (
                    <div key={imagen.id}
                        className={`w-full rounded-xl overflow-hidden`}
                    >
                        <ProductImage imagen={imagen} fetchAgain={fetchAgain} />
                    </div>
                ))}
            </div>
        </>
    )
}
ProductImages.propTypes = {
    imagenes: PropTypes.array,
    fetchAgain: PropTypes.func,
}
