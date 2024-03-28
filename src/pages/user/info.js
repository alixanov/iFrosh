import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import noProfileInfoImg from "./warningUser.png";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { useStoreState } from "../../redux/selectors";

export default function UserDashboard() {
  const { t } = useTranslation();
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [quarters, setQuarters] = useState([]);

  const profileInfo = useStoreState("user");

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${Cookies.get("token")}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    []
  );

  // GET REGIONS
  useEffect(() => {
    let url = "https://api.frossh.uz/api/region/get-regions";
    axios
      .get(url, { headers })
      .then((res) => {
        if (res.data.result) {
          setRegions(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [headers]);

  // GET DISTRICTS
  const getDistrict = (id) => {
    let url = `https://api.frossh.uz/api/region/get-districts/${id}`;
    axios
      .get(url, { headers })
      .then((res) => {
        if (res.data.result) {
          setDistricts(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // GET QUARTERS
  const getQuarters = (id) => {
    let url = `https://api.frossh.uz/api/region/get-quarters/${id}`;
    axios
      .get(url, { headers })
      .then((res) => {
        if (res.data.result) {
          setQuarters(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // UPDATE USER
  const handleUpdateUserInfo = (e) => {
    e.preventDefault();
    let formData = Object.fromEntries(new FormData(e.target));
    let body = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      region_id: formData.region_id,
      district_id: formData.district_id,
      quarter_id: formData.quarter_id,
      birth_date: formData.year + "-" + formData.month + "-" + formData.day,
    };

    let url = "https://api.frossh.uz/api/user/update";
    axios
      .put(url, body, { headers })
      .then((res) => {
        if (res.data.result) {
          toast.success(res.data.result);
        }
      })
      .catch((err) => console.log(err));
  };

  const monthNames = [
    { id: 1, name: "Yanvar" },
    { id: 2, name: "Fevral" },
    { id: 3, name: "Mart" },
    { id: 4, name: "Aprel" },
    { id: 5, name: "May" },
    { id: 6, name: "Iyun" },
    { id: 7, name: "Iyul" },
    { id: 8, name: "Avgust" },
    { id: 9, name: "Sentabr" },
    { id: 10, name: "Oktabr" },
    { id: 11, name: "Noyabr" },
    { id: 12, name: "Dekabr" },
  ];

  const birthDate = profileInfo?.birth_date?.split("-");

  return (
    <div className="person">
      {profileInfo?.first_name ? (
        <div>
          <div className="p-left">
            <div className="p-left-top">
              <div className="user-img" style={{ fontSize: "3vw" }}>
                {profileInfo?.first_name?.slice(0, 1) +
                  " " +
                  profileInfo?.last_name?.slice(0, 1)}
              </div>
              <div className="p-text-info">
                <p>{profileInfo?.first_name + "." + profileInfo?.last_name}</p>
                <span>{t("your_account")}: 123456</span>
                <b>+{profileInfo?.phone_number}</b>
              </div>
            </div>
            <form onSubmit={handleUpdateUserInfo}>
              <label htmlFor="">
                <p>{t("name")}</p>
                <input
                  type="text"
                  name="first_name"
                  defaultValue={profileInfo?.first_name}
                  placeholder="Name"
                />
              </label>
              <label htmlFor="">
                <p>{t("surname")}</p>
                <input
                  type="text"
                  name="last_name"
                  defaultValue={profileInfo?.last_name}
                  placeholder="Surname"
                />
              </label>

              <label htmlFor="">
                <p>{t("month")}</p>
                <div>
                  <select name="month">
                    <option defaultValue={monthNames[birthDate[1] - 1].name}>
                      {monthNames[birthDate[1] - 1].name}
                    </option>
                    {monthNames.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    defaultValue={birthDate[0]}
                    maxLength={2}
                    name="day"
                    placeholder="day"
                  />
                  <input
                    type="number"
                    defaultValue={birthDate[2]}
                    name="year"
                    placeholder="year"
                  />
                </div>
              </label>

              <label htmlFor="">
                <p>Viloyat:</p>
                <select
                  name="region_id"
                  onChange={(e) => getDistrict(e.target.value)}
                >
                  <option defaultValue={profileInfo?.region?.name_uz}>
                    {profileInfo?.region?.name_uz}
                  </option>
                  {regions.map((region, index) => (
                    <option value={region.id} key={index}>
                      {region?.name_uz}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="">
                <p>Shahar:</p>
                <select
                  name="district_id"
                  onChange={(e) => getQuarters(e.target.value)}
                >
                  <option defaultValue={profileInfo?.district?.name_uz}>
                    {profileInfo?.district?.name_uz}
                  </option>
                  {districts.map((region, index) => (
                    <option value={region.id} key={index}>
                      {region?.name_uz}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="">
                <p>{t("street")}</p>
                <select name="quarter_id">
                  <option defaultValue={profileInfo?.quarter?.name_uz}>
                    {profileInfo?.quarter?.name_uz}
                  </option>
                  {quarters?.map((region, index) => (
                    <option value={region.id} key={index}>
                      {region?.name_uz}
                    </option>
                  ))}
                </select>
              </label>
              <button>{t("save")} </button>
            </form>
          </div>
          <div className="p-right">
            <span>{t("wer_glad")} </span>
          </div>
        </div>
      ) : (
        <div className="noProfileInfo">
          <img src={noProfileInfoImg} alt="" />
          <p>{t("must_register")}</p>
          <Link to="/auth">{t("enter_register")}</Link>
        </div>
      )}
    </div>
  );
}
