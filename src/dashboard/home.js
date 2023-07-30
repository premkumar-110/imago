import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../dashboard/home.css';
import logo from '../logo.svg';
import { AiOutlineSearch } from "react-icons/ai";




const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      fetch("https://server-imago.vercel.app/auth/login/success", {
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
        });
    };
    getUser();
  }, []);

  const handleLogout=async ()=>{
    window.location.href = "http://localhost:3000/login";
    
  }
  return (
    <>
    <div className="navbar">
      <div className='logo'><img src={logo}></img>IMAGO</div>
      <div className='search'>
        <input type='text' placeholder='Search your products'></input><AiOutlineSearch className='searchLogo'/>
      </div>
      
      {user && ( // <-- Add a conditional check here
          <div className='ProfileDetails'>
            <section className='nameData'>{user.displayName}</section>
            <img
              src={user.photos[0]?.value || ''}
              alt=""
              className="avatar"
            />
          </div>
        )}
      
    </div>
    
    </>
  );
  
}

export default Home