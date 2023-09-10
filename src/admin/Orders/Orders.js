import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import '../Orders/Orders.css';

const Orders = () => {
  const [productsList, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://imago-backend.vercel.app/admin/getPurchase');
        setProduct(response.data.response);
        setFilteredProducts(response.data.response); // Initialize filteredProducts with all products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchProduct(searchValue);

    // Filter the products based on the search input
    const filtered = productsList.filter((product) =>
      typeof product.purchases[0].productid === 'number' && // Check if productid is a number
      product.purchases[0].productid.toString().includes(searchValue) // Convert to string for comparison
    );
    setFilteredProducts(filtered);
  };

  const clearSearch = () => {
    setSearchProduct('');
    setFilteredProducts(productsList);
  };

  const handleDelivered = (id,useremail)=>{
    const deliver = async ()=>{
      console.log(id,useremail)
      const response = await axios.post('https://imago-backend.vercel.app/admin/setProductDelivered',{id,useremail});
      if(response){
        const response1 = await axios.get('https://imago-backend.vercel.app/admin/getPurchase');
        setProduct(response1.data.response);
        setFilteredProducts(response1.data.response); 
      }
    }
    deliver();
  }
  return (
    <>
      <header className='CustomerHeader'>
        <div className='title'>ORDERS</div>
        <div className='Search'>
          <Input
            className='input'
            placeholder="Search Orders with Product ID"
            value={searchProduct}
            onChange={handleSearchChange}
            prefix={<SearchOutlined className="site-form-item-icon" style={{ borderRadius: 0 }} />}
          />
          <button onClick={clearSearch}>Clear</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>PRODUCT ID</th>
            <th>USER EMAIL</th>
            <th>MOBILE NUMBER</th>
            <th>PAYMENT MODE</th>
            <th>PRICE</th>
            <th>ADDRESS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((item) => (
            item.purchases.map((items) => (
              <tr key={items._id}>
                <td>{items.productid}</td>
                <td>{item.useremail}</td>
                <td>{items.phoneNumber}</td>
                <td>{items.paymentMode}</td>
                <td>{items.price}</td>
                <td>{items.address}</td>
                <td>
                  <button onClick={()=>{handleDelivered(items._id,item.useremail)}} >
                    DELIVERED <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-truck" viewBox="0 0 16 16">
                      <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Orders;
