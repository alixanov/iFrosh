import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Person from "./info";
import "./style.css";
import MyAnnouncements from "./my-announcements";
import Payment from "./payme";
import { Announcement, Plus, User, Wishes as WishesIcon } from "assets/svgs";
import { useTranslation } from "react-i18next";
import Wishes from "./wishes";

export default function UserInfo() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="personinfo">
        <div className="personleft">
          <Routes>
            <Route index path="/" element={<Person />} />
            <Route path="/my-announcements" element={<MyAnnouncements />} />
            <Route path="/wishes" element={<Wishes />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>

        <div
          className={`personright ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <button
            className="hidden-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/profile");
              setOpen(false);
            }}
          >
            {t("private_info")} <User />
          </button>
          <button
            className="hidden-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("my-announcements");
              setOpen(false);
            }}
          >
            {t("announcement")} <Announcement />
          </button>
          <button
            className="hidden-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("wishes");
              setOpen(false);
            }}
          >
            {t("favorites")} <WishesIcon />
          </button>
          <button
            className="hidden-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("payment");
              setOpen(false);
            }}
          >
            {t("fill")}
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}
