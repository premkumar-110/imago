import React, { useEffect, useState } from 'react';
import { UserOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import axios from 'axios';
import '../Categories/Categories.css';

const Categories = () => {
  const [searchCustomer, setSearchCustomer] = useState('');
  const clearSearch = () => {
    setSearchCustomer('');
  };
  const [productList, setProductList] = useState([]); // Initialize as an empty array
  const [uniqueCategories, setUniqueCategories] = useState([]); // Initialize as an empty array
  const [filteredCategories, setFilteredCategories] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/getProducts');
        setProductList(response.data.response); // Set the response data to productList

        // Extract unique categories using Set
        const categoriesSet = new Set(response.data.response.map((item) => item.category));
        const uniqueCategoriesArray = [...categoriesSet];
        setUniqueCategories(uniqueCategoriesArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    // Filter categories based on searchCustomer
    const filtered = uniqueCategories.filter((category) =>
      category.toLowerCase().includes(searchCustomer.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchCustomer, uniqueCategories]);

  return (
    <>
      <header className='CustomerHeader'>
        <div className='title'>CATEGORIES</div>
        <div className='Search'>
          <Input
            className='input'
            placeholder="Search Category"
            value={searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
            prefix={<UserOutlined className="site-form-item-icon" style={{ borderRadius: 0 }} />}
          />
          <button onClick={clearSearch}>Clear</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>CATEGORY NAME</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => (
            <tr key={category}>
              <td>{index + 1}</td>
              <td>{category}</td>
              <td><button>DELETE <DeleteOutlined /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Categories;
