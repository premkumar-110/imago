import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../login/login.css";
import logo from "../logo.svg";
import { IoMail } from "react-icons/io5";
import { MdPassword } from "react-icons/md";
import axios from "axios";
import ToasterUi from "toaster-ui";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { BsArrowRight } from "react-icons/bs";
import otpLogo from "../images/otp.svg";
import AOS from "aos";
import "aos/dist/aos.css";
import { AiOutlineMenu } from "react-icons/ai";
import Cookies from "js-cookie";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import { auth, provider,FaceBookAuth } from '../config';
import { signInWithPopup } from 'firebase/auth';
import google from '../images/Google.svg';
import facebook from '../images/Facebook.svg'


const Login = ({ setUserEmail }) => {
  const toaster = new ToasterUi();
  const navigate = useNavigate();
  useEffect(() => {
    const GetCookie = async () => {
      const user_id = Cookies.get("user_id");
      if (user_id) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}api/users/verifyToken`, { token: user_id });
          console.log(response.data.verifiedUser); // Access the response data using response.data
          navigate('/home')
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    
    GetCookie();
    
    
    AOS.init();
    setisLoading(false);
  }, []);

  const [isValid, setIsValid] = useState(true);
  const validateEmail = (inputEmail) => { 
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };
  const handleBlur = () => { 
    setIsValid(validateEmail(email));
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passState, setPassState] = useState(0);
  const [resetPass, setResetPass] = useState(0);
  const [verifyPass, setVerifyPass] = useState(0);
  const [forgetEmail, setforgetEmail] = useState("");
  const [otp, setotp] = useState("");
  const [getOTP, setgetOTP] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [onLoginSpinner, setonLoginSpinner] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleGoogleLogin = ()=>{
    signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      setUser(user);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}api/users/googleLogin`,
        { email: user.email, password: '123abc@123' },
        { withCredentials: true }
      );
      if(response.status==200){
        const token = response.data.token; // Update this field name based on the actual response
        Cookies.set("user_id", token);
        navigate('/home')
      }
    })
    .catch((error) => {
      alert("An error occured. Please try again later.")
      console.log(error);
    });
  }
  const handleFacebookLogin =async ()=>{
    try{
    const result = await FaceBookAuth();
    
      setUser(result.user);
      console.log(user.email)
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}api/users/googleLogin`,
        { email: user.email, password: '123abc@123' },
        { withCredentials: true }
      );
      if(response.status==200){
        const token = response.data.token; // Update this field name based on the actual response
        Cookies.set("user_id", token);
        navigate('/home')
      }
    }
    catch(e){
      console.log(e)   
    }
    
  }

  const handleLogin = async (e) => {
   
    try {
      if (!email || !password) {
        toaster.addToast("Email and Password are required", "failure", {
          duration: 4000,
          styles: {
            backgroundColor: "#FF3131",
            color: "#ffffff",
          },
        });
        return;
      }
      setonLoginSpinner(true);
      const data = { email: email, password: password };
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}api/users/login`,
        data
      );
      if (response.status == 200) {
        const token = response.data.token; // Update this field name based on the actual response
        Cookies.set("user_id", token);
        setonLoginSpinner(false);
        toaster.addToast("Successfully Logged In", "success", {
          duration: 1000,
          styles: {
            backgroundColor: "green",
            color: "#ffffff",
          },
        });
        sessionStorage.setItem("email", email);
        setUserEmail(email);
        navigate("/home");
      } else {
        setonLoginSpinner(false);
        toaster.addToast("Invalid email or password", "warning", {
          duration: 4000,
          styles: {
            backgroundColor: "orange",
            color: "#ffffff",
          },
        });
      }
    } catch (error) {
      setonLoginSpinner(false);
      console.log(error);
      toaster.addToast("An error occurred, please try again later", "failure", {
        duration: 4000,
        styles: {
          backgroundColor: "#red",
          color: "#ffffff",
        },
      });
    }
  };

  // const handleGoogleLogin = async () => {
  //   window.open(`${process.env.REACT_APP_SERVER_URL}auth/google`, "_self");
  // };
  // const handleFacebookLogin = async () => {
  //   window.open(`${process.env.REACT_APP_SERVER_URL}auth/facebook`, "_self");
  // };
  // const handleGithubLogin = async () => {
  //   window.open(`${process.env.REACT_APP_SERVER_URL}auth/github`, "_self");
  // };
  // const handleDiscordLogin = async () => {
  //   window.open(`${process.env.REACT_APP_SERVER_URL}auth/discord`, "_self");
  // };

  const sendEmail = async () => {
    if (forgetEmail === "") {
      toaster.addToast("Email is required", "warning", {
        duration: 4000,
        styles: {
          backgroundColor: "orange",
          color: "#ffffff",
        },
      });
    } else {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}api/users/sendEmail`,
        {
          email: forgetEmail,
        }
      );
      if(response.data.status=="success"){
        toaster.addToast("Email sent successfully", "success", {
          duration: 4000,
          styles: {
            backgroundColor: "green",
            color: "#ffffff",
          },
        });
      }else{
        toaster.addToast("Server error occured please try again later", "failure", {
          duration: 4000,
          styles: {
            backgroundColor: "green",
            color: "#ffffff",
          },
        });
      }
      
      const receivedOTP = response.data.data.otp;
      console.log(response.data.data.otpValidity);
      console.log(receivedOTP);
      setotp(receivedOTP);
    }
  };
  const handleOTPverification = () => {
    console.log(otp);
    console.log(getOTP);
    if (otp === "" && getOTP === "") {
      toaster.addToast("OTP is required", "warning", {
        duration: 4000,
        styles: {
          backgroundColor: "orange",
          color: "#ffffff",
        },
      });
    } else if (otp == getOTP) {
      setVerifyPass(1);
    } else {
      toaster.addToast("Invalid OTP", "warning", {
        duration: 4000,
        styles: {
          backgroundColor: "red",
          color: "#ffffff",
        },
      });
    }
  };

  const handleResetPassword = () => {
    if (resetPassword !== confirmResetPassword) {
      toaster.addToast("Password does not match", "warning", {
        duration: 4000,
        styles: {
          backgroundColor: "red",
          color: "#ffffff",
        },
      });
    } else {
      const response = axios.post(
        `${process.env.REACT_APP_SERVER_URL}api/users/resetPassword`,
        {
          email: forgetEmail,
          password: resetPassword,
        }
      );
      if (response) {
        toaster.addToast("Password changed successfully", "warning", {
          duration: 4000,
          styles: {
            backgroundColor: "green",
            color: "#ffffff",
          },
        });
        setVerifyPass(0);
        setResetPass(0);
      }
    }
  };

  return (
    <>
      {isLoading && (
        <div className="LoderComponent">
          <div class="spinner-grow text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="spinner-grow text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="spinner-grow text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <div className="LoginComponent">
            <div className="DescriptionSection">
              <header>
                <img src={logo} alt="Logo" />
                <div className="product">IMAGO</div>
                <AiOutlineMenu
                  className="Menu"
                  onClick={() => {
                    document.getElementById("LoginSection").style.zIndex = 100;
                  }}
                />
              </header>
              <div className="Description">
                <p>
                  <div className="quote">
                    Enter the Enchanting Realm of
                    <br /> Fluttering Dreams
                  </div>
                  Start Exploring more <HiOutlineChevronDoubleRight/>
                </p>
              </div>
            </div>
            <div className="LoginSection">
              <div className="Container">
                <p>Hello ! Welcome back to Imago</p>
              </div>

              <div className="LoginDetails">
                <div className="email">
                  <p>Email</p>
                  <div className="EmailContainer">
                    <IoMail className="EmailLogo" />
                    <input
                      onBlur={handleBlur}
                      type="email"
                      placeholder="Enter your email address"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {!isValid && (
                    <p style={{ color: "red" }}>
                      Please enter a valid email address.
                    </p>
                  )}
                </div>
                <div className="email">
                  <p>Password</p>
                  <div className="EmailContainer">
                    <MdPassword className="EmailLogo" />
                    <input
                      type={passState === 0 ? "password" : "text"}
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passState === 0 ? (
                      <BsEyeSlashFill
                        className="EmailLogo"
                        onClick={() => setPassState(1)}
                      />
                    ) : (
                      <BsEyeFill
                        className="EmailLogo"
                        onClick={() => setPassState(0)}
                      />
                    )}
                  </div>
                </div>
                <div className="ForgetSection">
                  <button className="Forget" onClick={() => setResetPass(1)}>
                    Reset Password !
                  </button>
                </div>
                <div className="LoginButton">
                  <button onClick={handleLogin}>
                    {!onLoginSpinner && <>Login</>}
                    {onLoginSpinner && (
                      <div class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </button>
                </div>
                <div className="LoginSignup">
                <p>
                  Don't have an account?{" "}
                  <button onClick={() => navigate("/signup")}>
                    Create Account
                  </button>
                </p>
              </div>
              </div>
              <div className="OrContainer">
                <span />
                <p>Or</p>
                <span />
              </div>
              
               <div className="SocialMediaLogin">
                <button onClick={handleGoogleLogin} >
                  <span>Login with Google</span> <img src={google} alt="Google" />
                </button>
                <button onClick={handleFacebookLogin}>
                  <span>Login with Facebook</span> <img src={facebook} alt="Google" />
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
                </button>   */}
              </div> 
              
            </div>
          </div>
          {resetPass === 1 && verifyPass !== 1 && (
            <div className="ForgetComponent" data-aos="zoom-in">
              <div className="resetPassword">
                <div className="ResetTop">
                  <img src={logo} alt="Logo"></img>
                  <RxCross1
                    className="crossLogo"
                    onClick={() => setResetPass(0)}
                  />
                </div>
                <p>Enter the email address associated with your account</p>
                <div className="EmailContainer">
                  <IoMail className="EmailLogo" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    onChange={(e) => setforgetEmail(e.target.value)}
                  />
                </div>
                <div className="sendOTP">
                  <button onClick={sendEmail}>
                    Send OTP <BsArrowRight />
                  </button>
                  <div className="EmailContainer">
                    <img src={otpLogo} alt="OTPLogo"></img>
                    <input
                      type="email"
                      placeholder="Enter the OTP"
                      onChange={(e) => setgetOTP(e.target.value)}
                    />
                  </div>
                </div>
                <div className="LoginButton">
                  <button onClick={handleOTPverification}>Verify</button>
                </div>
              </div>
            </div>
          )}
          {verifyPass === 1 && (
            <div className="ForgetComponent" data-aos="zoom-in">
              <div className="resetPassword">
                <div className="ResetTop">
                  <img src={logo} alt="Logo"></img>
                  <RxCross1
                    className="crossLogo"
                    onClick={() => {
                      setVerifyPass(0);
                      setResetPass(0);
                    }}
                  />
                </div>
                <p>Enter the new Password</p>
                <div className="EmailContainer">
                  <MdPassword className="EmailLogo" />
                  <input
                    type="password"
                    placeholder="Enter the password"
                    onChange={(e) => setResetPassword(e.target.value)}
                  />
                </div>
                <p>Confirm your Password</p>
                <div className="EmailContainer">
                  <MdPassword className="EmailLogo" />
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    onChange={(e) => setConfirmResetPassword(e.target.value)}
                  />
                </div>
                <div className="LoginButton">
                  <button onClick={handleResetPassword}>Reset</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Login;
