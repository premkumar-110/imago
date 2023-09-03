import React, { useState, useEffect } from 'react';
import Header from '../header/header';
import axios from 'axios';
import '../cart/cart.css';
import { GrClose } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import EmptyCart from '../images/Emptycart.svg';
import Cookies from "js-cookie";

const Cart = () => {
  const [isLoading, setisLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cost, setCost] = useState(0);
  const navigate=useNavigate();
  useEffect(() => {
    const GetCookie = async () => {
      const user_id = Cookies.get("user_id");
      if (user_id) {
        try {
          const response = await axios.post('https://imago-backend.vercel.app/api/users/verifyToken', { token: user_id });
          console.log(response.data.verifiedUser.email); 
          
              const response1 = await axios.post('https://imago-backend.vercel.app/api/users/getProductById', { email: response.data.verifiedUser.email });
              setCartItems(response1.data);
      
              // Calculate total cost
              const totalCost = response1.data.reduce((acc, item) => acc + item.price, 0);
              setCost(totalCost);
           
          
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    
    GetCookie();
    setisLoading(false)
    
  }, []);

  const handleRemove = async (id) => {
    const removeCartItem = async () => {
      await axios.post('https://imago-backend.vercel.app/api/users/removefromCart', { email: "scpprem006@gmail.com", id: id });
    }
    await removeCartItem();

    // After removing the item, update cart items and total cost
    const response = await axios.post('https://imago-backend.vercel.app/api/users/getProductById', { email: "scpprem006@gmail.com" });
    console.log(response.data);
    setCartItems(response.data);

    const newTotalCost = response.data.reduce((acc, item) => acc + item.price, 0);
    setCost(newTotalCost);
  }
  const handleGetProduct = async (id) => {
    // Set the product ID in session storage
    
    sessionStorage.setItem('id', id);
    navigate(`/product/${id}`)
  }
  return (
    <>
      {isLoading ? (
        <div className='LoderComponent'>
          <div class="spinner-grow text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="spinner-grow text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="spinner-grow text-primary" role="status">
            <span class="visually-hidden">Loading...</span> 
          </div>
        </div>
      ) : (
    <>
      <Header />
      { cartItems.length>0 &&
        <div className='Container'>
          <div className='CartContainer'>
            <div>
            {cartItems.map((item) => (
              <div key={item.id} className='CartCard'>
                <img src={item.thumbnail} alt={item.title}  onClick={()=>{handleGetProduct(item.id)}}/>
                <div className='Contents'  onClick={()=>{handleGetProduct(item.id)}}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
                {/* <GrClose className='logo' /> */}
                <button onClick={() => handleRemove(item.id)}> Remove</button>
              </div>
            ))}
            </div>
            <div className='PriceContainer'>
              <h3>Price Details</h3>
              <p>Total Product Price: <b>{cost*80} Rs</b></p>
              <hr></hr>
              <button onClick={()=>{navigate('/home')}} className='ViewProduct'>Buy all Products</button>
            </div>
          </div>
        </div>
      }
      { cartItems.length==0 &&
        <div className='Container'>
          <div className='NoAvailabilityCartContainer'>
            <p>No Products is currently available in the cart</p>
            <button onClick={()=>{navigate('/home')}} className='ViewProduct'>View Products</button>
            <img src={EmptyCart}></img>
          </div>
        </div>
      }
    </>)
    }
  </>);
};

export default Cart;
