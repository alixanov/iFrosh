import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ReactComponent as Bayroq } from "assets/svgs/flagUz.svg";
import { ReactComponent as Rus } from "assets/svgs/rus.svg";
import { setUser } from "../../redux/user";
import "./style.css";
import logo from "../../assets/images/placemark.png";
import { useStoreState } from "../../redux/selectors";

const Header = ({ changeLanguage }) => {
  const { t } = useTranslation();
  const user = useStoreState("user");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [nbuData, setNbuData] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [flag, setFlag] = useState("uz");

  const Changelangheader = (e) => {
    changeLanguage(e.target.value);
    setFlag(e.target.value);
  };

  const token = Cookies.get("token");

  const getUser = useCallback(() => {
    if (!token) return;
    setLoading(true);
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
        setLoading(false);
        dispatch(setUser(data?.result));
        Cookies.set("token", data?.result?.token);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [dispatch, token]);

  useEffect(() => {
    return () => {
      getUser();
    };
  }, [getUser]);

  // usd api get
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.frossh.uz/api/nbu/show");
        setNbuData(response.data.result.nbu_cell_price);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  return (
    <div className="main-header">
      {loading && <div className="loading-page"></div>}
      <header className="container">
        <div className="h-left">
          <Link to={"/"}>
            <img src={logo} alt="" />
            Frosh
          </Link>
          <Link id="usd">
            <p>1USD-{nbuData}UZS</p>
          </Link>
        </div>
        <div className="h-right">
          {flag == "uz" ? <Bayroq /> : <Rus />}

          <select onChange={Changelangheader}>
            <option value="uz">uz</option>
            <option value="ru">ru</option>
          </select>
          <select value={selectedCurrency} onChange={handleCurrencyChange}>
            <option value="USD">USD</option>
            <option value="UZS">UZS</option>
          </select>
          <Link id="a" to={user?.id ? "/announcement/create" : "/auth"}>
            {t("create_announcement")} +
          </Link>
          <Link to={user?.id ? "/profile" : "/auth"}>
            {user?.id ? t("cabinet") : t("register")}
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Header;
