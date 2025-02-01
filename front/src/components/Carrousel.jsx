import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export const Carrousel = ({ slides }) => {

    const [currentSlide, setCurrentSlide] = useState(0);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full h-full max-w-2xl mx-auto">
            {/* Slides */}
            <div className="overflow-hidden rounded-lg">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide) => (
                        <div
                            key={slide.id}
                            className="min-w-full flex-shrink-0 text-center bg-gray-100 dark:bg-zinc-800"
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <button
                onClick={handlePrev}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 text-black hover:text-white cursor-pointer text-2xl p-2 rounded-full shadow-md focus:outline-none"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
                onClick={handleNext}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 text-black hover:text-white cursor-pointer text-2xl p-2 rounded-full shadow-md focus:outline-none"
            >
                <FontAwesomeIcon icon={faArrowRight} />
            </button>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full ${index === currentSlide
                                ? 'bg-gray-800'
                                : 'bg-gray-400 hover:bg-gray-600'
                            }`}
                    ></button>
                ))}
            </div>
        </div>
    );
}

Carrousel.propTypes = {
    slides: PropTypes.array.isRequired,
};