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
  const [currencyList, setCurrencyList] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(
    user?.currency?.code || "uzs"
  );
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
        setCurrencyList(currency_list.data?.result);
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
    setSelectedCurrency(e.target.value);
    axios
      .put(
        "https://api.frossh.uz/api/user/update",
        {
          ...user,
          currency_id: e.target.value,
        },
        { headers }
      )
      .then((_) => {
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
            dispatch(setUser(data?.result));
            Cookies.set("token", data?.result?.token);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      })
      .catch((err) => console.log(err));
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
            <p>1 USD {nbuData} UZS</p>
          </Link>
        </div>
        <div className="h-right">
          {flag == "uz" ? <Bayroq /> : <Rus />}

          <select style={{ fontSize: "25px" }} onChange={Changelangheader}>
            <option value="uz">UZ</option>
            <option value="ru">RU</option>
          </select>

          <select onChange={handleCurrencyChange}>
            {currencyList?.map((currency) => (
              <option key={currency?.id} value={currency?.id}>
                {currency?.code || "uzs"}
              </option>
            ))}
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
