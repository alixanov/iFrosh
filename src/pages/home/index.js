import React from 'react';
import './style.css';
import Intro from './intro';
import Residentials from './residentials';
import Announcements from './announcements';

const Home = () => {
  return (
    <div className="home-container">
      <Intro />
      <Residentials />
      <Announcements />
    </div>
  );
};

export default Home;
