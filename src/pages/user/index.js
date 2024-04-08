import React, { useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Person from "./info";
import "./style.css";
import MyAnnouncements from "./my-announcements";
import Payment from "./payme";
import { Announcement, Plus, User, Wishes as WishesIcon } from "assets/svgs";
import { useTranslation } from "react-i18next";
import Wishes from "./wishes";
import { useStoreState } from "../../redux/selectors";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/user";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Flex,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";

export default function UserInfo() {
  const user = useStoreState("user");
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${user?.token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    setOpen(false);
    dispatch(setUser({}));
    axios
      .post("https://api.frossh.uz/api/auth/logout", {}, { headers })
      .then(() => {
        Cookies.remove("token");
      })
      .catch((err) => {
        console.log(err);
      });
    navigate("/");
  };

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
            className={`hidden-button ${pathname === "/profile" && "active"}`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              navigate("/profile");
            }}
          >
            {t("private_info")} <User />
          </button>
          <button
            className={`hidden-button ${
              pathname === "/profile/my-announcements" && "active"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              navigate("my-announcements");
            }}
          >
            {t("announcement")} <Announcement />
          </button>
          <button
            className={`hidden-button ${
              pathname === "/profile/wishes" && "active"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              navigate("wishes");
            }}
          >
            {t("favorites")} <WishesIcon />
          </button>
          <button
            className={`hidden-button ${
              pathname === "/profile/payment" && "active"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              navigate("payment");
            }}
          >
            {t("fill")}
            <Plus />
          </button>
          <Popover closeOnBlur={true} closeOnEsc={true} returnFocusOnClose>
            <PopoverTrigger>
              <button className="hidden-button">
                <span>{t("logout")}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="#f50"
                >
                  <path d="m10.998 16 5-4-5-4v3h-9v2h9z"></path>
                  <path d="M12.999 2.999a8.938 8.938 0 0 0-6.364 2.637L8.049 7.05c1.322-1.322 3.08-2.051 4.95-2.051s3.628.729 4.95 2.051S20 10.13 20 12s-.729 3.628-2.051 4.95-3.08 2.051-4.95 2.051-3.628-.729-4.95-2.051l-1.414 1.414c1.699 1.7 3.959 2.637 6.364 2.637s4.665-.937 6.364-2.637C21.063 16.665 22 14.405 22 12s-.937-4.665-2.637-6.364a8.938 8.938 0 0 0-6.364-2.637z"></path>
                </svg>
              </button>
            </PopoverTrigger>
            <PopoverContent width={250}>
              <button className="hidden-button" onClick={handleLogout}>
                {t("ha")}
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
