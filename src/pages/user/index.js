import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Person from './info';
import './style.css';
import MyAnnouncements from './my-announcements';
import Payment from './payme';
import { Announcement, Plus, User, Wishes } from 'assets/svgs';

export default function UserInfo() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="personinfo">
        <div className="personleft">
          <Routes>
            <Route index path="/" element={<Person />} />
            <Route path="/my-announcements" element={<MyAnnouncements />} />
            <Route path="/wishes" element={<MyAnnouncements />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>

        <div className="personright">
          <button className="hidden-button" onClick={() => navigate('/profile')}>
            Shaxsiy ma’lumotlar <User />
            
          </button>
          <button className="hidden-button" onClick={() => navigate('my-announcements')}>
            E’lonlarim <Announcement />
          </button>
          <button className="hidden-button" onClick={() => navigate('wishes')}>
            Sevimlilar <Wishes />
          </button>
          <button className="hidden-button" onClick={() => navigate('payment')}>
            To’ldirish
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}
