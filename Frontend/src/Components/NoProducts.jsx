import React from 'react'
import '../componentStyles/NoProducts.css'

function NoProducts({keyword}) {

  return (
    <div className="no-products-content">
        <div className="no-products-icon">⚠️</div>
        <h3 className="no-products-title">No Products Found</h3>
        <p className="no-products-message">
            {
                keyword ? `We're sorry, but we couldn't find any products that match your search "${keyword}". Please try searching for something else.`:
                `We're sorry, but we couldn't find any products. Please try searching for something else.`
            }</p>
    </div>
  )
}

export default NoProducts