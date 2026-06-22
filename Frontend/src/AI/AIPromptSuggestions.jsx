import React from 'react';
import '../AIStyles/AIPromptSuggestions.css';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CakeIcon from '@mui/icons-material/Cake';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SchoolIcon from '@mui/icons-material/School';
import LocalDiningIcon from '@mui/icons-material/LocalDining';

const suggestions = [
    {
        text: "Prepare breakfast for 5 people",
        icon: <BreakfastDiningIcon />,
        color: "#FF9800"
    },
    {
        text: "Weekly groceries under ₹3000",
        icon: <ShoppingBasketIcon />,
        color: "#4CAF50"
    },
    {
        text: "High protein vegetarian diet",
        icon: <FitnessCenterIcon />,
        color: "#2196F3"
    },
    {
        text: "Party snacks for 20 guests",
        icon: <CakeIcon />,
        color: "#E91E63"
    },
    {
        text: "Baby essentials for one month",
        icon: <ChildCareIcon />,
        color: "#9C27B0"
    },
    {
        text: "Healthy lunch for office",
        icon: <RestaurantIcon />,
        color: "#00BCD4"
    },
    {
        text: "Hostel groceries under ₹1500",
        icon: <SchoolIcon />,
        color: "#FF5722"
    },
    {
        text: "Cooking ingredients for Paneer Butter Masala",
        icon: <LocalDiningIcon />,
        color: "#795548"
    }
];

const AIPromptSuggestions = ({ onSuggestionClick }) => {
    return (
        <div className="ai-suggestions"  style={{ marginTop: "100px" }}>
            <h3>Try these examples:</h3>
            <div className="ai-suggestions-grid">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        className="ai-suggestion-card"
                        onClick={() => onSuggestionClick(suggestion.text)}
                        style={{ '--accent-color': suggestion.color }}
                    >
                        <span className="ai-suggestion-icon">{suggestion.icon}</span>
                        <span className="ai-suggestion-text">{suggestion.text}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AIPromptSuggestions;
