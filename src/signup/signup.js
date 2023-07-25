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


const Signup = () => {
  const navigate = useNavigate();
  const toaster = new ToasterUi();

  const [passState, setPassState] = useState(0);
  const [confpassState,setconfPassState]=useState(0);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [isValid, setIsValid] = useState(true);


  const validateEmail = (inputEmail) => {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };
  const handleBlur = () => {
    setIsValid(validateEmail(email));
  };

  const handleSignup=async ()=>{
    try{
        if(!email||!password||!confirmPassword){
            toaster.addToast('Email and Password is required', 'success', {
                duration: 4000,
                styles: {
                  backgroundColor: 'red',
                  color: '#ffffff',
                },
              });
        }
        else{
            const response = await axios.post('http://localhost:8000/api/users/signup', {
            email,
            password,
            });
            if(response.status===200){
                toaster.addToast('Account created Successfully', 'success', {
                    duration: 4000,
                    styles: {
                      backgroundColor: 'green',
                      color: '#ffffff',
                    },
                  });
                  navigate('/login');
            }
        }
    }catch(e){

    }
  }

  return (
    <div className='LoginComponent'>
        <div className='DescriptionSection'>

        </div>
        <div className='LoginSection'>

            <div className='Container'>
                <section><img src={logo}></img></section>
                <p>Hello ! Welcome back</p>
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
                   {confirmPassword!=password && confirmPassword.length>0 && <p>Passwords does not match!</p>} 
                </div>
                <div className='LoginButton'>
                    <button onClick={handleSignup}>Create Account</button>
                </div>
            </div>
            <div className='OrContainer'>
                <span></span><p>Or</p><span></span>
            </div>
            <div className='SocialMediaLogin'>
                <button><img src={google}></img></button>
                <button><img src={facebook}></img></button>
                <button><img src={github}></img></button>
                <button><img src={discord}></img></button>
            </div>
            <div className='LoginSignup'>
                <p>Don't have an account? <button onClick={() => navigate('/login')}>Sign In</button></p>
            </div>
        </div>
    </div>
  )
}

export default Signup;