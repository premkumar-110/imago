import React, { useEffect, useState } from 'react';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import axios from 'axios';
import '../customers/customers.css';

const Customers = () => {
  const [searchCustomer, setSearchCustomer] = useState('');
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://imago-backend.vercel.app/admin/getUsers');
        if (Array.isArray(response.data.data)) {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data);
        } else {
          console.error('Invalid API response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getData();
  }, []);

  // Function to handle search input change
  // Function to handle search input change
const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchCustomer(searchValue);
    // Filter the users based on the search input
    const filtered = users.filter((user) =>
      (user.email && user.email.toLowerCase().includes(searchValue.toLowerCase())) ||
      (user.name && user.name.toLowerCase().includes(searchValue.toLowerCase())) ||
      (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchValue.toLowerCase())) ||
      (user.address && user.address.toLowerCase().includes(searchValue.toLowerCase()))
    );
    setFilteredUsers(filtered);
  };
  

  // Function to clear the search input
  const clearSearch = () => {
    setSearchCustomer('');
    setFilteredUsers(users);
  };

  return (
    <>
      <header className='CustomerHeader'>
        <div className='title'>CUSTOMER</div>
        <div className='Search'>
          <Input
            className='input'
            placeholder="Search Customer"
            value={searchCustomer}
            onChange={handleSearchChange}
            prefix={<UserOutlined className="site-form-item-icon" style={{ borderRadius: 0 }} />}
          />
          <button onClick={clearSearch}>Clear</button>
        </div>
      </header>
      <div>
        <table>
          <thead>
            <tr>  
              <th>Email</th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((item) => (
              <tr key={item.email}>
                <td>{item.email}</td>
                <td>{item.name}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.address}</td>
                <td>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Customers;
