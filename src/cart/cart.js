import React, { useState, useEffect } from 'react';
import Header from '../header/header';
import axios from 'axios';
import '../cart/cart.css';
import { GrClose } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import EmptyCart from '../images/Emptycart.svg';
import Cookies from "js-cookie";
import { SmileOutlined} from '@ant-design/icons';


const Cart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [error, setError] = useState(null);
  useEffect(() => {

    const fetchCartData = async () => {
      const user_id = Cookies.get("user_id");
      if (user_id) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}api/users/verifyToken`, { token: user_id });
          setUserDetails(response.data.verifiedUser);
          const response1 = await axios.post(`${process.env.REACT_APP_SERVER_URL}api/users/getProductById`, { email: userDetails.email });
          
          setCartItems(response1.data);
          
          // Calculate total cost
          const totalCost = response1.data.reduce((acc, item) => acc + item.price, 0);
          setTotalCost(totalCost);

          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching user details:', error);
          setError('An error occurred while fetching data');
          setIsLoading(false);
        }
      }
    };

    fetchCartData();
  }, [userDetails.email]);

  const handleRemove = async (id) => {
    const removeCartItem = async () => {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}api/users/removefromCart`, { email: userDetails.email, id: id });
    }
    await removeCartItem();

    // After removing the item, update cart items and total cost
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}api/users/getProductById`, { email: userDetails.email });
    console.log(response.data);
    setCartItems(response.data);

    const newTotalCost = response.data.reduce((acc, item) => acc + item.price, 0);
    setTotalCost(newTotalCost);
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
                <div className='Contents'  >
                  <h4 onClick={()=>{handleGetProduct(item.id)}}>{item.title}</h4>
                  <p onClick={()=>{handleGetProduct(item.id)}}>{item.description}</p>
                  <p>Stocks available : <b>{item.stock}</b></p>
                  
                </div>
                {/* <GrClose className='logo' /> */}
                <button onClick={() => handleRemove(item.id)}> Remove</button>
              </div>
            ))}
            </div>
            {/* <div className='PriceContainer'>
              <h3>Price Details</h3>
              <p>Total Product Price: <b>{cost*80} Rs</b></p>
              <hr></hr>
              <button onClick={()=>{navigate('/home')}} className='ViewProduct'>Buy all Products</button>
            </div> */}
          </div>
        </div>
      }
      { cartItems.length==0 &&
        <div className='Container'>
          <div className='NoAvailabilityCartContainer'>
            <p>No Products is currently available in the cart</p>
            <button onClick={()=>{navigate('/home')}} className='ViewProduct'><SmileOutlined />Explore Now</button>
            <img src={EmptyCart}></img>
          </div>
        </div>
      }
    </>)
    }
  </>);
};

export default Cart;
