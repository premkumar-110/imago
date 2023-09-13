import React, { useState, useEffect } from 'react';
import '../dashboard/home.css';
import coverimg from '../images/Cover Page.svg';
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import Filter from '../filter/Filter';
import Header from '../header/header';
import AOS from 'aos';
import { BsArrowUp } from "react-icons/bs";
const Home = ({ productID, setproductID, productsList, setProduct }) => {
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();
  const [originalProductsList, setOriginalProductsList] = useState([]);
  useEffect(() => {
    AOS.init();
    setTimeout(()=>{
      setisLoading(false);
    },2000)
    setOriginalProductsList(productsList);
  }, [productsList]);

  const handleGetProduct = async (id) => {
    setProduct(originalProductsList)
    setproductID(id);
    console.log(id);
    navigate(`/product/${id}`);
  };
  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0,
      behavior: 'smooth'
    });
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
      ) : (
        <>
          <Header productID={productID} setproductID={setproductID} />
          
          <div className='Homesection'>
            <header>
              <img src={coverimg} alt='CoverImage' ></img>
            </header>
          <hr></hr>
            <section className='ProductsSection'>
              <div className='FilterSection'>
                {/* Pass productsList and setProduct to the Filter component */}
                <Filter productsList={productsList} setProduct={setProduct} />
              </div>
              <div className='Products'>
                { productsList.length>0 &&
                  productsList.map((item) => {
                    return (
                      <div className='ProductCard' data-aos="zoom-in" key={item.id} onClick={() => handleGetProduct(item.id)}>
                        <img src={item.thumbnail} alt={item.title} />
                        <h5>{item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}</h5>
                        <div className='PriceDetails'><h3>₹{Math.floor(item.price) * 80}</h3>Onwards</div>
                        <p>Free Delivery</p>
                        <div className='RatingSection'>
                          <div className='Ratings'>{item.rating}<AiFillStar className='RatingLogo' /></div>
                          <p>{Math.floor(item.rating * 100 + 20)} Reviews</p>

                        </div>
                      </div>
                    ); 
                  })
                }
                { productsList.length===0 &&
                  <h3>No product to display</h3>
                }
              </div>
            </section>
          </div><BsArrowUp className="scroll-button" onClick={scrollToTop} />
        </>
      )}
      
    </>
  );
};

export default Home;
