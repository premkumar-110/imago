import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login/login.css';
import logo from '../logo.svg';
import { IoMail } from 'react-icons/io5';
import { MdPassword } from 'react-icons/md';
import discord from '../images/Discord.svg';
import google from '../images/Google.svg';
import github from '../images/Github.svg';
import facebook from '../images/Facebook.svg';
import axios from 'axios';
import ToasterUi from 'toaster-ui';
import { BsEyeSlashFill, BsEyeFill } from 'react-icons/bs';
import { RxCross1 } from "react-icons/rx";
import { BsArrowRight } from "react-icons/bs";
import otpLogo from '../images/otp.svg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AiOutlineMenu } from "react-icons/ai";
import cookie from 'cookie';

const Login = () => {

  const toaster = new ToasterUi();
  const navigate = useNavigate();

  useEffect(() => { 
    AOS.init();
    const userId = getUserIdCookie();
    if (userId) {
      navigate('/home');
    }
    setisLoading(false)
  }, [])
  const getUserIdCookie = () => {
    const cookies = cookie.parse(document.cookie);
    return cookies.user_id || null; 
  };

  const [isValid, setIsValid] = useState(true);
  const validateEmail = (inputEmail) => {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };
  const handleBlur = () => {
    setIsValid(validateEmail(email));
  };


  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passState, setPassState] = useState(0);
  const [resetPass,setResetPass]=useState(0);
  const [verifyPass,setVerifyPass]=useState(0);
  const [forgetEmail,setforgetEmail]=useState('');
  const [otp,setotp]=useState('');
  const [getOTP,setgetOTP]=useState('');
  const [resetPassword,setResetPassword]=useState('');
  const [confirmResetPassword,setConfirmResetPassword]=useState('');
  const [onLoginSpinner,setonLoginSpinner]=useState(false);
  const [isLoading,setisLoading]=useState(true);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toaster.addToast('Email and Password are required', 'failure', {
          duration: 4000,
          styles: {
            backgroundColor: '#FF3131',
            color: '#ffffff',
          },
        });
        return;
      }
      setonLoginSpinner(true);
      const data={email:email,password:password}
      const response = await axios.post('http://localhost:5000/api/users/login', data);
      console.log(response)
      if (response.status == 200) {
        setonLoginSpinner(false);
        toaster.addToast('Successfully Logged In', 'success', {
          duration: 3000,
          styles: {
            backgroundColor: 'green',
            color: '#ffffff',
          },
        });
        navigate('/home');
      } else {
        setonLoginSpinner(false);
        toaster.addToast('Invalid email or password', 'warning', {
          duration: 4000,
          styles: {
            backgroundColor: 'orange',
            color: '#ffffff',
          },
        });
      }
    } catch (error) {
        setonLoginSpinner(false);
        console.log(error);
        toaster.addToast('An error occurred, please try again later', 'failure', {
          duration: 4000,
          styles: {
            backgroundColor: '#red',
            color: '#ffffff',
          },
        });
    }
  };
  
  const handleGoogleLogin=async ()=>{
    window.open(`http://localhost:5000/auth/google`, "_self");
  }
  const handleFacebookLogin=async ()=>{
    window.open(`http://localhost:5000/auth/facebook`, "_self");
  }
  const handleGithubLogin=async ()=>{
    window.open(`http://localhost:5000/auth/github`, "_self");
  }
  const handleDiscordLogin=async ()=>{
    window.open(`http://localhost:5000/auth/discord`, "_self");
  }

  const sendEmail=async ()=>{
    if(forgetEmail===''){
      toaster.addToast('Email is required', 'warning', {
        duration: 4000,
        styles: {
          backgroundColor: 'orange',
          color: '#ffffff',
        },
      });
    }
    else{
      const response=await axios.post('http://localhost:5000/api/users/sendEmail',{
        email:forgetEmail
      })
      toaster.addToast('Email sent successfully', 'success', {
        duration: 4000,
        styles: {
          backgroundColor: 'green',
          color: '#ffffff',
        },
      });
      const receivedOTP = response.data.data.otp;
      console.log(response.data.data.otpValidity)
      console.log(receivedOTP)
      setotp(receivedOTP);
    }
  
  }
  const handleOTPverification=() =>{
    console.log(otp);
    console.log(getOTP)
    if( otp==='' && getOTP===''){
      toaster.addToast('OTP is required', 'warning', {
        duration: 4000,
        styles: {
          backgroundColor: 'orange',
          color: '#ffffff',
        },
      });
    }
    else if (otp == getOTP ) {
      setVerifyPass(1);
    } else {
      toaster.addToast('Invalid OTP', 'warning', {
        duration: 4000,
        styles: {
          backgroundColor: 'red',
          color: '#ffffff',
        },
      });
    }
  };

  const handleResetPassword=()=>{
    if(resetPassword!==confirmResetPassword){
      toaster.addToast('Password does not match', 'warning', {
        duration: 4000,
        styles: {
          backgroundColor: 'red',
          color: '#ffffff',
        },
      });
    }
    else{
      const response=axios.post('http://localhost:5000/api/users/resetPassword',{
        email:forgetEmail,
        password:resetPassword
      })
      if(response){
        toaster.addToast('Password changed successfully', 'warning', {
          duration: 4000,
          styles: {
            backgroundColor: 'green',
            color: '#ffffff',
          },
        });
        setVerifyPass(0);  
        setResetPass(0);
      }  
    }
  }

  return (
    <> 
    {isLoading && <div className='LoderComponent'>
      <div class="spinner-grow text-primary"  role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="spinner-grow text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div></div>
    }
    {!isLoading && <><div className='LoginComponent'>
      <div className='DescriptionSection'>
        
        <header>
            <div className='product' onClick={()=>navigate('/login')}><img src={logo} alt='Logo'></img> IMAGO</div>
            <AiOutlineMenu className='Menu' onClick={()=>{
                document.getElementById('LoginSection').style.zIndex=100;
            }}/>
        </header>
        <div className='Description'>
          <p>
            <div className='quote'>Enter the Enchanting Realm of<br/> Fluttering Dreams</div>
            Start Exploring more
          </p>
        </div>
      </div>
      <div className='LoginSection'>
        <div className='Container'>
          <section>
            <img src={logo} alt='Logo' />
          </section>
          <p>Hello ! Welcome back</p>
        </div>

        <div className='LoginDetails'>
          <div className='email'>
            <p>Email</p>
            <div className='EmailContainer'>
              <IoMail className='EmailLogo' />
              <input onBlur={handleBlur} type='email' placeholder='Enter your email address' onChange={(e) => setEmail(e.target.value)} />
            </div>
            {!isValid && <p style={{ color: "red" }}>Please enter a valid email address.</p>}
          </div>
          <div className='email'>
            <p>Password</p>
            <div className='EmailContainer'>
              <MdPassword className='EmailLogo' />
              <input type={passState === 0 ? 'password' : 'text'} placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
              {passState === 0 ? <BsEyeSlashFill className='EmailLogo' onClick={() => setPassState(1)} /> : <BsEyeFill className='EmailLogo' onClick={() => setPassState(0)} />}
            </div>
          </div>
          <div className='ForgetSection'>
            <button className='Forget' onClick={()=>setResetPass(1)}>Reset Password !</button>
          </div>
          <div className='LoginButton'>
            <button onClick={handleLogin}>{!onLoginSpinner && <>Login</>} 
            {onLoginSpinner && <div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div> }     
            </button>
          </div>
        </div>
        <div className='OrContainer'>
          <span />
          <p>Or</p>
          <span />
        </div>
        <div className='SocialMediaLogin'>
          <button><img src={google} onClick={handleGoogleLogin} alt='Google'/></button>
          <button><img src={facebook} onClick={handleFacebookLogin} alt='Facebook' /></button>
          <button><img src={github} onClick={handleGithubLogin} alt='GitHub'  /></button>
          <button><img src={discord} onClick={handleDiscordLogin} alt='Discord' /></button>
        </div>
        <div className='LoginSignup'>
          <p>Don't have an account? <button onClick={() => navigate('/signup')}>Create Account</button></p>
        </div>
      </div>
    </div>
    {
      resetPass===1 && verifyPass!==1 && 
      <div className='ForgetComponent'  data-aos="zoom-in">
        <div className='resetPassword'>
          <div className='ResetTop'>
            <img src={logo} alt='Logo'></img>
            <RxCross1 className='crossLogo'  onClick={()=>setResetPass(0)}/>
          </div>
          <p>Enter the email address associated with your account</p>
          <div className='EmailContainer'>
              <IoMail className='EmailLogo' />
              <input type='email' placeholder='Enter your email address' onChange={(e) => setforgetEmail(e.target.value)} />
            </div>
            <div className='sendOTP'>
            <button onClick={sendEmail}>Send OTP <BsArrowRight/></button>
            <div className='EmailContainer'>
            <img src={otpLogo} alt='OTPLogo'></img>
              <input type='email' placeholder='Enter the OTP' onChange={(e) => setgetOTP(e.target.value)} />
            </div>
          </div>
          <div className='LoginButton'>
            <button onClick={handleOTPverification}>Verify</button>
          </div> 
        </div>
      </div>
    }
    {
      verifyPass===1  && 
      <div className='ForgetComponent'  data-aos="zoom-in">
        <div className='resetPassword'>
          <div className='ResetTop'>
            <img src={logo} alt='Logo' ></img>
            <RxCross1 className='crossLogo'  onClick={()=>{setVerifyPass(0);setResetPass(0)}}/>
          </div>
          <p>Enter the new Password</p>
          <div className='EmailContainer'>
              <MdPassword className='EmailLogo' />
              <input type='password' placeholder='Enter the password' onChange={(e) => setResetPassword(e.target.value)} />
            </div>
            <p>Confirm your Password</p>
            <div className='EmailContainer'>
              <MdPassword className='EmailLogo' />
              <input type='password' placeholder='Confirm your password' onChange={(e) => setConfirmResetPassword(e.target.value)} />
            </div>
          <div className='LoginButton'>
            <button onClick={handleResetPassword}>Reset</button>
          </div>
        </div>
      </div>
    }</>}
    </>
  );
};

export default Login;
