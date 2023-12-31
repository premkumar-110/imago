import React, { useState, useEffect, useCallback } from 'react';
import '../dashboard/home.css';
import logo from '../logo.svg';
import { AiOutlineSearch } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { ImCart } from "react-icons/im";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../header/header.css';
import Cookies from "js-cookie";
import { IoMdHome } from "react-icons/io";
import { GoPersonFill } from "react-icons/go";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim"; 
import { InfoCircleOutlined,CloseOutlined } from '@ant-design/icons';

const Header = ({ productID, setproductID }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const navigate = useNavigate();
  const [searchitem, setSearchItem] = useState('');
  const [filtereditems, setFilterItems] = useState([]);
  const [productsList, setProduct] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const particlesInit = useCallback(async (engine) => {   
    console.log(engine);
    // Load the tsParticles instance (engine) using tsparticles-slim
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  useEffect(() => {
    const products = async () => {
      const productData = await axios.get(`${process.env.REACT_APP_SERVER_URL}api/users/getProducts`);
      setProduct(productData.data.response);
    };
    products();
  }, []);

  useEffect(() => {
    const GetCookie = async () => {
      const user_id = Cookies.get("user_id");
      if (user_id) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}api/users/verifyToken`, { token: user_id });
          setUserDetails(response.data.verifiedUser)
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    GetCookie(); 
  }, []);

  useEffect(() => {
    const response = productsList?.filter((item) => {
      return item.title.toLowerCase().includes(searchitem.toLowerCase());
    });
    setFilterItems(response?.splice(0, 10) || []);
  }, [searchitem, productsList]);

  const handleLogout = () => {
    Cookies.remove("user_id");
    navigate('/login')
  };

  const handleGetProduct = async (id) => {
    setSearchItem('');
    navigate(`/product/${id}`);
    window.location.reload();
  };

  return (
    <div className='NavSection'>
      <div className="navbar">
        <div className='logo' onClick={() => navigate('/home')}>
          <img src={logo} alt="logo"></img>
          IMAGO
        </div>
        <div className='search'>
          <AiOutlineSearch className='searchLogo' />
          <input type='text' placeholder='Search your products' onChange={(e) => setSearchItem(e.target.value)} value={searchitem}></input>
          {searchitem.length !== 0 && <CloseOutlined className='searchLogo' onClick={()=>{setSearchItem('')}}/>}
        </div>
        {userDetails.email && <div
          className='ProfileDetails'
          onMouseEnter={() => setShowDropDown(true)}
          onMouseLeave={() => setShowDropDown(false)}
        >
          <GoPersonFill />
          Profile
        </div> }
        {!userDetails.email && <div
          className='ProfileLogin'
          onClick={()=>{navigate('/login')}}
        >
          Login / Sign in
        </div> }
        {showDropDown && (
          <div className='ProfileDropDown' onMouseEnter={() => setShowDropDown(true)}
          onMouseLeave={() => setShowDropDown(false)}>
            <ul>
              {/* <li className='HomeNav' onClick={() => navigate('/home')}>
                <IoMdHome className='DropDownHomeLogo' /> Go Home
              </li> */}
              <li onClick={() => navigate('/profile')}>
                <FaUserCircle className='DropDownLogo' /> View Profile
              </li>
              <li onClick={() => navigate('/cart')}>
                <ImCart className='DropDownLogo' /> View Cart
              </li>
              <li onClick={handleLogout}>
                <BiLogOut className='DropDownLogo' /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
      {searchitem.length !== 0 && (
        <div className='SearchFilter'>
          {filtereditems.length === 0 && (
            <div className='SearchNotFound'>
              <InfoCircleOutlined /> Sorry, No result found for {searchitem}
            </div>
          )}
          {filtereditems.map((item) => (
            <div className='SerachItem' key={item.id} onClick={() => handleGetProduct(item.id)}>
              {item.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Header;
