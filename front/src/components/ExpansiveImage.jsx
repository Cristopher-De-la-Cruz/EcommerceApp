import { RenderWithAnimation } from './RenderWithAnimation'
import { PropTypes } from 'prop-types'

export const ExpansiveImage = ({ image, children }) => {
    return (
        <RenderWithAnimation buttonChildren={image}
            contClass={`duration-600 absolute z-50 transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            text-black bg-zinc-300 dark:bg-black h-150 dark:text-white transition-all ease-out p-4 rounded-xl
            shadow-2xl shadow-zinc-500 dark:shadow-black`}
            renderAnimationClass="opacity-100 scale-100"
            exitAnimationClass="opacity-0 -translate-y-30 scale-80"
            closeButton={true}>

                {children}
        </RenderWithAnimation>
    )
}

ExpansiveImage.propTypes = {
    image: PropTypes.node,
    children: PropTypes.node,
}