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
import logo from "../../assets/images/logo.png";
import { useStoreState } from "../../redux/selectors";
import homee from "../../assets/svgs/homee.svg";
import { useNavigate } from "react-router-dom";
import userr from "../../assets/svgs/userr.svg";
import plas from "../../assets/svgs/plus.svg";

const Header = ({ changeLanguage }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const user = useStoreState("user");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [nbuData, setNbuData] = useState(null);
  const [currencyList, setCurrencyList] = useState([]);
  const [flag, setFlag] = useState(language);
  const navigate = useNavigate();

  const Changelangheader = (e) => {
    changeLanguage(e.target.value);
    setFlag(e.target.value);
    localStorage.setItem("i18nextLng", e.target.value);
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
  }, [dispatch]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  // usd api get
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.frossh.uz/api/nbu/show");
        const currency_list = await axios.get(
          "https://api.frossh.uz/api/currency/get"
        );
        setCurrencyList(
          currency_list.data?.result?.sort((a, b) =>
            b?.code?.localeCompare(a?.code)
          )
        );
        setNbuData(response.data?.result?.nbu_cell_price);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const headers = {
    Authorization: `Bearer ${user?.token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const handleCurrencyChange = (e) => {
    dispatch(
      setUser({
        ...user,
        currency: currencyList?.find(
          (currency) => +currency?.id === +e.target?.value
        ),
      })
    );
    if (!user?.token) return;
    axios
      .put(
        "https://api.frossh.uz/api/user/update",
        {
          currency_id: e.target?.value,
        },
        { headers }
      )
      .then((_) => {
        console.log("Currency updated");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="main-header">
      {loading && <div className="loading-page"></div>}
      <header className="container">
        <div className="header-top">
          <div className="h-left">
            <Link to={"/"}>
              <img src={logo} alt="" />
            </Link>
            <Link id="usd">
              <p>1 USD {nbuData} UZS</p>
            </Link>
          </div>
          <div className="selectors">
            {flag == "uz" ? <Bayroq /> : <Rus />}

            <select
              style={{ fontSize: "100%" }}
              onChange={Changelangheader}
              value={language}
            >
              <option value="uz">
                UZ
              </option>
              <option value="ru">
                RU
              </option>
            </select>

            <select onChange={handleCurrencyChange} value={user?.currency?.id}>
              {currencyList?.map((currency) => (
                <option key={currency?.id} value={currency?.id}>
                  {currency?.code || "uzs"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="header-bottom">
          <div className="h-left">
            <Link to={"/"}>
              <img src={logo} alt="" />
            </Link>
            <Link id="usd">
              <p>1 USD {nbuData} UZS</p>
            </Link>
          </div>
          <div className="h-right">
            {flag == "uz" ? <Bayroq /> : <Rus />}

            <select
              style={{ fontSize: "100%", fontWeight: "bold" }}
              onChange={Changelangheader}
              value={language}
            >
              <option value="uz">UZ</option>
              <option value="ru">RU</option>
            </select>

            <select onChange={handleCurrencyChange} value={user?.currency?.id}>
              {currencyList?.map((currency) => (
                <option key={currency?.id} value={currency?.id}>
                  {currency?.code || "uzs"}
                </option>
              ))}
            </select>
            <Link id="a" to={user?.id ? "/announcement/create" : "/auth"}>
              {t("create_announcement")} +
            </Link>
            <Link id="b" to={user?.id ? "/profile" : "/auth"}>
              {user?.id ? t("cabinet") : t("register")}
            </Link>
          </div>
        </div>
      </header>
      <div className="mobilpage">
        <button onClick={() => navigate("/")}>
          <img src={homee} alt="" />
          <span>{t("main")}</span>
        </button>
        <button onClick={() => user?.id ? navigate("/announcement/create") : navigate('/auth')}>
          <img src={plas} alt="" />
          <span>{t("create_announcement")}</span>
        </button>
        <button onClick={() => navigate("/profile")}>
          <img id="user" src={userr} alt="" />
          <span id="kabinet">{t("cabinet")}</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
