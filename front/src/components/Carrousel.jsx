import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export const Carrousel = ({ slides, height = 'h-64', width = 'w-full', autoSlide = false, autoSlideInterval = 5000, prevButton = true, nextButton = true, indicators = true }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        let interval;
        if (autoSlide) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            }, autoSlideInterval);
        }

        return () => {
            clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonta o cuando autoSlide se cambia
        };
    }, [autoSlide, autoSlideInterval, slides.length]);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className={`relative ${width} mx-auto z-10`}>
            {/* Slides */}
            <div className={`relative overflow-hidden rounded-lg ${height}`}>
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide) => (
                        <div
                            key={slide.id}
                            className={`min-w-full flex justify-center items-center text-center bg-transparent ${height}`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className={`object-cover ${height} rounded-md`}
                            />
                        </div>
                    ))}
                </div>

                {/* Controls */}
                {
                    prevButton &&
                    <button
                        onClick={handlePrev}
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 text-black dark:text-white hover:text-gray-500 cursor-pointer text-2xl p-2 rounded-full focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                }
                {
                    nextButton &&
                    <button
                        onClick={handleNext}
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 text-black dark:text-white hover:text-gray-500 cursor-pointer text-2xl p-2 rounded-full focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                }
            </div>

            {/* Indicators */}
            {
                indicators &&
                <div className="flex justify-center gap-2 mt-4">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 border border-white rounded-full ${index === currentSlide
                                ? 'bg-gray-800'
                                : 'bg-gray-400 hover:bg-gray-600'
                                }`}
                        ></button>
                    ))}
                </div>
            }
        </div>
    );
};

Carrousel.propTypes = {
    slides: PropTypes.array.isRequired,
    height: PropTypes.string,
    width: PropTypes.string,
    autoSlide: PropTypes.bool,
    autoSlideInterval: PropTypes.number,
    prevButton: PropTypes.bool,
    nextButton: PropTypes.bool,
    indicators: PropTypes.bool,
};

// Carrousel.defaultProps = {
//     autoSlide: false,
//     autoSlideInterval: 4000, // 3 segundos por defecto
// };
