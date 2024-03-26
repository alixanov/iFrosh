import React, { useState } from 'react';
import { Click, Payme } from 'assets/svgs';
import './style.css';

const types = [
  {
    img: Click,
    type: 'click'
  },
  {
    img: Payme,
    type: 'payme'
  }
];

export default function Payment() {
  const [activeType, setActiveType] = useState('click');

  const handleTypeChange = (type) => setActiveType(type);

  return (
    <div className="container person">
      <div className="payme">
        <p>To’lov turini tanlang</p>
        <div className="payme-click">
          {types.map((payment) => (
            <button
              key={payment.type}
              onClick={() => handleTypeChange(payment.type)}
              className={activeType === payment.type ? 'active-type' : undefined}
            >
              <img src={payment.img} alt={payment.type} />
            </button>
          ))}
        </div>
        <p>To’lov summasini kriting</p>
        <label htmlFor="">
          <input type="text" placeholder="1.000.000" />
          UZS
        </label>
        <button>To’lovga o’tish</button>
      </div>
    </div>
  );
}
