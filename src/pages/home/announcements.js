import React, { useCallback, useEffect, useState } from "react";
import { Card } from "../../components/card";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Announcements = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [links, seLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const getTopAnnouncements = useCallback((link) => {
    if (link === null) return;
    axios
      .get(link ? link : "https://api.frossh.uz/api/announcement/get-by-filter")
      .then(({ data }) => {
        setData(data?.result?.top);
        seLinks(data?.result?.non_top?.links);
      })
      .catch((err) => {
        console.log(err?.response?.data?.message);
      });
  }, []);
  useEffect(() => {
    getTopAnnouncements();
  }, [getTopAnnouncements]);
  return (
    <div className="container announcement">
      <h2 className="title">{t("top_announcement")}</h2>
      <div
        className={`cards-container ${
          data?.length / 4 ? "justify-between" : ""
        }`}
      >
        {data?.map((item) => (
          <Card key={item?.id} item={item} />
        ))}
      </div>
      <div className="paginations">
        {links?.map((item) => (
          <button
            dangerouslySetInnerHTML={{
              __html: item?.label?.replace(/\b(Previous|Next)\b/g, "")?.trim(),
            }}
            key={item?.label}
            onClick={() => {
              setCurrentPage(item?.label === "..." ? currentPage : item?.url);
              getTopAnnouncements(item?.label === "..." ? null : item?.url);
            }}
            className={item?.active ? "active" : undefined}
            disabled={!item?.url}
          />
        ))}
      </div>
    </div>
  );
};

export default Announcements;
