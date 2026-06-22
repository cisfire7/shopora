import React, { useState } from 'react'
import '../componentStyles/Rating.css'

function Rating({ value = 0, onRatingChange, disabled = false }) {

  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(value)

  // handle mouseEnter
  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoveredRating(rating)
    }
  }

  // handle mouseLeave
  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0)
    }
  }

  // handle click
  const handleClick = (rating) => {
    if (!disabled) {
      setSelectedRating(rating)
      if (onRatingChange) {
        onRatingChange(rating)
      }
    }
  }

  // Generating stars
  const generateStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredRating || selectedRating)

      stars.push(
        <span
          key={i}
          className={`star ${isFilled ? "filled" : "empty"}`}
          style={{ pointerEvents: disabled ? "none" : "auto" }}
         
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
           onClick={() => handleClick(i)}
        >
          ★
        </span>
      )
    }
    return stars
  }

  return (
    <div>
      <div className="rating">
        {generateStars()}
      </div>
    </div>
  )
}

export default Rating
