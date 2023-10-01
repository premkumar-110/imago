import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../Dashboard/Dashboard.css';
import {
  DropboxOutlined, TagsOutlined
} from '@ant-design/icons';
import axios from 'axios';

const Dashboard = () => {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}admin/getPurchase`);
        const purchasedData = response.data.response;

        // Calculate total price and total purchased items
        let totalPrice = 0;
        let totalPurchasedItem = 0;
        purchasedData.forEach((user) => {
          user.purchases.forEach((purchase) => {
            totalPrice += purchase.price;
            totalPurchasedItem++;
          });
        });
        setTotalPurchase(totalPurchasedItem);
        setTotalPrice(totalPrice);

        // Set purchasedProducts state
        setPurchasedProducts(purchasedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Extract data for the line chart
  const data = {
    labels: purchasedProducts.map((_, index) => index), // Index from 0
    datasets: [
      {
        label: "Total Price",
        data: purchasedProducts.map((user) => {
          return user.purchases.reduce((sum, purchase) => sum + purchase.price, 0); // Total price
        }),
        backgroundColor: "#5277F7",
        borderColor: "#5277F7",
      },
    ],
  };

  // Chart options to configure y-axis label
  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: 'Total Price',
        },
      },
    },
  };

  return (
    <div>
      <header className='CustomerHeader'>
        <div className='title'>DASHBOARD</div>
      </header>
      <div className='AdminDashboardCard'>
        <div className='CardAdmin'>
          <DropboxOutlined className='DashboardLogo' />
          <div>
            <div>Total Purchases</div>
            {totalPurchase}
          </div>
        </div>
        <div className='CardAdmin'>
          <TagsOutlined className='DashboardLogo' />
          <div>
            <div>Total Price</div>
            {totalPrice}
          </div>
        </div>
      </div>
      <Line data={data} options={options} className='LineChart' />
    </div>
  );
}

export default Dashboard;
