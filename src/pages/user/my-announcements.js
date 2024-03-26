import { useState, useCallback, useEffect } from "react";
import { Card } from "../../components/card";
import axios from "axios";
import { LoadingIcon } from "../../assets/svgs";
import Cookies from "js-cookie";

const MyAnnouncements = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const getAnnouncements = useCallback(() => {
    if (announcements?.data) return;
    setLoading(true);
    axios
      .get("https://api.frossh.uz/api/announcement/get-by-user", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setAnnouncements(data?.result);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err, "err");
      });
  }, [announcements?.data]);

  useEffect(() => {
    return () => {
      getAnnouncements();
    };
  }, [getAnnouncements]);
  return (
    <>
      {loading && <LoadingIcon />}
      <div className={"cards-container my-adds"}>
        {announcements?.data?.map((item) => (
          <Card key={item?.id} item={item} editable />
        ))}
      </div>
      <div className="paginations">
        {announcements?.links?.map((item) => (
          <button
            dangerouslySetInnerHTML={{
              __html: item?.label?.replace(/\b(Previous|Next)\b/g, "")?.trim(),
            }}
            key={item?.label}
            onClick={() => setCurrentPage(item === "..." ? currentPage : item)}
            className={item?.active ? "active" : undefined}
            disabled={!item?.url}
          />
        ))}
      </div>
    </>
  );
};

export default MyAnnouncements;
