import React, { useState } from 'react';
import '../CartStyles/Shipping.css'

import PageTitle from '../Components/PageTitle'
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import CheckoutPath from './CheckoutPath';
import {Country , State , City } from 'country-state-city'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingInfo } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
function PlaceShipping() {
    const dispatch = useDispatch();
    const {shippingInfo} = useSelector(state => state.cart);
    const [address, setAddress] = useState(shippingInfo.address || '');
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode||'');
    const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber||'');
    const [country, setCountry] = useState(shippingInfo.Country||'');
    const [state, setState] = useState(shippingInfo.state||'');
    const [city, setCity] = useState(shippingInfo.city||'');
    const navigate = useNavigate();
    const shippingInfoSubmit = (e) => {
        e.preventDefault();
        if(phoneNumber.length < 10 || phoneNumber.length > 10){
            toast.error("Phone number should be 10 digits long",
            {position: "top-center",
            autoClose: 3000,
            theme: "dark",}
            );
            return;
        }
        dispatch(saveShippingInfo({address,pinCode,phoneNumber,country,state,city}));
        navigate('/order/confirm');
    }
  return (
    <>
    <Navbar/>
    <CheckoutPath activePath={0}/>
    <PageTitle title="Shipping Details"/>

    <div className="shipping-form-container">
        <h1 className="shipping-form-header">
            Shipping Details
        </h1>
        <form action="" className="shipping-form" onSubmit={shippingInfoSubmit}>
            <div className="shipping-section">
            <div className="shipping-form-group">
            <label htmlFor='address'>Address</label>
            <input type="text" name="address" id="address" placeholder='Enter your address' value={address} onChange={(e)=>setAddress(e.target.value)} required/>
            </div>
            <div className="shipping-form-group">
            <label htmlFor='pinCode'>Pin code</label>
            <input type="number" name="pinCode" id="pinCode" placeholder='Enter your PinCode' value={pinCode} onChange={(e)=>setPinCode(e.target.value)}  required/>
            </div>
           
            <div className="shipping-form-group">
            <label htmlFor='phoneNumber'>Phone Number</label>
            <input type="telephone" name="phoneNumber" id="phoneNumber" placeholder='Enter your phone number' value={phoneNumber}  onChange={(e)=>setPhoneNumber(e.target.value)} required/>
            </div>
            </div>



            <div className="shipping-section">
                <div className="shipping-form-group">
                    <label htmlFor="country">Country</label>
                    <select name="country" id="country" value={country} onChange={(e)=>{setCountry(e.target.value),setCity("") , setState("")}}>
                        <option value="">Select a country</option>
                        {Country && Country.getAllCountries().map((item)=>(<option value={item.isoCode} key={item.isoCode}>{item.name}
                        </option>))}
                    </select>
                </div>
                {country && (<div className="shipping-form-group">
                    <label htmlFor="state">State</label>
                    <select name="state" id="state" value={state} onChange={(e)=>{setState(e.target.value),setCity("")}}>
                        <option value="">Select a state</option>
                        {State && State.getStatesOfCountry(country).map((item)=>(<option value={item.isoCode} key={item.isoCode}>{item.name}
                        </option>))}
                    </select>
                </div>)}
               {state && ( <div className="shipping-form-group">
                    <label htmlFor="city">City</label>
                    <select name="city" id="city" value={city} onChange={(e)=>setCity(e.target.value)}>
                        <option value="">Select a city</option>
                          {City && City.getCitiesOfState(country, state).map((item) => (
                           <option value={item.name} key={item.name}>
                            {item.name}
                         </option>))}
                    </select>
                </div>)}
            </div>
            <button className='shipping-submit-btn'>Continue</button>
        </form>
    </div>

    <Footer/>
    </>
  )
}

export default PlaceShipping