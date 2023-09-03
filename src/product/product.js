import '../product/product.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../dashboard/home.css';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { RxDoubleArrowRight } from "react-icons/rx";
import { AiFillStar } from "react-icons/ai";
import LowestPrice from '../images/offer.png';
import CashOnDelivery from '../images/COD.svg';
import ReturnPolicy from '../images/ReturnProduct.svg';
import { BsArrowUp } from "react-icons/bs";
import Header from '../header/header';
import AOS from 'aos';
import ToasterUi from 'toaster-ui';
import { AiOutlineDoubleRight, AiOutlineDoubleLeft } from "react-icons/ai";
import Cookies from "js-cookie";
import Offer_Image from '../images/Offer_Wish.svg';
import { MdViewInAr } from "react-icons/md";

const Product = ({ productID, setproductID, productsList, setProduct }) => {
  const toaster = new ToasterUi();
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();
  const [singleProduct, setSingleProduct] = useState({});
  const [imgCount, setImageCount] = useState(0);
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [offerVisible,setOfferVisible] = useState(true) 

  // Countdown timer state
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    AOS.init();
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
    const products = async () => {
      const productData = await axios.get('https://imago-backend.vercel.app/api/users/getProducts');
      setProduct(productData.data.response);
    };
    products();

    const productdata = async () => {
      if (!productID) {
        const storedProductID = sessionStorage.getItem('id');
        if (storedProductID) {
          setproductID(storedProductID);
        } else {
          setproductID(1);
        }
      }
      const response = await axios.post('https://imago-backend.vercel.app/api/users/getSingleProduct', { id: id });
      setSingleProduct(response.data.response);
      setisLoading(false);
    };
    productdata();
  }, [productID, setproductID, setProduct, id]);

  const endTime = new Date("2023-10-03T20:01:00"); // Set the end time to a future date and time
 // Set the end time here

