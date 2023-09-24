import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import errorImage from '../images/404.svg';
import Header from '../header/header'; // Import your Header component
import './error.css'
const Error = () => {
  const navigate = useNavigate(); // Create a navigate function

  const handleMoveBack = () => {
    navigate(-1); // Use the navigate function to go back to the previous page
  };

  return (
    <>
      <Header />
      <div className='ErrorContainer'>
        <img src={errorImage} alt="Error" /> {/* Add an alt attribute for accessibility */}
        <p>Page not Found</p>
        <button onClick={handleMoveBack}>Move Back</button>
      </div>
    </>
  );
};

export default Error;
