import React from 'react';
import '../signup/signup.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../login/login.css';
import logo from '../logo.svg';
import { IoMail } from "react-icons/io5";
import { MdPassword } from "react-icons/md";
import discord from '../images/Discord.svg';
import google from '../images/Google.svg';
import github from '../images/Github.svg';
import facebook from '../images/Facebook.svg';
import { BsEyeSlashFill, BsEyeFill } from 'react-icons/bs';
import ToasterUi from 'toaster-ui';
import axios from 'axios';
import { AiOutlineMenu } from "react-icons/ai";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import { auth, provider,FaceBookAuth } from '../config';
import { signInWithPopup } from 'firebase/auth';
import Cookies from "js-cookie";

const Signup = () => {
  const navigate = useNavigate();
  const toaster = new ToasterUi();
  const [onLoginSpinner, setonLoginSpinner] = useState(false);
  const [passState, setPassState] = useState(0);
  const [confpassState,setconfPassState]=useState(0);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [isValid, setIsValid] = useState(true);
  const [user, setUser] = useState(null);

  const validateEmail = (inputEmail) => {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };
  const handleBlur = () => {
    setIsValid(validateEmail(email));
  };

  const handleGoogleLogin = ()=>{
    signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      setUser(user);
      console.log(user)
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}api/users/googleLogin`,{email:user.email,password:'123abc@123'});
      if(response.status==200){
        const token = response.data.token; // Update this field name based on the actual response
        Cookies.set("user_id", token);
        navigate('/login')
      }
    })
    .catch((error) => {
      alert(error);
    });
  }
  const handleFacebookLogin =async ()=>{
    try{
    const result = await FaceBookAuth();
    
      setUser(result.user);
      console.log(user.email)
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}api/users/googleLogin`,{email:user.email,password:'123abc@123'});
      if(response.status==200){
        const token = response.data.token; // Update this field name based on the actual response
        Cookies.set("user_id", token);
        navigate('/login')
      }
    }
    catch(e){
      console.log(e)   
    }
    
  }
  const handleSignup=async ()=>{
    setonLoginSpinner(true)
    try{
        if(!email||!password){
            toaster.addToast('Email and Password is required', 'success', {
                duration: 4000,
                styles: {
                  backgroundColor: 'red', 
                  color: '#ffffff',
                },
              });   
              
        }
        else{
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}api/users/signup`, {
            email:email,
            password:password,
            });
            if(response.data.status=="exists"){
              toaster.addToast('User already exists', 'success', {
                duration: 4000,
                styles: {
                  backgroundColor: 'red',
                  color: '#ffffff',
                },
              });
            }
            else if(response.status===200){
                toaster.addToast('Account created Successfully', 'success', {
                    duration: 4000, 
                    styles: {
                      backgroundColor: 'green',
                      color: '#ffffff',
                    },
                  });
                  navigate('/login');
            }
            else{
              toaster.addToast('Sign up failed', 'success', {
                duration: 4000,
                styles: {
                  backgroundColor: 'red',
                  color: '#ffffff',
                },
              });
            }
        }
    }catch(e){

    }
    finally{
     setonLoginSpinner(false);
    }
  }

  return (
    <div className='LoginComponent'>
        <div className='DescriptionSection'>
        <header>
            <img src={logo} alt='Logo' />
            <div className='product'>IMAGO</div>
            <AiOutlineMenu className='Menu' onClick={()=>{
                document.getElementById('LoginSection').style.zIndex=100;
            }}/>
        </header>
        <div className='Description'>
          <p>
            <div className='quote'>Enter the Enchanting Realm of<br/> Fluttering Dreams</div>
            Start Exploring more <HiOutlineChevronDoubleRight/>
          </p>
        </div>
        </div>
        <div className='LoginSection'>

            <div className='Container'>
                <p>Hello ! Welcome to Imago</p>
            </div>

            <div className='LoginDetails'>
                <div className='email'>
                    <p>Email</p>
                    <div className='EmailContainer'style={{ borderColor: isValid ? "green" : "red" }} >
                        <IoMail className='EmailLogo'/>
                        <input onBlur={handleBlur} type='email' placeholder='Enter your email address' onChange={(e)=>setEmail(e.target.value)}></input>
                    </div>
                    {!isValid && <p style={{ color: "red" }}>Please enter a valid email address.</p>}
                </div>
                <div className='email'> 
                    <p>Password</p>
                    <div className='EmailContainer'>
                        <MdPassword className='EmailLogo'/>
                        <input   type={confpassState === 0 ? 'password' : 'text'} placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)}></input>
                        {confpassState === 0 ? <BsEyeSlashFill className='EmailLogo' onClick={() => setconfPassState(1)} /> : <BsEyeFill className='EmailLogo' onClick={() => setconfPassState(0)} />}
                    </div>
                    

                </div>
                <div className='email'>
                    <p>Confirm Password</p>
                    <div className='EmailContainer'>
                        <MdPassword className='EmailLogo'/>
                        <input  type={passState === 0 ? 'password' : 'text'} placeholder='Confirm your password' onChange={(e)=>setConfirmPassword(e.target.value)}></input>
                        {passState === 0 ? <BsEyeSlashFill className='EmailLogo' onClick={() => setPassState(1)} /> : <BsEyeFill className='EmailLogo' onClick={() => setPassState(0)} />}
                    </div>
                </div>
                <div className='MismatchPassword'>
                   {confirmPassword!==password && confirmPassword.length>0 && <p>Passwords does not match!</p>} 
                </div>
                <div className='LoginButton'>
                <button onClick={handleSignup}>
                    {!onLoginSpinner && <>Create Account</>}
                    {onLoginSpinner && (
                      <div class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </button>
                </div>
                <div className='LoginSignup'>
                <p>Already visited our site? <button onClick={() => navigate('/login')}>Sign In</button></p>
            </div>
            </div>
            <div className='OrContainer'>
                <span></span><p>Or</p><span></span>
            </div> 
             <div className="SocialMediaLogin">
                <button onClick={handleGoogleLogin}>
                  <span>Sign up with Google</span> <img src={google}  alt="Google" />
                </button>
                <button onClick={handleFacebookLogin}>
                  <span>Sign up with Facebook</span> <img src={facebook} alt="Google" />
                </button>
                {/*<button>
                  <img src={github} onClick={handleGithubLogin} alt="GitHub" />
                </button>
                <button>
                  <img
                    src={discord}
                    onClick={handleDiscordLogin}
                    alt="Discord"
                  />
                </button> */}
              </div> 
        </div>
    </div>
  )
}

export default Signup;