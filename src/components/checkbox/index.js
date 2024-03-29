/* eslint-disable react/prop-types */
import { useState } from "react";
import "./style.css";
import { Checkbox as CheckboxSvg } from "assets/svgs";

const Checkbox = ({
  name,
  register,
  type = "checkbox",
  label,
  error,
  value,
  required,
  onChange,
  defaultChecked,
}) => {
  const [v, setV] = useState(value);

  return (
    <label className={`custome-checkbox ${error ? "error" : ""}`}>
      <CheckboxSvg />
      <input
        hidden
        type={type}
        value={value}
        name={name}
        {...register(name, { required })}
        onChange={(e) => {
          register(name, { required }).onChange(e);
          setV(e.target.checked);
          onChange &&
            onChange({
              [name]: value,
              checked: e.target.checked,
            });
        }}
        checked={defaultChecked}
      />
      <p>{label || name}</p>
    </label>
  );
};

export default Checkbox;
