import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import noProfileInfoImg from "./warningUser.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStoreState } from "../../redux/selectors";

export default function UserDashboard() {
  const {
    t,
    i18n: { language: lang },
  } = useTranslation();
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [quarters, setQuarters] = useState([]);

  const profileInfo = useStoreState("user");

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${profileInfo?.token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    [profileInfo?.token]
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
    const formData = Object.fromEntries(new FormData(e.target));
    const body = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      region_id: formData.region_id,
      district_id: formData.district_id,
      quarter_id: formData.quarter_id,
      birth_date: formData.year + "-" + formData.month + "-" + formData.day,
    };

    const url = "https://api.frossh.uz/api/user/update";
    axios
      .put(url, body, { headers })
      .then((res) => {
        if (res.data.result) {
          toast.success(res.data.result);
        }
      })
      .catch((err) => console.log(err));
  };

  const monthNames = {
    uz: [
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
    ],
    ru: [
      { id: 1, name: "Январь" },
      { id: 2, name: "Февраль" },
      { id: 3, name: "Март" },
      { id: 4, name: "Апрель" },
      { id: 5, name: "Май" },
      { id: 6, name: "Июнь" },
      { id: 7, name: "Июль" },
      { id: 8, name: "Август" },
      { id: 9, name: "Сентябрь" },
      { id: 10, name: "Октябрь" },
      { id: 11, name: "Ноябрь" },
      { id: 12, name: "Декабрь" },
    ],
  };

  const birthDate = profileInfo?.birth_date?.split("-");

  return (
    <div className="person">
      {profileInfo?.id ? (
        <div className="person">
          <div className="p-left">
            <div className="p-left-top">
              <div className="user-img">
                {profileInfo?.first_name?.slice(0, 1) +
                  " " +
                  profileInfo?.last_name?.slice(0, 1)}
              </div>
              <div className="p-text-info">
                <p>{`${profileInfo?.first_name}\n${profileInfo?.last_name}`}</p>
                <span>
                  {t("your_account")}: {profileInfo?.id}
                </span>
                <b>+{profileInfo?.phone_number}</b>
              </div>
            </div>
            <form onSubmit={handleUpdateUserInfo}>
              <label>
                <p>{t("name")}</p>
                <input
                  type="text"
                  name="first_name"
                  defaultValue={profileInfo?.first_name}
                  placeholder="Name"
                />
              </label>
              <label>
                <p>{t("surname")}</p>
                <input
                  type="text"
                  name="last_name"
                  defaultValue={profileInfo?.last_name}
                  placeholder="Surname"
                />
              </label>

              <label>
                <p>{t("month")}</p>
                <div>
                  <select name="month">
                    <option value={monthNames[lang][birthDate[1] - 1].id}>
                      {monthNames[lang][birthDate[1] - 1].name}
                    </option>
                    {monthNames[lang].map((item) => (
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

              <label>
                <p> {t("viloyat")} </p>
                <select
                  name="region_id"
                  onChange={(e) => getDistrict(e.target.value)}
                >
                  <option value={profileInfo?.region?.id}>
                    {profileInfo?.region?.[`name_${lang}`]}
                  </option>
                  {regions.map((region, index) => (
                    <option value={region?.id} key={index}>
                      {region?.[`name_${lang}`]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <p> {t("shaxar")} </p>
                <select
                  name="district_id"
                  onChange={(e) => getQuarters(e.target.value)}
                >
                  <option value={profileInfo?.district?.id}>
                    {profileInfo?.district?.[`name_${lang}`]}
                  </option>
                  {districts.map((region, index) => (
                    <option value={region?.id} key={index}>
                      {region?.[`name_${lang}`]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <p>{t("street")}</p>
                <select name="quarter_id">
                  <option value={profileInfo?.quarter?.id}>
                    {profileInfo?.quarter?.[`name_${lang}`]
                      ? profileInfo?.quarter?.[`name_${lang}`]
                      : profileInfo?.quarter?.name_uz}
                  </option>
                  {quarters?.map((region, index) => (
                    <option value={region?.id} key={index}>
                      {region?.[`name_${lang}`]
                        ? region?.[`name_${lang}`]
                        : region?.name_uz}
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
