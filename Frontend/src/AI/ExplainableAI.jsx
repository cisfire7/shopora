import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemsToCart } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../AIStyles/ExplainableAI.css';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PageTitle from '../Components/PageTitle';

const ExplainableAI = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/v1/ai/personalized', { withCredentials: true });
            setRecommendations(data.recommendations || []);
        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        if (item.productId) {
            dispatch(addItemsToCart({ id: item.productId, quantity: 1 }));
            toast.success(`${item.name} added to cart!`);
        }
    };

    if (loading) {
        return (
            <>
            <Navbar/>
            <PageTitle title="AI Personalized Picks"/>
            <div className="explain-container">
                <div className="explain-loading">
                    <div className="explain-spinner"></div>
                    <p>Personalizing recommendations for you...</p>
                </div>
            </div>
            <Footer/>
            </>
        );
    }

    return (
        <>
        <Navbar/>
        <PageTitle title="AI Personalized Picks"/>
        <div className="explain-container"  style={{ marginTop: "100px" }} >
            <div className="explain-header">
                <SmartToyIcon className="explain-icon" />
                <div>
                    <h2>Explainable & Personalized AI</h2>
                    <p>AI explains every recommendation and suggests budget or premium alternatives based on your preferences</p>
                </div>
            </div>

            {recommendations.length === 0 ? (
                <div className="explain-empty">
                    <LightbulbIcon className="explain-empty-icon" />
                    <h3>Building your profile</h3>
                    <p>As you shop more, our AI will learn your preferences and provide personalized, explained recommendations.</p>
                </div>
            ) : (
                <div className="explain-list">
                    {recommendations.map((rec, index) => (
                        <div key={index} className="explain-card">
                            <div className="explain-card-header">
                                <div className="explain-product">
                                    <h4>{rec.name}</h4>
                                    <span className="explain-price">₹{rec.price}</span>
                                </div>
                                <span className="explain-match-score">
                                    <StarIcon /> {rec.matchScore}% match
                                </span>
                            </div>

                            {/* Explanation */}
                            <div className="explain-reason">
                                <InfoIcon className="explain-reason-icon" />
                                <p><strong>Why this product:</strong> {rec.explanation}</p>
                            </div>

                            {/* Alternatives */}
                            {rec.alternatives && rec.alternatives.length > 0 && (
                                <div className="explain-alternatives">
                                    <h5>Alternatives:</h5>
                                    <div className="explain-alt-list">
                                        {rec.alternatives.map((alt, i) => (
                                            <div key={i} className="explain-alt-item">
                                                <span className="explain-alt-name">{alt.name}</span>
                                                <span className="explain-alt-price">₹{alt.price}</span>
                                                <span className={`explain-alt-type ${alt.type}`}>
                                                    {alt.type === 'budget' ? <><TrendingDownIcon /> Budget</> : <><TrendingUpIcon /> Premium</>}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button className="explain-add-btn" onClick={() => handleAddToCart(rec)}>
                                <AddShoppingCartIcon /> Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <Footer/>
        </>
    );
};

export default ExplainableAI;
