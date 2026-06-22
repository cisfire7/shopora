import React, { useEffect, useState } from 'react'
import '../componentStyles/ImageSlider.css'

const images = [
  './images/banner image 11.jpg',
  './images/Banner Image 21.jpeg',
  './images/Banner Image 31.jpeg',
  './images/Banner Image 32.jpeg',
  './images/Banner Image 33.jpeg',
  './images/Banner Image 21.jpeg',
  './images/Banner Image 26.jpeg',
  './images/Banner Image 22.jpeg',
  './images/Banner Image 23.jpeg',
  './images/Banner Image 25.jpeg',
  './images/Banner Image 6.jpeg',
  './images/Banner Image 7.jpeg',
]

// clone first & last
const sliderImages = [
  images[images.length - 1],
  ...images,
  images[0],
]

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [enableTransition, setEnableTransition] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // handle seamless loop
  useEffect(() => {
    if (currentIndex === sliderImages.length - 1) {
      setTimeout(() => {
        setEnableTransition(false)
        setCurrentIndex(1)
      }, 1000)
    }

    if (currentIndex === 0) {
      setTimeout(() => {
        setEnableTransition(false)
        setCurrentIndex(sliderImages.length - 2)
      }, 1000)
    }
  }, [currentIndex])

  // re-enable animation after jump
  useEffect(() => {
    if (!enableTransition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true)
        })
      })
    }
  }, [enableTransition])

  return (
    <div className="image-slider-container">
      <div
        className="slider-images"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: enableTransition ? 'transform 1s ease' : 'none',
        }}
      >
        {sliderImages.map((image, index) => (
          <div className="slider-item" key={index}>
            <img src={image} alt={`slider ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex - 1 === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index + 1)}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageSlider
