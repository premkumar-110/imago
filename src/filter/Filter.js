import React, { useState, useEffect } from 'react';
import '../filter/Filter.css';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import axios from 'axios';

const Filter = ({ productsList, setProduct }) => {
  const [categorychecked, setCategoryChecked] = useState(false);
  const [pricechecked, setPriceChecked] = useState(false);
  const [discountchecked, setDiscountChecked] = useState(false);
  const [originalProductsList, setOriginalProductsList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productData = await axios.get('https://server-imago.vercel.app/api/users/getProducts');
      setOriginalProductsList(productData.data.response);
    };
    fetchProducts();
  }, []);

  const handleCategoryFilter = (category) => {
    setCategoryChecked(true);
    setPriceChecked(false);
    setDiscountChecked(false);
    const filteredProducts = productsList.filter((product) => product.category === category);
    setProduct(filteredProducts);
  };

  const handlePriceFilter = (maxPrice) => {
    setCategoryChecked(false);
    setPriceChecked(true);
    setDiscountChecked(false);
    const filteredProducts = productsList.filter((product) => product.price * 80 <= maxPrice);
    setProduct(filteredProducts);
  };

  const handleDiscountFilter = (minDiscount) => {
    setCategoryChecked(false);
    setPriceChecked(false);
    setDiscountChecked(true);
    const filteredProducts = productsList.filter((product) => Math.floor(product.discountPercentage) >= minDiscount);
    setProduct(filteredProducts);
  };

  const handleClearAll = () => {
    setCategoryChecked(false);
    setPriceChecked(false);
    setDiscountChecked(false);
    setProduct(originalProductsList);
  };

  return (
    <>
      <div className='filter'>
        <h3>Products For You</h3>
        <div className='filterData'>
          <h5>FILTERS</h5>
          <div className='FilterClearContainer'>
            <small>view products</small>
            <span className='ClearBtn' onClick={handleClearAll}>
              Clear All
            </span>
          </div>
          <hr />
          <span className='CategoryList'>
            <span
              className='title'
              onClick={() => {
                setCategoryChecked(!categorychecked);
                setPriceChecked(false);
                setDiscountChecked(false);
              }}
            >
              CATEGORY {categorychecked ? <MdOutlineKeyboardArrowDown className='filterIcons' /> : <MdOutlineKeyboardArrowUp className='filterIcons' />}
            </span>
            {categorychecked && (
              <ul>
                <li onClick={() => handleCategoryFilter('smartphones')}>SMART PHONES</li>
                <li onClick={() => handleCategoryFilter('laptops')}>LAPTOPS</li>
                <li onClick={() => handleCategoryFilter('fragrances')}>FRAGRANCES</li>
                <li onClick={() => handleCategoryFilter('skincare')}>SKIN CARE</li>
              </ul>
            )}
          </span>
          <hr />
          <span className='PriceList'>
            <span
              className='title'
              onClick={() => {
                setCategoryChecked(false);
                setPriceChecked(!pricechecked);
                setDiscountChecked(false);
              }}
            >
              PRICE {pricechecked ? <MdOutlineKeyboardArrowDown className='filterIcons' /> : <MdOutlineKeyboardArrowUp className='filterIcons' />}
            </span>
            {pricechecked && (
              <ul className='PriceFilterList'>
                <li onClick={() => handlePriceFilter(10000)}>UNDER 10000</li>
                <li onClick={() => handlePriceFilter(8000)}>UNDER 8000</li>
                <li onClick={() => handlePriceFilter(5000)}>UNDER 5000</li>
                <li onClick={() => handlePriceFilter(1000)}>UNDER 1000</li>
                <li onClick={() => handlePriceFilter(500)}>UNDER 500</li>
              </ul>
            )}
          </span>
          <hr />
          <span className='DiscountList'>
            <span
              className='title'
              onClick={() => {
                setCategoryChecked(false);
                setPriceChecked(false);
                setDiscountChecked(!discountchecked);
              }}
            >
              DISCOUNTS {discountchecked ? <MdOutlineKeyboardArrowDown className='filterIcons' /> : <MdOutlineKeyboardArrowUp className='filterIcons' />}
            </span>
            {discountchecked && (
              <ul className='DiscountFilterList'>
                <li onClick={() => handleDiscountFilter(10)}>10% and above</li>
                <li onClick={() => handleDiscountFilter(20)}>20% and above</li>
                <li onClick={() => handleDiscountFilter(30)}>30% and above</li>
                <li onClick={() => handleDiscountFilter(40)}>40% and above</li>
                <li onClick={() => handleDiscountFilter(50)}>50% and above</li>
                <li onClick={() => handleDiscountFilter(60)}>60% and above</li>
                <li onClick={() => handleDiscountFilter(70)}>70% and above</li>
                <li onClick={() => handleDiscountFilter(80)}>80% and above</li>
                <li onClick={() => handleDiscountFilter(0)}>All Discounts</li>
              </ul>
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default Filter;
