import React, { useEffect, useState } from 'react';
import '../Profile/profile.css';
import logo from '../logo.svg';
import { useNavigate } from 'react-router-dom';
import { IoPersonSharp } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { MdLocationOn,MdEmail,MdLanguage } from "react-icons/md";

// ... (imports remain the same)

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
          await fetch("https://server-imago.vercel.app/auth/login/success", {
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

    const handleClick = () => {
        navigate('/home');
    }

    return (
        <>
            <div className='ProfileContainer'>
                <header>
                    <div className='logo' onClick={handleClick}>
                        <img src={logo} alt="Logo"></img>IMAGO
                    </div>
                    <div className='ProfileNav'>
                    <div className='Logout' onClick={()=>{navigate('/home')}}>Home</div>
                    <div className='Logout' onClick={()=>{navigate('/cart')}}>View Cart</div>
                    <div className='Logout' onClick={()=>{navigate('/login')}}>Sign out</div>
                    </div>
                </header>
                <div className='AccountDetails'>
                    {user ? ( // Check if user is not null
                    <>
                        <div className='AccInfoSection'>
                            <div className='prfiledata'>
                            <img
                                src={user.photos[0]?.value || ''}
                                alt="userLogo"
                                className="avatar"
                            />
                            <section className='nameData'>Username : {user.displayName}</section>
                            <section className='nameData'>Email : scpprem006@gmail.com</section>
                            </div>
                            <div className='profileRouteSection'>
                                <button>
                                <IoPersonSharp/> Profile Information
                                </button> 
                                <button>
                                   <FaHistory/> Order History
                                </button>
                            </div>
                        </div>
                        <div className='IndividualData'>
                            <div className='PersonalInfo'>
                                <h3>Personal Information</h3>
                                <div className='PersonalCard'>
                                    <div className='Card'> 
                                        <h5>Name <IoPersonSharp/></h5>
                                        <p>{user.displayName}</p>
                                    </div>
                                    <div className='Card'> 
                                        <h5>Address <MdLocationOn/></h5>
                                        <p>Tamil Nadu, India</p>
                                    </div>
                                    <div className='Card'> 
                                        <h5>Email <MdEmail/></h5>
                                        <p>scpprem006@gmail.com</p>
                                    </div>
                                    <div className='Card'> 
                                        <h5>Language <MdLanguage/></h5>
                                        <p>English (UK) - English</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    ) : (
                        <div>Loading user data...</div> // Show a loading message while fetching
                    )}
                </div>
            </div>
        </>
    );
}

export default Profile;
