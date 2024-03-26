/* eslint-disable react/prop-types */
import { useState } from 'react';
import './style.css';
import { Checkbox as CheckboxSvg } from 'assets/svgs';

const Checkbox = ({ name, register, type = 'checkbox', label, error, value, required }) => {
  const [v, setV] = useState(value);
  return (
    <label className={`custome-checkbox ${error ? 'error' : ''}`}>
      <CheckboxSvg />
      <input
        hidden
        type={type}
        value={type === 'checkbox' ? v : value}
        name={name}
        {...register(name, { required })}
        onChange={(e) => {
          register(name, { required }).onChange(e);
          setV(e.target.checked);
        }}
      />
      <p>{label || name}</p>
    </label>
  );
};

export default Checkbox;
