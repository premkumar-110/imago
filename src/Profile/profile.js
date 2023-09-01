import React, { useEffect, useState } from 'react';
import '../Profile/profile.css';
import logo from '../logo.svg';
import { useNavigate } from 'react-router-dom';
import { IoPersonSharp } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdLanguage } from "react-icons/md";
import axios from 'axios';

const Profile = ({userEmail}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [visibility, setVisibility] = useState(true);

    useEffect(() => {
        console.log(userEmail)
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

    return (
        <>
            <div className='ProfileContainer'>
                <header>
                    <div className='logo' onClick={handleClick}>
                        <img src={logo} alt="Logo"></img>IMAGO
                    </div>
                    <div className='ProfileNav'>
                        <div className='Logout' onClick={() => { navigate('/home') }}>Home</div>
                        <div className='Logout' onClick={() => { navigate('/cart') }}>View Cart</div>
                        <div className='Logout' onClick={() => { navigate('/login') }}>Sign out</div>
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
                                    <section className='nameData'>Username : {user.displayName}</section>
                                    <section className='nameData'>Email : {userDetails[0]?.email || 'Loading...'}</section>
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
                                                <p>{userDetails[0]?.name || 'Loading...'}</p>
                                            </div>
                                            <div className='Card'>
                                                <h5>Address <MdLocationOn /></h5>
                                                <p>{userDetails[0]?.address || 'Loading...'}</p>
                                            </div>
                                            <div className='Card'>
                                                <h5>Email <MdEmail /></h5>
                                                <p>{userDetails[0]?.email || 'Loading...'}</p>
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
