
import '../product/product.css'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../dashboard/home.css';
import {  useNavigate } from 'react-router-dom';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { RxDoubleArrowRight } from "react-icons/rx";
import { AiFillStar } from "react-icons/ai";
import LowestPrice from '../images/offer.png';
import CashOnDelivery from '../images/COD.svg';
import ReturnPolicy from '../images/ReturnProduct.svg';
import { BsArrowUp } from "react-icons/bs";
import Header from '../header/header';
import AOS from 'aos';
const Product = ({ productID, setproductID,productsList,setProduct }) => {
    const [isLoading,setisLoading]=useState(true);
    const navigate = useNavigate();
    const [singleProduct,setSingleProduct]=useState({});
    const [imgCount,setImageCount]=useState(0)

    useEffect(() => {
        AOS.init();
        const productdata = async () => {
          if (!productID) {
            const storedProductID = sessionStorage.getItem('id');
            if (storedProductID) {
              setproductID(storedProductID);
              return; 
            } else {
              setproductID(1);
              return; 
            }
          }
          const response = await axios.post('http://localhost:5000/api/users/getSingleProduct', { id: productID });
          console.log(response);
          setSingleProduct(response.data.response);
          setisLoading(false);
        };
        productdata();
      }, [productID, setproductID]);


      const handleGetProduct = async (id) => {
        // Set the product ID in session storage
        
        sessionStorage.setItem('id', id);
        window.scrollTo({
          top: 0
        });
        setproductID(id); // Update the productID state directly
        console.log(id); 
        setImageCount(0)
        navigate('/product');
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
                    alert(res.razorpay_payment_id)
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
    return (
      <> 
        {isLoading ? (
        <div className='LoderComponent'>
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
        ):(
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
                <img src={singleProduct.images?.[imgCount]} alt={singleProduct?.title}/> 
              </div>
            </div>


                <div className='productButtons'>
                    <button className='AddtoCart' onClick={()=>navigate('/verify_details')}><AiOutlineShoppingCart className='ATCLogo'/> Add to Cart</button>
                    <button className='BuyNow' onClick={handleSubmit}><RxDoubleArrowRight className='BNLogo'/> Buy Now</button>
                </div>
            </div>
            
              <div className='ProductDescriptionContainer' data-aos="fade-left">
                <div className='Product_details'>
                    <div className='title'>{singleProduct?.title}</div>
                    <div className='Price'>₹{Math.floor(singleProduct.price)*80} <h6><s>₹{Math.floor(singleProduct.price*80) + 50}</s></h6></div>
                    {singleProduct?.rating ? (
                      <div className='RatingSection'>
                        <div className='Ratings'>
                          {singleProduct.rating}
                          <AiFillStar className='RatingLogo' /> 
                        </div>
                        <p>{Math.floor(singleProduct.rating *100 +20)}Reviews</p>
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
        <div className='RemainingProductContainer'>
            <div className='Products'>
            {
              productsList.map((item)=>{
                return (
                  <div className='ProductCard' data-aos="zoom-in" key={item.id} onClick={()=>handleGetProduct(item.id)}>
                    <img src={item.thumbnail} alt={item.title} />
                    <h5>{item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}</h5>
                    <div className='PriceDetails'><h3>₹{Math.floor(item.price*80)}</h3>Onwards</div>
                    <p>Free Delivery</p>
                    <div className='RatingSection'>
                      <div className='Ratings'>{item.rating}<AiFillStar className='RatingLogo'/></div>
                      <p>{Math.floor(item.rating *100 +20)} Reviews</p>
                    </div>
                  </div>
                ); 
              })
            }
          </div>
        </div>

        <div className='UpArrow' onClick={()=>{
          window.scrollTo({
            top: 0,
            behavior: 'smooth' // Adds a smooth scrolling animation, you can omit this if you prefer an instant jump to the top
          });
        }}><BsArrowUp className='UparrowIcon'/></div>
        </>  )}
      </>
    );
}

export default Product;
