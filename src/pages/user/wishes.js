import { useState, useCallback, useEffect } from "react";
import { Card } from "../../components/card";
import axios from "axios";
import { LoadingIcon } from "../../assets/svgs";
import noProfileInfoImg from "./warningUser.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useStoreState } from "../../redux/selectors";

const Wishes = () => {
  const user = useStoreState("user");
  const { t } = useTranslation();
  //   const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState({});
  const getAnnouncements = useCallback(() => {
    if (announcements?.data) return;
    setLoading(true);
    axios
      .get("https://api.frossh.uz/api/announcement/get-by-favorite", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
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
  }, [announcements?.data, user?.token]);

  useEffect(() => {
    getAnnouncements();
  }, [getAnnouncements]);
  return (
    <div className="cards-container">
      {loading && <LoadingIcon />}
      <div className={"cards-container my-adds"}>
        {announcements?.data?.length ? (
          announcements?.data?.map((item) => (
            <Card key={item?.id} item={item} />
          ))
        ) : loading ? null : (
          <div className="noProfileInfo">
            <img src={noProfileInfoImg} alt="noProfileInfoImg" />
            <Link to={"/"}>{t("main")}</Link>
          </div>
        )}
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
    </div>
  );
};

export default Wishes;
