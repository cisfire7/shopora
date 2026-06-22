import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemsToCart } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../AIStyles/SmartReplenishmentHome.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReplayIcon from '@mui/icons-material/Replay';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useNavigate } from 'react-router-dom';

const SmartReplenishmentHome = () => {
    const [predictions, setPredictions] = useState([]);
    const [essentials, setEssentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedIds, setAddedIds] = useState(new Set());
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.user);

    useEffect(() => {
        fetchData();
    }, [isAuthenticated]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: essentialData } = await axios.get('/api/v1/ai/smart-refill-products');
            setEssentials(essentialData.products || []);

            if (isAuthenticated) {
                try {
                    const { data } = await axios.get('/api/v1/ai/replenishment', { withCredentials: true });
                    setPredictions(data.predictions || []);
                } catch (e) {
                    console.error("Replenishment fetch failed:", e);
                }
            }
        } catch (error) {
            console.error("Failed to fetch smart refill data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (item) => {
        const id = item.productId || item._id;
        if (id) {
            await dispatch(addItemsToCart({ id: id.toString(), quantity: item.suggestedQuantity || 1 }));
            setAddedIds(prev => new Set([...prev, id.toString()]));
            toast.success(`${item.name} added to cart!`);
        }
    };

    const handleReorderAll = async () => {
        const items = displayItems;
        const newAddedIds = new Set(addedIds);
        for (const item of items) {
            const id = item.productId || item._id;
            if (id) {
                await dispatch(addItemsToCart({ id: id.toString(), quantity: item.suggestedQuantity || 1 }));
                newAddedIds.add(id.toString());
            }
        }
        setAddedIds(newAddedIds);
        toast.success(`${items.length} items added to cart!`);

        // Refresh list with new products after adding all
        try {
            const { data: essentialData } = await axios.get('/api/v1/ai/smart-refill-products');
            setEssentials(essentialData.products || []);
        } catch (e) {}
    };

    if (loading) return null;

    // Use predictions if available, otherwise show essentials (filter out already added)
    const hasPredictions = predictions.length > 0;
    const allItems = hasPredictions ? predictions.slice(0, 8) : essentials.slice(0, 8);
    const displayItems = allItems.filter(item => {
        const id = (item.productId || item._id || '').toString();
        return !addedIds.has(id);
    }).slice(0, 6);

    if (displayItems.length === 0 && addedIds.size === 0) return null;

    return (
        <div className="replenish-home-section">
            <div className="replenish-home-header">
                <div className="replenish-home-title">
                    <AutorenewIcon className="replenish-home-icon" />
                    <div>
                        <h2>🛒 Smart Refill</h2>
                        <p className="replenish-home-subtitle">
                            <strong>What is Smart Refill?</strong> Based on your shopping habits, AI suggests items you buy regularly so you never run out. One tap to restock!
                        </p>
                    </div>
                </div>
                <div className="replenish-home-actions">
                    {displayItems.length > 0 && (
                        <button className="replenish-home-reorder-all" onClick={handleReorderAll}>
                            <AddShoppingCartIcon /> Add All to Cart
                        </button>
                    )}
                    {isAuthenticated && (
                        <button className="replenish-home-view-all" onClick={() => navigate('/ai/replenishment')}>
                            View All <ArrowForwardIcon />
                        </button>
                    )}
                </div>
            </div>

            {displayItems.length === 0 ? (
                <div className="replenish-home-all-added">
                    ✅ All suggested items added to cart! <button onClick={fetchData}>Refresh suggestions</button>
                </div>
            ) : (
                <div className="replenish-home-cards">
                    {displayItems.map((item, index) => (
                        <div key={index} className="replenish-home-card">
                            {hasPredictions && (
                                <div className="replenish-home-card-urgency">
                                    {item.urgency === 'high' ? '🔴' : item.urgency === 'medium' ? '🟡' : '🟢'}
                                </div>
                            )}
                            {!hasPredictions && item.image?.[0]?.url && (
                                <img src={item.image[0].url} alt={item.name} className="replenish-home-card-img" />
                            )}
                            <div className="replenish-home-card-info">
                                <h4>{item.name}</h4>
                                {hasPredictions ? (
                                    <>
                                        <div className="replenish-home-card-meta">
                                            <span><AccessTimeIcon /> {item.daysSinceLastPurchase}d ago</span>
                                            <span><ReplayIcon /> Every {item.avgFrequencyDays}d</span>
                                        </div>
                                        <p className="replenish-home-card-msg">{item.message}</p>
                                    </>
                                ) : (
                                    <div className="replenish-home-card-meta">
                                        <span className="replenish-home-card-category">{item.category}</span>
                                    </div>
                                )}
                            </div>
                            <div className="replenish-home-card-action">
                                <span className="replenish-home-card-price">₹{item.price}</span>
                                <button onClick={() => handleReorder(item)} aria-label={`Add ${item.name} to cart`}>
                                    <AddShoppingCartIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SmartReplenishmentHome;
