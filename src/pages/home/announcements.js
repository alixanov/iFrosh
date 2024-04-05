import React, { useCallback, useEffect, useState } from "react";
import { Card } from "../../components/card";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";


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
        setData([...data?.result?.top, ...data?.result?.non_top?.data]);
        seLinks(data?.result?.non_top?.links);
      })
      .catch((err) => {
        console.log(err?.response?.data?.message);
      });
  }, []);
  useEffect(() => {
    getTopAnnouncements();
  }, [getTopAnnouncements]);

  const shortLinks = useMemo(
    () =>
      links?.length
        ? [
            links[0],
            ...links?.filter((item) => {
              if (
                currentPage - 2 < item?.label &&
                item?.label < currentPage + 2
              ) {
                return item;
              }
            }),
            links[links?.length - 1],
          ].filter((item, index, array) => array?.indexOf(item) === index)
        : [],
    [links, currentPage]
  );

  return (
    <div className="container announcement">
      <h2 className="title">{t("top_announcement")}</h2>
      <div
        className={`cards-container ${
          data?.length % 4 === 1 ? "justify-between" : ""
        }`}
      >
        {data?.map((item) => (
          <Card key={item?.id} item={item} />
        ))}
      </div>
      
      {data?.length ? (
        <div className="paginations">
          {shortLinks?.map((item) => (
            <button
              dangerouslySetInnerHTML={{
                __html: item?.label
                  ?.replace(/\b(Previous|Next)\b/g, "")
                  ?.trim(),
              }}
              key={item?.label}
              onClick={() => {
                setCurrentPage(
                  item?.label === "..."
                    ? currentPage
                    : isNaN(item?.label)
                    ? Number(item?.url?.split("page=")[1])
                    : Number(item?.label)
                );
                getTopAnnouncements(item?.label === "..." ? null : item?.url);
              }}
              className={item?.active ? "active" : undefined}
              disabled={!item?.url}
            />
          ))}
        </div>
      ) : null}
      
 
    </div>
  );
};

export default Announcements;
