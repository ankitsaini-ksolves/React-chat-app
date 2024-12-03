import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
    const user = useSelector((state) => state.auth.user);
    console.log("User in Redux State:", user);
  
    return (
      <div>
        <h1>Welcome, {user ? user.name : 'Guest'}!</h1>
      </div>
    );
  };
  
export default Home;
  