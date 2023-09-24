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
import { Dropdown, Space,Select } from 'antd';
import { Button, notification } from 'antd';



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
  const [paymentMode,setPaymentstate] = useState('');
  const [paymentSuccess,setPaymentSuccess]=useState(false)
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: 'Payment is successful',
      
      duration: 2000,
    });
  };
  useEffect(() => {
    const productdata = async () => {
      const response = await axios.post('https://imago-backend.vercel.app/api/users/getSingleProduct', { id: id });
      setSingleProduct(response.data.response);
    };
    productdata();

    const GetCookie = async () => {
      const user_id = Cookies.get("user_id");
      if (user_id) {
        try {
          const response = await axios.post('https://imago-backend.vercel.app/api/users/verifyToken', { token: user_id });
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
        const response = await axios.post('https://imago-backend.vercel.app/admin/purchaseProduct', { 
        useremail: userDetails.email, 
        productid: singleProduct.id,
        paymentMode:"Cash On Delivery",
        address:userDetails.address,
        price:singleProduct.price*80,
        phoneNumber:userDetails.phoneNumber  });
        console.log(response.data);
        const response1 = await axios.post('https://imago-backend.vercel.app/admin/sendEmail',{
          email:userDetails.email,
          orderid:singleProduct._id,
          total:singleProduct.price,
          discount:singleProduct.discountPercentage
        });
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


  const handleSubmit = () => {
    var option = {
      key: "rzp_test_PVrN8Q8hFzJ7Je",
      key_secret: "jcRs9PXi3lR2eJdm3qgyl1WC",
      amount: singleProduct.price * 80 * 100,
      currency: "INR",
      name: "Payment Check",
      description: "Testing",
      handler: function (res) {
        console.log(res.razorpay_payment_id);
        setPaymentSuccess(true);
        openNotification()
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: "1234567890"
      },
      notes: {
        address: "RazorPay Corporate Office"
      },
      theme: {
        color: "#6383FA"
      }
    };
    var pay = new window.Razorpay(option);
    pay.open();
    
  };
  
  const handleSubmitData=async ()=>{
    const response=await axios.post('https://imago-backend.vercel.app/api/users/addDetails',{
      "name":name,
      "email":userDetails.email,
      "phoneNumber":number,
      "address":address
    });
    if(response.status==200){
      const user_id = Cookies.get("user_id");
      const response = await axios.post('https://imago-backend.vercel.app/api/users/verifyToken', { token: user_id });
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

  const handleChange = (value) => {
    setPaymentstate(value);
    if(paymentMode!="Pay online"){
      handleSubmit()
    }
    console.log(`selected ${value}`);
  };
  
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
                <p>Rs. {singleProduct.price * 80} <br /> Quantity : 1 <br/> <span>All issue easy returns allowed</span></p>
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
               {!paymentSuccess && <Space className='SelectPayment'>
                <Select
                  defaultValue="Choose a Payment Method"
                  onChange={handleChange}
                  options={[
                    { value: 'Cash on Delivery', label: 'Cash on Delivery' },
                    { value: 'Pay online', label: 'Pay online'},
                  ]}
                />
              </Space>}
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
      {contextHolder}
    </>
  );
}

export default Payment; 
