import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemsToCart } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../AIStyles/SmartReplenishment.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReplayIcon from '@mui/icons-material/Replay';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PageTitle from '../Components/PageTitle';

const SmartReplenishment = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchReplenishments();
    }, []);

    const fetchReplenishments = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/v1/ai/replenishment', { withCredentials: true });
            setPredictions(data.predictions || []);
        } catch (error) {
            console.error("Failed to fetch replenishments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = (item) => {
        if (item.productId) {
            dispatch(addItemsToCart({ id: item.productId, quantity: item.suggestedQuantity || 1 }));
            toast.success(`${item.name} added to cart!`);
        }
    };

    const handleReorderAll = () => {
        predictions.forEach(item => {
            if (item.productId) {
                dispatch(addItemsToCart({ id: item.productId, quantity: item.suggestedQuantity || 1 }));
            }
        });
        toast.success(`${predictions.length} items added to cart!`);
    };

    if (loading) {
        return (
            <>
            <Navbar/>
            <PageTitle title="Smart Replenishment"/>
            <div className="replenish-container">
                <div className="replenish-loading">
                    <div className="replenish-spinner"></div>
                    <p>Analyzing your purchase history...</p>
                </div>
            </div>
            <Footer/>
            </>
        );
    }

    return (
        <>
        <Navbar/>
        <PageTitle title="Smart Replenishment"/>
        <div className="replenish-container" style={{ marginTop: "100px" }} >
            <div className="replenish-header">
                <div className="replenish-title">
                    <ShoppingCartIcon className="replenish-icon" />
                    <div>
                        <h2>Smart Replenishment</h2>
                        <p>AI predicts recurring needs and enables one-click reordering based on purchase history</p>
                        <p className="replenish-explain"><strong>What is Smart Replenishment?</strong> Our AI analyzes your past orders — what you bought, how often, and when. It then predicts which items you're likely running out of and reminds you to reorder before you run out. No manual tracking needed!</p>
                    </div>
                </div>
                {predictions.length > 0 && (
                    <button className="replenish-reorder-all" onClick={handleReorderAll}>
                        <ReplayIcon /> Reorder All
                    </button>
                )}
            </div>

            {predictions.length === 0 ? (
                <div className="replenish-empty">
                    <TrendingUpIcon className="replenish-empty-icon" />
                    <h3>No predictions yet</h3>
                    <p>Place a few orders and we'll start predicting what you'll need next!</p>
                </div>
            ) : (
                <div className="replenish-grid">
                    {predictions.map((item, index) => (
                        <div key={index} className="replenish-card">
                            <div className="replenish-card-top">
                                <div className="replenish-product-info">
                                    <h4>{item.name}</h4>
                                    <span className="replenish-category">{item.category}</span>
                                </div>
                                <div className="replenish-urgency" data-urgency={item.urgency}>
                                    {item.urgency === 'high' ? '🔴' : item.urgency === 'medium' ? '🟡' : '🟢'} {item.urgency}
                                </div>
                            </div>
                            <div className="replenish-card-body">
                                <div className="replenish-stat">
                                    <AccessTimeIcon />
                                    <span>Last purchased: <strong>{item.daysSinceLastPurchase} days ago</strong></span>
                                </div>
                                <div className="replenish-stat">
                                    <ReplayIcon />
                                    <span>Avg. frequency: <strong>Every {item.avgFrequencyDays} days</strong></span>
                                </div>
                                <div className="replenish-stat">
                                    <TrendingUpIcon />
                                    <span>Times ordered: <strong>{item.orderCount}×</strong></span>
                                </div>
                                <p className="replenish-message">{item.message}</p>
                            </div>
                            <div className="replenish-card-actions">
                                <button className="replenish-add-btn" onClick={() => handleReorder(item)}>
                                    <AddShoppingCartIcon /> Reorder (×{item.suggestedQuantity || 1})
                                </button>
                                <span className="replenish-price">₹{item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <Footer/>
        </>
    );
};

export default SmartReplenishment;
