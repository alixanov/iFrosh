import { useState, useCallback, useEffect } from "react";
import { Card } from "../../components/card";
import axios from "axios";
import { LoadingIcon } from "../../assets/svgs";
import Cookies from "js-cookie";
import noProfileInfoImg from "./warningUser.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useStoreState } from "../../redux/selectors";

const MyAnnouncements = () => {
  const user = useStoreState("user");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState({});
  const getAnnouncements = useCallback(() => {
    if (announcements?.announcements) return;
    setLoading(true);
    axios
      .get("https://api.frossh.uz/api/announcement/get-by-user", {
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
  }, [announcements?.announcements, user?.token]);

  useEffect(() => {
    getAnnouncements();
  }, [getAnnouncements]);
  return (
    <>
      {loading && <LoadingIcon />}
      <div className={"cards-container my-adds"}>
        {announcements?.announcements?.length ? (
          announcements?.announcements?.map((item) => (
            <Card key={item?.id} item={item} editable />
          ))
        ) : loading ? null : (
          <div className="noProfileInfo">
            <img src={noProfileInfoImg} alt="" />
            <Link to={"/announcement/create"}>{t("create_announcement")}</Link>
          </div>
        )}
      </div>

    </>
  );
};

export default MyAnnouncements;
