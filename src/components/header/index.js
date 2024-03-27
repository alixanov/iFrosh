import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { ReactComponent as Bayroq } from "assets/svgs/flagUz.svg";
import { useTranslation } from "react-i18next";
import Cookies from 'js-cookie';
const Header = ({ Changelang }) => {
  const { t } = useTranslation();

  const Changelangheader = (e) => {
    console.log(e.target.value);
  };
  const token = Cookies.get('token');

  return (
    <div className="main-header">
      <header className="container">
        <div className="h-left">
          <Link to={"/"}>Frosh</Link>
          <Link id="usd">1 USD | 12343,48 UZS</Link>
        </div>
        <div className="h-right">
          <Bayroq />
          <select onChange={Changelangheader}>
            <option value="uz">uz</option>
            <option value="ru">ru</option>
          </select>
          <select>
            <option>UZS</option>
          </select>
          <Link id="a" to={"/announcement/create"}>
            {t("create_announcement")} +
          </Link>
          {/* <Link to={"/auth"}>{t("register")}</Link> */}
          <Link to={token ? '/profile' : '/auth'}>{token ? 'Shaxsiy kabinet' : 'Ro’yxatdan o’tish'}</Link>
        </div>
      </header>
    </div>
  );
};

export default Header;
