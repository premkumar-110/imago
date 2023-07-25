import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:5000/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
    console.log(user);
  }, []);
  return (
    <div className="navbar">
      {user ? (
        <>
          <ul className="list">
            <li className="listItem">
              <img
                src={user.photos[0]?.value || ''}
                alt=""
                className="avatar"
              />
            </li>
            <li className="listItem">{user.displayName}</li>
          </ul>
        </>
      ) : (
        // Render some placeholder content if user is not logged in
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
  
}

export default Home