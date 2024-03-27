import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { ReactComponent as Bayroq } from "assets/svgs/flagUz.svg";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/user";

const Header = ({ changeLanguage }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const Changelangheader = (e) => {
    changeLanguage(e.target.value);
  };
  const token = Cookies.get("token");

  const getUser = useCallback(() => {
    if (token) {
      axios
        .post(
          "https://api.frossh.uz/api/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(({ data }) => {
          console.log(data);
          dispatch(setUser(data?.result));
          Cookies.set("token", data?.result?.token);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token]);

  useEffect(() => {
    return () => {
      getUser();
    };
  }, [getUser]);

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
          <Link to={token ? "/profile" : "/auth"}>
            {token ? "Shaxsiy kabinet" : "Ro’yxatdan o’tish"}
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Header;
