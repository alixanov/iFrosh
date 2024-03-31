import React, { useState } from "react";
import { Click, Payme } from "assets/svgs";
import "./style.css";
import { useTranslation } from "react-i18next";

const types = [
  {
    img: Click,
    type: "click",
  },
  {
    img: Payme,
    type: "payme",
  },
];

export default function Payment() {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState("click");

  const handleTypeChange = (type) => setActiveType(type);

  return (
    <div className="person">
      <div className="payme">
        <div className="overlay">{t("demo")}</div>
        <p>{t("payment_type_sel")}</p>
        <div className="payme-click">
          {types.map((payment) => (
            <button
              key={payment.type}
              onClick={() => handleTypeChange(payment.type)}
              className={
                activeType === payment.type ? "active-type" : undefined
              }
            >
              <img src={payment.img} alt={payment.type} />
            </button>
          ))}
        </div>
        <p>{t("enter_emount")}</p>
        <label >
          <input type="text" placeholder="1.000.000" />
          UZS
        </label>
        <button>{t("proceed_payment")}</button>
      </div>
    </div>
  );
}
