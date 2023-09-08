import React from 'react'
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import '../Dashboard/Dashboard.css'
const labels = [2001, 2002, 2003, 2004, 2005];

const data = {
  labels: labels,
  datasets: [
    {
      label: "Product Sold",
      backgroundColor: "#5277F7",
      borderColor: "#5277F7",
      data: [0, 10, 5, 2, 20,],
    },
  ],
};
const Dashboard = () => {
  return (
    <div>
        <header className='CustomerHeader'>
        <div className='title'>CUSTOMER</div>
        
      </header>
        <Line data={data} className='LineChart'/>
    </div>
    
  )
}

export default Dashboard