useEffect(() => {
  // Calculate the time remaining until the offer ends
  const updateCountdown = () => {
    const currentTime = new Date().getTime();
    const timeRemaining = Math.max(endTime - currentTime, 0);

    if (timeRemaining === 0) {
      setOfferVisible(false); // Set offerVisible to false when the countdown expires
    } else {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }
  };

  // Update the countdown every second
  const countdownInterval = setInterval(updateCountdown, 1000);

  // Initial update
  updateCountdown();

  return () => {
    clearInterval(countdownInterval);
  };
}, [endTime, setOfferVisible]);

  

  const handleGetProduct = async (id) => {
    window.scrollTo({
      top: 0
    });
    setproductID(id);
    setImageCount(0);
    navigate(`/product/${id}`);
  };

  const handleaddtoCart = async (id) => {
    const response = await axios.post('https://imago-backend.vercel.app/api/users/addToCart', { email: userDetails.email, id: id });
    if (response.status === 200) {
      toaster.addToast('Successfully added to Cart', 'success', {
        duration: 3000,
        styles: {
          backgroundColor: 'green',
          color: '#ffffff',
        },
      });
    } else {
      toaster.addToast(response.message, 'failure', {
        duration: 3000,
        styles: {
          backgroundColor: 'green',
          color: '#ffffff',
        },
      });
    }
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
        alert(res.razorpay_payment_id);
      },
      prefill: {
        name: "premkumar",
        email: "scpprem006@gmail.com",
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

  // Calculate current products based on pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsList.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      {isLoading ? (
        <div className='LoderComponent'>
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-impaired">Loading...</span>
          </div>
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-impaired">Loading...</span>
          </div>
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-impaired">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <Header productID={productID} setproductID={setproductID} />
          <div className='ParticularProduct' id='ParticularProduct'>
            <div className='ImageContainer' data-aos="fade-right">
              <div className='ProductImages'>
                <div className='imageSlide'>
                  {singleProduct.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      onClick={() => setImageCount(index)}
                      alt='logo'
                    />
                  ))}
                </div>
                <div className='showImage'>
                  <img src={singleProduct.images?.[imgCount]} alt={singleProduct?.title} />
                </div>
              </div>
              <div className='productButtons'>
                <button className='AddtoCart' onClick={() => handleaddtoCart(singleProduct.id)}><AiOutlineShoppingCart className='ATCLogo' /> Add to Cart</button>
                <button className='BuyNow' onClick={handleSubmit}><RxDoubleArrowRight className='BNLogo' /> Buy Now</button>
              </div>
            </div>
            <div className='ProductDescriptionContainer' data-aos="fade-left">
              <div className='Product_details'>
                <div className='title'>{singleProduct?.title}</div>
                <div className='Price'>₹{Math.floor(singleProduct.price) * 80} <h6><s>₹{Math.floor(singleProduct.price * 80) + 50}</s></h6></div>
                {singleProduct?.rating ? (
                  <div className='RatingSection'>
                    <div className='Ratings'>
                      {singleProduct.rating}
                      <AiFillStar className='RatingLogo' />
                    </div>
                    <p>{Math.floor(singleProduct.rating * 100 + 20)} Reviews</p>
                  </div>
                ) : (
                  <div>No rating available</div>
                )}
                <small><p>Free Delivery</p></small>
              </div>
              <div className='ProductDescription'>
                <div className='size_title'>Product Description</div>
                <div className='description'>
                  {singleProduct.description}
                </div>
                <div className='category'><b>Brand : </b>{singleProduct.brand}</div>
                <div className='category'><b>Category : </b>{singleProduct.category}</div>
                <div className='category'><b>Stocks Available : </b>{singleProduct.stock}</div>
                <div className='category'><b>Category : </b>{singleProduct.category}</div>
              </div>
              <div className='OfferDescription'>
                <section className='LowestPrice'><img src={LowestPrice} alt='Lowest Price'></img><small>Lowest Price</small> </section>
                <section className='COD'><img src={CashOnDelivery} alt='Cash On Delivery'></img><small>Cash on Delivery</small> </section>
                <section className='ReturnPolicy'><img src={ReturnPolicy} alt='ReturnPolicy'></img><small>7-day Returns</small> </section>
              </div>
            </div>
          </div>
          {offerVisible && <><div className='NewofferContainer'>
            <div className='NewofferDescription'>
              <div>
                <h4>Limited Time Offer</h4>
                <p>Make the Product to be your's</p>
              </div>
              <div className='Timer'>
                <div className='countDown'>
                  <div>{countdown.days}</div>
                  <div>Days</div>
                </div>
                <div>:</div>
                <div className='countDown'>
                  <div>{countdown.hours}</div>
                  <div>Hours</div>
                </div>
                <div>:</div>
                <div className='countDown'>
                  <div>{countdown.minutes}</div>
                  <div>Minutes</div>
                </div>
                <div>:</div>
                <div className='countDown'>
                  <div>{countdown.seconds}</div>
                  <div>Seconds</div>
                </div>
              </div>
              <div><button>View Product <MdViewInAr/></button></div>
            </div>
            <div className='NewofferImage'>
              <img src={Offer_Image} alt="Offer"/>
            </div>
          </div></>
        }
          <div className='RemainingProductContainer'>
            <div className='Products'>
              {currentProducts.map((item) => {
                return (
                  <div className='ProductCard' /*data-aos="fade-right"*/ key={item.id} onClick={() => handleGetProduct(item.id)}>
                    <img src={item.thumbnail} alt={item.title} />
                    <h5>{item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}</h5>
                    <div className='PriceDetails'><h3>₹{Math.floor(item.price * 80)}</h3>Onwards</div>
                    <p>Free Delivery</p>
                    <div className='RatingSection'>
                      <div className='Ratings'>{item.rating}<AiFillStar className='RatingLogo' /></div>
                      <p>{Math.floor(item.rating * 100 + 20)} Reviews</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='Pagination'>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <AiOutlineDoubleLeft /> PREVIOUS
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={indexOfLastProduct >= productsList.length}
            >
              NEXT <AiOutlineDoubleRight />
            </button>
          </div>
          <div className='UpArrow' onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}><BsArrowUp className='UparrowIcon' /></div>
        </>
      )}
    </>
  );
}

export default Product;
