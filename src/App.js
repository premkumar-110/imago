import './App.css';
import { Route, Routes } from "react-router-dom";
import Login from './login/login';
import Signup from './signup/signup';
import Home from './dashboard/home';
import Product from './product/product'
import Profile from './Profile/profile'
import { useState, useEffect } from 'react';
import VerifyNumber from './verify-number/verifyNumber';
import axios from 'axios';
import Header from './header/header';
import Filter from './filter/Filter';
import Cart from './cart/cart'
function App() {
  const [productsList, setProduct] = useState([]);
  const [userEmail,setUserEmail]=useState('');
  useEffect(() => {

    const products = async () => {
      const productData = await axios.get('https://imago-backend.vercel.app/api/users/getProducts');
      
      setProduct(productData.data.response);
      setUserEmail(sessionStorage.getItem('email'))
    };
    products();
  }, []);
  const [productID,setproductID]=useState(); 
  return (
    <>
    <Routes>
      <Route path='/login' element={<Login setUserEmail={setUserEmail} />}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/home' element={<Home productID={productID} setproductID={setproductID} productsList={productsList} setProduct={setProduct}/>}/>
      <Route path='/product/:id' element={<Product productID={productID} setproductID={setproductID} productsList={productsList} setProduct={setProduct}/>}/>
      <Route path='/verify_details' element={<VerifyNumber userEmail={userEmail}/>}/>
      <Route path='/profile' element={<Profile userEmail={userEmail}/>}/>
      <Route path='/header' element={<Header productID={productID} setproductID={setproductID}/>}/>
      <Route path='/filter' element={<Filter productsList={productsList} setProduct={setProduct}/>}/>
      <Route path='/cart' element={<Cart/> }/>
    </Routes>
    </>
  );
}

export default App;
 