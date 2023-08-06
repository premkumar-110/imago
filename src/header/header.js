import React, { useState, useEffect } from 'react';
import '../dashboard/home.css';
import logo from '../logo.svg';
import { AiOutlineSearch } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { ImCart } from "react-icons/im";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../header/header.css';

const Header = ({ productID, setproductID }) => {
  const [user, setUser] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const navigate = useNavigate();
  const [searchitem, setSearchItem] = useState('');
  const [filtereditems, setFilterItems] = useState([]);
  const [productsList, setProduct] = useState([]);

<<<<<<< HEAD
    const products = async () => {
      const productData = await axios.get('http://localhost:5000/api/users/getProducts');
      setProduct(productData.data.response);
      
=======
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get('https://server-imago.vercel.app/api/users/getProducts');
        setProduct(response.data.response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
>>>>>>> 982dbf732a8f62a31a48e632cce505651acc8892
    };
    getProducts();
  }, []);

  useEffect(() => {
    const getUser = async () => {
<<<<<<< HEAD
      await fetch("http://localhost:5000/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("Authentication has failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
=======
      try {
        const response = await axios.get("https://server-imago.vercel.app/auth/login/success", {
          withCredentials: true, // Use "withCredentials" to include cookies in the request
>>>>>>> 982dbf732a8f62a31a48e632cce505651acc8892
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    getUser();
  }, []);
  
  

  useEffect(() => {
    const response = productsList?.filter((item) => {
      return item.title.toLowerCase().includes(searchitem.toLowerCase());
    });
    setFilterItems(response || []);
  }, [searchitem, productsList]);

  const handleLogout = () => {
    window.location.href = "http://localhost:3000/login";
  };

  const handleGetProduct = (id) => {
    setSearchItem('');
    sessionStorage.setItem('id', id);
    setproductID(id);
    console.log(id);
    navigate('/product');
  };

  return (
    <>
    <div className='NavSection'>
      <div className="navbar">
        <div className='logo' onClick={() => navigate('/home')}><img src={logo} alt="logo"></img>IMAGO</div>
        <div className='search'>
          <input type='text' placeholder='Search your products' onChange={(e) => { setSearchItem(e.target.value) }} value={searchitem}></input><AiOutlineSearch className='searchLogo' />
        </div>
        {user && (
<<<<<<< HEAD
          <div className='ProfileDetails' onClick={() => {
            setShowDropDown(!showDropDown);
          }}>
            <section className='nameData'>{user.displayName || "Welcome"}</section>
            <img
              src={user.photos[0]?.value || ''}
              alt="userLogo" 
              className="avatar"
            />
=======
          <div className='ProfileDetails' onClick={() => setShowDropDown(!showDropDown)}>
            <section className='nameData'>{user.displayName || "Welcome"}</section>
            <img src={user.photos[0]?.value || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsEC-AcpMSEBeqwQdUVhjb5fciR-GG2-cuwQ&usqp=CAU'} alt="userLogo" className="avatar" />
>>>>>>> 982dbf732a8f62a31a48e632cce505651acc8892
          </div>
        )}
      </div>
      {showDropDown && <div className='ProfileDropDown'>
        <ul>
          <li onClick={() => { navigate('/profile') }}><FaUserCircle className='DropDownLogo' />View Profile</li>
          <li onClick={() => { navigate('/cart') }}><ImCart className='DropDownLogo' />View Cart</li>
          <li onClick={handleLogout}><BiLogOut className='DropDownLogo' />Logout</li>
        </ul>
      </div>}
      {searchitem.length !== 0 && <>
        <div className='SearchFilter'>
          {
            filtereditems.map((item) => {
              return (
                <div className='SerachItem' key={item.id} onClick={() => { handleGetProduct(item.id) }}>
                  {item.title}
                </div>
              )
            })
          }
<<<<<<< HEAD
          </div>
        </>
      }
      </div>
=======
        </div>
      </>}
>>>>>>> 982dbf732a8f62a31a48e632cce505651acc8892
    </>
  )
}

export default Header;
