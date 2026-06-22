import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateAICart } from '../features/ai/aiSlice';
import { addItemsToCart } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';
import '../AIStyles/AIChatbot.css';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your AI Shopping Assistant. Tell me what you need and I'll add items to your cart automatically.\n\nTry: \"I need snacks\", \"breakfast for 4\", \"party supplies for 10 guests\"" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.user);
    const { loading } = useSelector(state => state.ai);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        if (!isAuthenticated) {
            toast.error("Please login to use AI Assistant");
            return;
        }

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        try {
            const result = await dispatch(generateAICart(userMessage)).unwrap();
            const cart = result.aiCart;

            if (cart.items && cart.items.length > 0) {
                // Auto-add all items to cart
                for (const item of cart.items) {
                    if (item.product) {
                        await dispatch(addItemsToCart({ id: item.product, quantity: item.quantity }));
                    }
                }

                const itemsList = cart.items.map(i => `• ${i.name} × ${i.quantity} — ₹${i.price * i.quantity}`).join('\n');
                const responseMsg = `Done! I've added ${cart.items.length} items to your cart:\n\n${itemsList}\n\n💰 Total: ₹${cart.totalEstimatedPrice}\n\n${cart.reasoning}`;

                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: responseMsg,
                    cart: cart
                }]);

                toast.success(`${cart.items.length} items added to cart!`);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "Sorry, I couldn't find matching products for that request. Try something like \"snacks\", \"breakfast items\", or \"cleaning supplies\"."
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Oops! Something went wrong: ${error}. Please try again.`
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isAuthenticated) return null;

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button className="ai-chatbot-fab" onClick={() => setIsOpen(true)} aria-label="Open AI Assistant">
                    <AutoAwesomeIcon className="ai-fab-icon" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="ai-chatbot-window">
                    {/* Header */}
                    <div className="ai-chatbot-header">
                        <div className="ai-chatbot-header-left">
                            <SmartToyIcon />
                            <span>AI Shopping Assistant</span>
                        </div>
                        <button className="ai-chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close">
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="ai-chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`ai-chatbot-msg ai-chatbot-msg-${msg.role}`}>
                                {msg.role === 'assistant' && <SmartToyIcon className="ai-msg-avatar" />}
                                <div className="ai-msg-bubble">
                                    <pre className="ai-msg-text">{msg.content}</pre>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="ai-chatbot-msg ai-chatbot-msg-assistant">
                                <SmartToyIcon className="ai-msg-avatar" />
                                <div className="ai-msg-bubble">
                                    <div className="ai-typing-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="ai-chatbot-input-area">
                        <input
                            type="text"
                            placeholder="Tell me what you need..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isTyping}
                        />
                        <button onClick={handleSend} disabled={isTyping || !input.trim()} aria-label="Send">
                            <SendIcon />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatbot;
