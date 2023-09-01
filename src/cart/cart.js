import React, { useState, useEffect } from 'react';
import Header from '../header/header';
import axios from 'axios';
import '../cart/cart.css';
import { GrClose } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import EmptyCart from '../images/Emptycart.svg'
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cost, setCost] = useState(0);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://imago-backend.vercel.app/api/users/getProductById', { email: "scpprem006@gmail.com" });
        setCartItems(response.data);

        // Calculate total cost
        const totalCost = response.data.reduce((acc, item) => acc + item.price, 0);
        setCost(totalCost);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchData();
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
                <button onClick={() => handleRemove(item.id)}>Remove</button>
              </div>
            ))}
            </div>
            <div className='PriceContainer'>
              <h3>Price Details</h3>
              <p>Total Product Price: <b>{cost*80} Rs</b></p>
              <hr></hr>
              <button  className='ViewProduct'>Buy Now</button>
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
    </>
  );
};

export default Cart;
