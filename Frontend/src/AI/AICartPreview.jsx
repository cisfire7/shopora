import React, { useState } from 'react';
import '../AIStyles/AICartPreview.css';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const AICartPreview = ({ cart, onAddAll, onAddSingle, onSave, onRegenerate, onNewCart }) => {
    const [expandedReasons, setExpandedReasons] = useState(new Set());

    if (!cart || !cart.items) return null;

    const toggleReason = (index) => {
        setExpandedReasons(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <div className="ai-cart-preview">
            {/* Header with confidence and tags */}
            <div className="ai-cart-header">
                <div className="ai-cart-meta">
                    <div className="ai-confidence">
                        <AutoAwesomeIcon />
                        <span>Confidence: <strong>{cart.confidenceScore}%</strong></span>
                    </div>
                    <div className="ai-tags">
                        {cart.tags?.map((tag, i) => (
                            <span key={i} className="ai-tag">{tag}</span>
                        ))}
                    </div>
                </div>
                <p className="ai-reasoning">{cart.reasoning}</p>
            </div>

            {/* Items list */}
            <div className="ai-cart-items">
                <h3>Recommended Items ({cart.items.length})</h3>
                {cart.items.length === 0 ? (
                    <p className="ai-no-items">No matching products found in our store. Try a different prompt!</p>
                ) : (
                    <div className="ai-items-grid">
                        {cart.items.map((item, index) => (
                            <div key={index} className="ai-item-card">
                                <div className="ai-item-image">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} />
                                    ) : (
                                        <div className="ai-item-placeholder">
                                            <NewReleasesIcon />
                                        </div>
                                    )}
                                </div>
                                <div className="ai-item-info">
                                    <h4>{item.name}</h4>
                                    <span className="ai-item-category">{item.category}</span>
                                    <div className="ai-item-pricing">
                                        <span className="ai-item-price">₹{item.price}</span>
                                        <span className="ai-item-qty">× {item.quantity}</span>
                                        <span className="ai-item-subtotal">= ₹{item.price * item.quantity}</span>
                                    </div>
                                    {expandedReasons.has(index) && (
                                        <div className="ai-item-reason-expanded">
                                            <strong>Why this item:</strong> {item.reason}
                                        </div>
                                    )}
                                </div>
                                <div className="ai-item-actions">
                                    <button
                                        className="ai-why-btn"
                                        onClick={() => toggleReason(index)}
                                        aria-label={`Why ${item.name}`}
                                        title="Why this item?"
                                    >
                                        <HelpOutlineIcon />
                                        <span>Why</span>
                                    </button>
                                    <button
                                        className="ai-add-single-btn"
                                        onClick={() => onAddSingle(item)}
                                        aria-label={`Add ${item.name} to cart`}
                                    >
                                        <AddCircleIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Total and actions */}
            {cart.items.length > 0 && (
                <div className="ai-cart-footer">
                    <div className="ai-cart-total">
                        <span>Estimated Total:</span>
                        <strong>₹{cart.totalEstimatedPrice}</strong>
                    </div>
                    <div className="ai-cart-actions">
                        <button className="ai-btn ai-btn-primary" onClick={onAddAll}>
                            <AddShoppingCartIcon /> Add All to Cart
                        </button>
                        <button className="ai-btn ai-btn-secondary" onClick={onSave}>
                            <SaveIcon /> Save Cart
                        </button>
                        <button className="ai-btn ai-btn-outline" onClick={onRegenerate}>
                            <RefreshIcon /> Regenerate
                        </button>
                        <button className="ai-btn ai-btn-ghost" onClick={onNewCart}>
                            New Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AICartPreview;
