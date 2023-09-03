import React, { useEffect, useState } from 'react';
import '../Profile/profile.css';
import logo from '../logo.svg';
import { useNavigate } from 'react-router-dom';
import { IoPersonSharp } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdLanguage } from "react-icons/md";
import axios from 'axios';
import Cookies from "js-cookie";

const Profile = ({userEmail}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [visibility, setVisibility] = useState(true);
    const [validuserDetails,setVaildUserDetails] = useState({})
    useEffect(() => {
        const GetCookie = async () => {
            const user_id = Cookies.get("user_id");
            if (user_id) {
              try {
                const response = await axios.post('https://imago-backend.vercel.app/api/users/verifyToken', { token: user_id });
                // console.log(response.data.verifiedUser); // Access the response data using response.data
                setVaildUserDetails(response.data.verifiedUser)
                
              } catch (error) {
                console.error('Error:', error);
              }
            }
          };
          
          GetCookie();

        const getUser = async () => {
            await fetch("https://imago-backend.vercel.app/auth/login/success", {
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

        const getDetails = async () => {

            try {
                console.log("Email" + {userEmail})
                const response = await axios.post('https://imago-backend.vercel.app/api/users/getDetails', { email: userEmail });
                
                console.log(response.data.response); // Add this line
                setUserDetails(response.data.response);
                
            } catch (error) {
                console.error(error);
            }
        };
        
        getDetails();
    }, []);

    const handleClick = () => {
        
        navigate('/home');
    }
    const handleLogout = () => {
        document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "http://localhost:3000/login";
      };

    return (
        <>
            <div className='ProfileContainer'>
                <header>
                    <div className='logo' style={{color:"white",fontWeight:"normal"}} onClick={handleClick}>
                        <img src={logo} alt="Logo"></img>IMAGO
                    </div>
                    <div className='ProfileNav'>
                        <div className='Logout' onClick={() => { navigate('/home') }}>Home</div>
                        <div className='Logout' onClick={() => { navigate('/cart') }}>View Cart</div>
                        <div className='Logout' onClick={handleLogout}>Sign out</div>
                    </div>
                </header>

                <div className='AccountDetails'>
                    {user ? (
                        <>
                            <div className='AccInfoSection'>
                                <div className='prfiledata'>
                                    <img
                                        src={user.photos[0]?.value || ''}
                                        alt="userLogo"
                                        className="avatar"
                                    />
                                    <section className='nameData'>USERNAME : {validuserDetails.name}</section>
                                    <section className='nameData'>EMAIL : {validuserDetails.email}</section>
                                </div>
                                <div className='profileRouteSection'>
                                    <button onClick={()=>{setVisibility(true)}}>
                                        <IoPersonSharp /> Profile Information
                                    </button>
                                    <button onClick={()=>{setVisibility(false)}}>
                                        <FaHistory /> Order History
                                    </button>
                                </div>
                            </div>
                            {visibility && (
                                <div className='IndividualData'>
                                    <div className='PersonalInfo'>
                                        <h3>Personal Information</h3>
                                        <div className='PersonalCard'>
                                            <div className='Card'>
                                                <h5>Name <IoPersonSharp /></h5>
                                                <p>{validuserDetails.name}</p>
                                            </div>
                                            <div className='Card'>
                                                <h5>Address <MdLocationOn /></h5>
                                                <p>{validuserDetails.address}</p>
                                            </div>
                                            <div className='Card'>
                                                <h5>Email <MdEmail /></h5>
                                                <p>{validuserDetails.email}</p>
                                            </div>
                                            <div className='Card'>
                                                <h5>Language <MdLanguage /></h5>
                                                <p>English (UK) - English</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            { !visibility &&
                            <div className='OrderHistory'> 
                                <b>YOU HAVE NOT YET PRUCHSED ANYTHING</b>
                            </div>

                            }
                        </>
                    ) : (
                        <div>Loading user data...</div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Profile;
