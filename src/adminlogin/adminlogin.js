import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../adminlogin/adminlogin.css";
import logo from "../logo.svg";
import { IoMail } from "react-icons/io5";
import { MdPassword } from "react-icons/md";
import axios from "axios";
import ToasterUi from "toaster-ui";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import AOS from "aos";
import "aos/dist/aos.css";
import { AiOutlineMenu } from "react-icons/ai";
import Cookies from "js-cookie";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
const Adminlogin = () => {
  const toaster = new ToasterUi();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
    setisLoading(false)
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
  const [onLoginSpinner, setonLoginSpinner] = useState(false);
  const [isLoading, setisLoading] = useState(true);

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
        "https://imago-backend.vercel.app/api/users/login",
        data
      );
      if (response.status == 200) {
        const token = response.data.token; // Update this field name based on the actual response
        Cookies.set("user_id", token);
        setonLoginSpinner(false);
        toaster.addToast("Successfully Logged In", "success", {
          duration: 3000,
          styles: {
            backgroundColor: "green",
            color: "#ffffff",
          },
        });
        navigate("/admindashboard");
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
                <p>Hello Admin! Welcome to Imago</p>
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
              </div>
              
            </div>
          </div>
          
          
        </>
      )}
    </>
  );
};

export default Adminlogin;
