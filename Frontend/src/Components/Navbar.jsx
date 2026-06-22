import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

import '../componentStyles/Navbar.css';
import '../pageStyles/Search.css';
import { useSelector } from 'react-redux';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const navigate = useNavigate(); // Corrected variable name
    const {isAuthenticated} = useSelector(state => state.user);
    const {cartItems} = useSelector(state => state.cart);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/products');
        }
        setSearchQuery('');
        setIsSearchOpen(false); // Close search bar after searching
    };

    return (
        <nav className='navbar'>
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>E_Commerce</Link>
                </div>

                <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    <ul>
                        <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link></li>
                        <li><Link to="/about-us" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
                        <li><Link to="/contact-us" onClick={() => setIsMenuOpen(false)}>Contact Us</Link></li>
                    </ul>
                </div>

                <div className="navbar-icons">
                    <div className="search-container">
                        <form className={`search-form ${isSearchOpen ? 'active' : ''}`} onSubmit={handleSearchSubmit}>
                            <input 
                                type="text" 
                                className='search-input' 
                                placeholder='Search Products..' 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {/* Toggle button: if open, it submits; if closed, it opens */}
                            <button type="button" className="search-icon" onClick={isSearchOpen ? handleSearchSubmit : toggleSearch}>
                                <SearchIcon />
                            </button>
                        </form>
                    </div>

                    <div className="cart-container">
                        <Link to="/cart"><ShoppingCartIcon className='icon' /></Link>
                        <span className="cart-badge">{cartItems.length}</span>
                    </div>

                    {!isAuthenticated && (
                        <Link to="/register" className='register-link'>
                            <PersonAddIcon className='icon' />
                        </Link>
                    )}

                    <div className="navbar-hamburger" onClick={toggleMenu}>
                        {isMenuOpen ? <CloseIcon className='icon' /> : <MenuIcon className='icon' />}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;