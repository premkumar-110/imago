import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import '../Orders/Orders.css'
const Orders = () => {
    const [productsList, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/getPurchase');
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
      product.email.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const clearSearch = () => {
    setSearchProduct('');
    setFilteredProducts(productsList);
  };
  return (
    <>
    <header className='CustomerHeader'>
        <div className='title'>ORDERS</div>
        <div className='Search'>
          <Input
            className='input'
            placeholder="Search Orders with product Id"
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
          {filteredProducts.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.productid}</td>
                <td>{item.useremail}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.paymentMode}</td>
                <td>{item.price}</td>
                <td>{item.address}</td>
                <td>
                  <button>
                    DELETE <DeleteOutlined />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  )
}

export default Orders