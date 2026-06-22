import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateAICart, saveAICart, regenerateAICart, removeError, removeSuccess, clearCurrentCart } from '../features/ai/aiSlice';
import { addItemsToCart } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';
import AICartPreview from './AICartPreview';
import AIPromptSuggestions from './AIPromptSuggestions';
import '../AIStyles/AIAssistant.css';
import SmartAssistantIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PageTitle from '../Components/PageTitle';
import { Margin } from '@mui/icons-material';

const AIAssistant = () => {
    const [prompt, setPrompt] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, currentCart, error, success, message } = useSelector(state => state.ai);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }
        if (success && message) {
            toast.success(message);
            dispatch(removeSuccess());
        }
    }, [error, success, message, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!prompt.trim()) {
            toast.error("Please enter what you'd like to shop for");
            return;
        }
        dispatch(generateAICart(prompt));
    };

    const handleSuggestionClick = (suggestion) => {
        setPrompt(suggestion);
        dispatch(generateAICart(suggestion));
    };

    const handleAddAllToCart = () => {
        if (!currentCart || !currentCart.items.length) return;
        currentCart.items.forEach(item => {
            if (item.product) {
                dispatch(addItemsToCart({ id: item.product, quantity: item.quantity }));
            }
        });
        toast.success("All items added to cart!");
    };

    const handleAddSingleItem = (item) => {
        if (item.product) {
            dispatch(addItemsToCart({ id: item.product, quantity: item.quantity }));
            toast.success(`${item.name} added to cart`);
        }
    };

    const handleSaveCart = () => {
        if (currentCart?._id) {
            dispatch(saveAICart(currentCart._id));
        }
    };

    const handleRegenerate = () => {
        if (currentCart?._id) {
            dispatch(regenerateAICart(currentCart._id));
        }
    };

    const handleNewCart = () => {
        setPrompt('');
        dispatch(clearCurrentCart());
    };

    return (
        <>
        <Navbar/>
        <PageTitle title="AI Shopping Assistant"/>
        <div className="ai-assistant-container" style={{ marginTop: "100px" }}>
            <div className="ai-assistant-header">
                <SmartAssistantIcon className="ai-icon" />
                <h1>AI Shopping Assistant</h1>
                <p>Tell me what you need, and I'll build the perfect cart for you</p>
                <button className="ai-history-btn" onClick={() => navigate('/ai/history')}>
                    <HistoryIcon /> History
                </button>
            </div>

            {!currentCart && (
                <>
                    <form className="ai-prompt-form" onSubmit={handleSubmit}>
                        <div className="ai-input-wrapper">
                            <input
                                type="text"
                                placeholder="e.g., Prepare breakfast for 5 people, Weekly groceries under ₹3000..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={loading}
                                maxLength={500}
                                aria-label="Describe what you want to shop for"
                            />
                            <button type="submit" disabled={loading || !prompt.trim()} aria-label="Generate cart">
                                {loading ? (
                                    <div className="ai-spinner"></div>
                                ) : (
                                    <SendIcon />
                                )}
                            </button>
                        </div>
                    </form>

                    <AIPromptSuggestions onSuggestionClick={handleSuggestionClick} />
                </>
            )}

            {loading && (
                <div className="ai-loading">
                    <div className="ai-loading-animation">
                        <div className="ai-dot"></div>
                        <div className="ai-dot"></div>
                        <div className="ai-dot"></div>
                    </div>
                    <p>AI is building your perfect cart...</p>
                </div>
            )}

            {currentCart && !loading && (
                <AICartPreview
                    cart={currentCart}
                    onAddAll={handleAddAllToCart}
                    onAddSingle={handleAddSingleItem}
                    onSave={handleSaveCart}
                    onRegenerate={handleRegenerate}
                    onNewCart={handleNewCart}
                />
            )}
        </div>
        <Footer/>
        </>
    );
};

export default AIAssistant;
