import React, { useEffect, useState } from 'react';
import '../Profile/profile.css';
import logo from '../logo.svg';
import { useNavigate } from 'react-router-dom';
import { FaHistory } from "react-icons/fa";
import axios from 'axios';
import Cookies from "js-cookie";
import EmptyPurchase from '../images/Emptycart.svg';
import { Steps } from 'antd';
import ExternalIcon from '../images/externel-icon.svg'
const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user_id = Cookies.get("user_id");
      if (user_id) {
        try {
          const response = await axios.post('https://imago-backend.vercel.app/api/users/verifyToken', { token: user_id });
          setUserDetails(response.data.verifiedUser);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    const getPurchased = async () => {
      if (!userDetails.email) return; // Check if userDetails has email before fetching purchased items

      try {
        setLoading(true);
        const response = await axios.post('https://imago-backend.vercel.app/admin/getUserPurchase', { useremail: userDetails.email });

        // Set purchasedItems to the data response from the API
        setPurchasedItems(response.data.response);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching purchased items:', error);
        setLoading(false);
      }
    };

    fetchUserDetails();
    getPurchased();
  }, [userDetails.email]);

  const handleClick = () => {
    navigate('/home');
  }

  const handleLogout = () => {
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "https://imago-alpha.vercel.app/login";
  };

  return (
    <>
      <div className='ProfileContainer'>
        <header>
          <div className='logo' style={{ color: "white", fontWeight: "normal" }} onClick={handleClick}>
            <img src={logo} alt="Logo" />IMAGO
          </div>
          <div className='ProfileNav'>
            <div className='Logout' onClick={() => { navigate('/home') }}>Home</div>
            <div className='Logout' onClick={() => { navigate('/cart') }}>View Cart</div>
            <div className='Logout' onClick={handleLogout}>Sign out</div>
          </div>
        </header>

        <div className='AccountDetails'>
          {loading ? (
            <div>Loading user data...</div>
          ) : userDetails.email ? (
            <>
              <div className='AccInfoSection'>
                <div className='prfiledata'>
                  <img
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsEC-AcpMSEBeqwQdUVhjb5fciR-GG2-cuwQ&usqp=CAU'
                    alt="userLogo"
                    className="avatar"
                  />
                  <section className='nameData'>USERNAME : {userDetails.name}</section>
                  <section className='nameData'>EMAIL : {userDetails.email}</section>
                </div>
                <div className='profileRouteSection'>
                  <button onClick={() => { setVisibility(false) }}>
                    <FaHistory /> Order History
                  </button>
                </div>
              </div>

              <div className='OrderHistory'>
                {purchasedItems?.length === 0 && (
                  <div className='EmptyPurchase'>
                    <img src={EmptyPurchase} alt="EmptyPurchase" />
                    <button onClick={() => { navigate('/home') }}>Explore Now</button>
                    <b>YOU HAVE NOT YET PURCHASED ANYTHING</b>
                  </div>
                )}
                {purchasedItems.length !== 0 && (
            <div>
              <div className='PurchasesList'>
              {purchasedItems.map((item) => (
                  item.purchases.map((purchase, index) => (
                    <div key={item._id} className='PurchaseCard' >
                       <Steps current={1}>
                        <Steps.Step style={{marginBottom:20}}
                          key={purchase._id}
                          title={`Product ${index + 1}`}
                          description={`Status: ${purchase.status || 'Placed'}`}
                        />
                        <Steps.Step
                          key={purchase._id}
                          title={`Product ${index + 1}`}
                          description={`Status: ${purchase.status || 'In Process'}`}
                        />
                      </Steps>
                      <h5>Order ID: {purchase.productid}</h5>
                      <p>User Email: {item.useremail}</p>
                      <p>Payment Mode: {purchase.paymentMode}</p>
                      <p>Address: {purchase.address}</p>
                      <p>Total Price: {purchase.price}</p>
                      <p>Phone Number: {purchase.phoneNumber}</p>
                      <button onClick={()=>{navigate(`/product/${purchase.productid}`)}}>View Product <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
  <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
</svg></button>
                    </div> 
                  ))
                ))}

              </div>  

            </div>
          )}






              </div>
            </>
          ) : (
            <div>User not logged in.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
