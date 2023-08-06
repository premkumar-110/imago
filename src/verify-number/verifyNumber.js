import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import '../verify-number/verify-number.css';
import logo from '../logo.svg';
import { BsArrowUpRight } from 'react-icons/bs';
import axios from 'axios';
import ToasterUi from 'toaster-ui';
import { useNavigate } from 'react-router-dom';

const VerifyNumber = () => {
  const toaster = new ToasterUi();
  const [otp, setOtp] = useState('');
  const [gotp, setGotp] = useState('');
  const [number, setNumber] = useState('');
  const [name,setName]=useState('');
  const [address,setAddress]=useState('');
  const navigate=useNavigate();

  const handlesendotp = async () => {
    try {
      const response = await axios.post('https://imago-alpha.vercel.app/api/users/sendSMS', {
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
    if (otp == gotp) {
      toaster.addToast('Invalid OTP', 'error', {
        duration: 4000,
        styles: {
          backgroundColor: 'red',
          color: '#ffffff',
        },
      });
    } else {
      alert('Invalid OTP');
    }
  };

  const handleSubmit=async ()=>{
    const response=await axios.post('https://imago-alpha.vercel.app/api/users/addDetails',{
      "name":name,
      "email":"scpprem006@gmail.com",
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
        <h3>VERIFY MOBILE NUMBER</h3>
        <div className="Ph_Container">
          <input
            type="phone"
            placeholder="Enter your mobile number with country code"
            required
            onChange={(e) => setNumber(e.target.value)}
          />
          <button className="sendOTP" onClick={handlesendotp}>
            SEND OTP <BsArrowUpRight className="otpicons" />
          </button>
        </div>
        <div className="otpContainer">
          <p>ENTER THE OTP TO VERIFY</p>
          <OtpInput
            className="otp_verification"
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} className="otp-input" />}
          />
        </div>
        <button className="VerifyBtn" onClick={handleVerifyOTP}>
          VERIFY
        </button>
        <div className='PersonalDetails'>
            <div className='email'>
              <p>NAME</p>
              <div className='EmailContainer'>
                <input type='text' placeholder='Enter your name'  onChange={(e)=>{setName(e.target.value)}}/>
              </div>
            </div>
        </div>
        <div className='PersonalDetails'>
            <div className='email'>
              <p>ADDRESS</p>
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
