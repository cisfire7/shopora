import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAIHistory, deleteAICartAction, removeError, removeSuccess } from '../features/ai/aiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../AIStyles/AIHistory.css';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PageTitle from '../Components/PageTitle';

const AIHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { history, loading, error, success, message } = useSelector(state => state.ai);

    useEffect(() => {
        dispatch(getAIHistory());
    }, [dispatch]);

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

    const handleDelete = (cartId) => {
        dispatch(deleteAICartAction(cartId));
    };

    return (
        <>
        <Navbar/>
        <PageTitle title="AI Cart History"/>
        <div className="ai-history-container">
            <div className="ai-history-header">
                <button className="ai-back-btn" onClick={() => navigate('/ai/assistant')}>
                    <ArrowBackIcon /> Back to Assistant
                </button>
                <h1><AutoAwesomeIcon /> AI Cart History</h1>
            </div>

            {loading && <div className="ai-history-loading">Loading...</div>}

            {!loading && history.length === 0 && (
                <div className="ai-history-empty">
                    <AutoAwesomeIcon className="ai-empty-icon" />
                    <p>No AI carts generated yet. Start by asking the AI assistant!</p>
                    <button onClick={() => navigate('/ai/assistant')}>Go to AI Assistant</button>
                </div>
            )}

            <div className="ai-history-list">
                {history.map((cart) => (
                    <div key={cart._id} className="ai-history-card">
                        <div className="ai-history-card-header">
                            <h3>"{cart.prompt}"</h3>
                            <span className={`ai-status ai-status-${cart.status}`}>{cart.status}</span>
                        </div>
                        <div className="ai-history-card-body">
                            <p>{cart.reasoning}</p>
                            <div className="ai-history-meta">
                                <span>{cart.items.length} items</span>
                                <span>₹{cart.totalEstimatedPrice}</span>
                                <span>Confidence: {cart.confidenceScore}%</span>
                                <span>{new Date(cart.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="ai-history-tags">
                                {cart.tags?.map((tag, i) => (
                                    <span key={i} className="ai-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="ai-history-card-actions">
                            <button
                                className="ai-delete-btn"
                                onClick={() => handleDelete(cart._id)}
                                aria-label="Delete cart"
                            >
                                <DeleteIcon /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default AIHistory;
