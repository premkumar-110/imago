import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import '../verify-number/verify-number.css';
import logo from '../logo.svg';
import { BsArrowUpRight } from 'react-icons/bs';
import axios from 'axios';
import ToasterUi from 'toaster-ui';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const VerifyNumber = ({userEmail}) => {
  const toaster = new ToasterUi();
  const [otp, setOtp] = useState('');
  const [gotp, setGotp] = useState('');
  const [number, setNumber] = useState('');
  const [name,setName]=useState('');
  const [address,setAddress]=useState('');
  const navigate=useNavigate();
  const [validno,setValidNo]=useState(true); 
  const [validuserDetails,setVaildUserDetails] = useState({})
  useEffect(()=>{
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
  },[])
  const handlesendotp = async () => {
    try {
      const response = await axios.post('https://imago-backend.vercel.app/api/users/sendSMS', {
        no: number,
      });
      if (response && response.data && response.data.otp) {
        console.log(number, response.data.otp);
        toaster.addToast('OTP sent successfully', 'success', {
          duration: 4000,
          styles: {
            backgroundColor: 'green',
            color: '#ffffff',
          },
        });
        setGotp(response.data.otp);
        
      } else {
        toaster.addToast('Failed to send OTP', 'error', {
          duration: 4000,
          styles: {
            backgroundColor: 'red',
            color: '#ffffff',
          },
        });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toaster.addToast('Failed to send OTP', 'error', {
        duration: 4000,
        styles: {
          backgroundColor: 'red',
          color: '#ffffff',
        },
      });
    }
  };

  const handleVerifyOTP = () => {
    console.log(gotp,otp)
    alert("Called")
    if (otp === gotp) {
      setValidNo(false);
      toaster.addToast('OTP Verified successfully', 'error', {
        duration: 4000,
        styles: {
          backgroundColor: 'green',
          color: '#ffffff',
        },
      });
    } else {
      toaster.addToast('Invalid OTP', 'error', {
        duration: 4000,
        styles: {
          backgroundColor: 'red',
          color: '#ffffff',
        },
      });
    }
  };

  const handleSubmit=async ()=>{
    const response=await axios.post('https://imago-backend.vercel.app/api/users/addDetails',{
      "name":name,
      "email":validuserDetails.email,
      "phoneNumber":number,
      "address":address
    });
    if(response.status==200){
      toaster.addToast('Data submitted successfully', 'success', {
        duration: 4000,
        styles: {
          backgroundColor: 'green',
          color: '#ffffff',
        },
      });
      navigate('/profile')
      
    }
  }

  return (
    <div className="verify-number-container">
      <div className="OTP_Container">
        <img src={logo} alt="logo" />
        <h3>SUBMIT YOUR DETAILS</h3>
        { validno && <>
        <div className="Ph_Container">
          <input
            type="phone"
            placeholder="Mobile number with country code"
            required
            onChange={(e) => setNumber(e.target.value)}
          />
          <button className="sendOTP" onClick={handlesendotp}>
            SEND OTP <BsArrowUpRight className="otpicons" />
          </button>
        </div>
        <div className="otpContainer"> 
          <OtpInput
            className="otp_verification"
            value={otp}  
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>-</span>} 
            renderInput={(props) => <input {...props} className="otp-input" />}
          />
          <button className="VerifyBtn" onClick={handleVerifyOTP}>VERIFY</button>
        </div></>
}
        
        <div className='PersonalDetails'>
            <div className='email'>
              <p>NAME <span>*</span></p>
              <div className='EmailContainer'>
                <input type='text' placeholder='Enter your name'  onChange={(e)=>{setName(e.target.value)}}/>
              </div>
            </div>
        </div>
        <div className='PersonalDetails'>
            <div className='email'>
              <p>ADDRESS <span>*</span></p>
                <textarea className='addressContainer' type='text' placeholder='Enter your address' onChange={(e)=>{setAddress(e.target.value)}} />
            </div>
        </div>
        <div className='SubmitDetails' onClick={handleSubmit}>
            <button >SUBMIT</button>
        </div> 
      </div>
      
    </div>
  );
};

export default VerifyNumber;
