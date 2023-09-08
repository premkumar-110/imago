import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../logo.svg';
import '../payment/payment.css';
import { Popover, Steps } from 'antd';
import Cookies from 'js-cookie';
import ToasterUi from 'toaster-ui';
import { BsArrowUpRight } from 'react-icons/bs';
import OtpInput from 'react-otp-input';
import { Switch } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

const items= [
  {
    key: '1',
    label: (
      <div >
         &nbsp;
         Cash on Delivery
      </div>
    ),
    icon:<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wallet" viewBox="0 0 16 16">
    <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z"/>
  </svg>,
  },
  {
    key: '2',
    label: (
      <div>Pay online</div>
    ),
    icon:<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-credit-card" viewBox="0 0 16 16">
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/>
    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/>
  </svg>
  }
];
const onChange = (checked) => {
  console.log(`switch to ${checked}`);
};
const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [singleProduct, setSingleProduct] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [showPaymentMode, setPaymentMode] = useState(false);
  const [getAddress, setGetAddress] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(0);
  const toaster = new ToasterUi();
  const [otp, setOtp] = useState('');
  const [gotp, setGotp] = useState('');
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [validno, setValidNo] = useState(true);
  const [verified, setVerified] = useState(false); // Added verified state
  const textBase = useRef(null);

  useEffect(() => {
    const productdata = async () => {
      const response = await axios.post('http://localhost:5000/api/users/getSingleProduct', { id: id });
      setSingleProduct(response.data.response);
    };
    productdata();

    const GetCookie = async () => {
      const user_id = Cookies.get("user_id");
      if (user_id) {
        try {
          const response = await axios.post('http://localhost:5000/api/users/verifyToken', { token: user_id });
          setUserDetails(response.data.verifiedUser);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    GetCookie();
  }, [id]);

  const handlesendotp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/sendSMS', {
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
        setGotp(response.data.otp); // Store the received OTP in state
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
    if (otp == gotp) { // Compare the entered OTP with the received OTP
      setValidNo(true);
      setVerified(true); // Set verification status
      toaster.addToast('OTP Verified successfully', 'success', {
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


  const handleBuyProduct = async () => {
      
      const buyProduct = async () => {
        const response = await axios.post('http://localhost:5000/admin/purchaseProduct', { 
        useremail: userDetails.email, 
        productid: singleProduct.id,
        paymentMode:"Cash On Delivery",
        address:userDetails.address,
        price:singleProduct.price*80,
        phoneNumber:userDetails.phoneNumber  });
        console.log(response.data);
        if (response.status === 200) {
          // Handle success
          toaster.addToast('Order Placed successfully', 'success', {
            duration: 4000,
            styles: {
              backgroundColor: 'green',
              color: '#ffffff',
            },
          });
          navigate('/profile')
        }
      };
      buyProduct();
    
  };

  const clearAll = () => {
    textBase.current.classList.remove("otp-error");
    textBase.current.childNodes.forEach((child) => {
      child.value = "";
    });
    setOtp('');
    setVerified(false);
  };

  const handleSubmitData=async ()=>{
    const response=await axios.post('http://localhost:5000/api/users/addDetails',{
      "name":name,
      "email":userDetails.email,
      "phoneNumber":number,
      "address":address
    });
    if(response.status==200){
      const user_id = Cookies.get("user_id");
      const response = await axios.post('http://localhost:5000/api/users/verifyToken', { token: user_id });
      setUserDetails(response.data.verifiedUser);
      setCurrentProcess(2)
      setGetAddress(false);
      setPaymentMode(true);
      toaster.addToast('Data submitted successfully', 'success', {
        duration: 4000,
        styles: {
          backgroundColor: 'green',
          color: '#ffffff',
        },
      });
      
    }
  }

  return (
    <>
      <div className='Container'>
        <header>
          <div className='logo' onClick={() => navigate('/home')}>
            <img src={logo} alt="logo"></img>
            IMAGO
          </div>
          <Steps
            className='Steps'
            current={currentProcess}
            progressDot={customDot}
            items={[
              {
                title: 'Review',
              },
              {
                title: 'Address',
              },
              {
                title: 'Payment',
              },
            ]}
          />
        </header>
        {!showPaymentMode && !getAddress && <div className='CartContainer'>
          <div>
            <div key={singleProduct.id} className='CartCard'>
              <img src={singleProduct.thumbnail} alt={singleProduct.title} onClick={() => { navigate(`/product/${singleProduct.id}`) }} />
              <div className='Contents'  >
                <h4 >{singleProduct.title}</h4>
                <p>Rs. {singleProduct.price} <br /> <span>All issue easy returns allowed</span></p>
              </div>
            </div>
          </div>
          <div className='PaymentPriceContainer'>
            <h3>Price Details</h3>
            <p>Total Product Price: <b>{singleProduct.price * 80} Rs</b></p>
            <hr></hr>
            <button onClick={() => { setGetAddress(true); setCurrentProcess(1) }} className='ViewProduct'>Proceed</button>
          </div>
        </div>}
        {getAddress && !showPaymentMode &&
          <div className="verify-number-container">
            <h3>Enter your Contact Details</h3>
            {  <>
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
                {verified ? (
                  <p>OTP Verified</p>
                ) : (
                  <>
                  <OtpInput
            className="otp_verification"
            value={otp}  
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>-</span>} 
            renderInput={(props) => <input {...props} className="otp-input" />}
          />
                    <button className="VerifyBtn" onClick={handleVerifyOTP}>
                      VERIFY
                    </button>
                  </>
                )}
              </div>
            </>
            }

            <div className='PersonalDetails'>
              <div className='email'>
                <p>NAME <span>*</span></p>
                <div className='EmailContainer'>
                  <input type='text' placeholder='Enter your name'  onChange={(e) => { setName(e.target.value) }} />
                </div>
              </div>
            </div>
            <div className='PersonalDetails'>
              <div className='email'>
                <p>ADDRESS <span>*</span></p>
                <textarea className='addressContainer' type='text'  placeholder='Enter your address' onChange={(e) => { setAddress(e.target.value) }} />
              </div>
            </div>
            <div className='SubmitDetails' onClick={handleSubmitData}>
              <button >Submit and Proceed</button>
            </div>
          </div>
        }
        {showPaymentMode && <div className='PaymentContainer'>
          
            <div style={{textDecoration:"underline"}}><b>PAYMENT</b></div>
            <div className='PaymentDiv'>
              <div className='PaymentMode'>
                <Dropdown menu={{ items }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      Choose a Payment Mode
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
               <div><Switch defaultChecked onChange={onChange} />I agree to the <span  style={{textDecoration:"underline"}} onClick={()=>{navigate('/terms-and-conditions')}}>Terms and conditions</span></div>
                <button onClick={handleBuyProduct}>Place your Order</button>
              </div>
              <div>
                Address Information
                <div className='PaymentDetails'>
                  <p>Name : {userDetails.name}</p>
                  <p>Mobile Numer : {userDetails.phoneNumber}</p>
                  <p>Email : {userDetails.email}</p>
                  <p>Location : {userDetails.address}</p>
                </div>
              </div>

            </div>
        </div>
        }
      </div>
    </>
  );
}

export default Payment; 
