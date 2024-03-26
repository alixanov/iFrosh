/* eslint-disable react/prop-types */
import React, { useRef, useState, memo } from 'react';
import { ArrowSelect, LoadingIcon } from 'assets/svgs';
import { useClickOutside } from 'utils';
import { Controller } from 'react-hook-form';
import './style.css';

const Select = ({ label, name, onSelect, options, defaultOpened, control, error, required, loading }) => {
  const ref = useRef();

  const handleChange = (value, onChange, setValue, setOpen, option) => {
    setValue(value);
    setOpen(false);
    onChange && onChange({ target: { value } });
    onSelect && onSelect(value, option);
  };

  const SelectComponent = ({ onChange, onBlur, value }) => {
    const [open, setOpen] = useState(defaultOpened || false);
    const [valueSelect, setValue] = useState(null);
    useClickOutside(ref, () => {
      setOpen(false);
    });
    return (
      <div ref={ref} className={`custome-select ${open ? 'opened' : ''} ${error ? 'error' : ''}`}>
        {valueSelect ? label || '' : ''}
        <button className="menu-header" onClick={() => setOpen(!open)} type="button">
          <p>{valueSelect || label}</p>
          {loading ? <LoadingIcon /> : <ArrowSelect />}
        </button>
        <div className="relative">
          <div className="options">
            {options.map((option) => (
              <div
                aria-hidden
                className="option"
                key={['number', 'string'].includes(typeof option.value) ? option.value : JSON.stringify(option.value)}
                onClick={() => handleChange(option.value, onChange, setValue, setOpen, option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
        <input type="text" hidden {...{ onChange, onBlur, value }} />
      </div>
    );
  };

  return control ? (
    <Controller
      control={control}
      rules={{ required }}
      render={({ field: { onChange, onBlur, value } }) => SelectComponent({ onChange, onBlur, value })}
      name={name}
    />
  ) : (
    <SelectComponent />
  );
};

export default memo(Select);
