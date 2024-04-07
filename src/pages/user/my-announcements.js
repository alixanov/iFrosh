import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useStoreState } from "../../redux/selectors";
import { Card } from "../../components/card";
import { LoadingIcon } from "../../assets/svgs";
import noProfileInfoImg from "./warningUser.png";

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
        {announcements?.data?.length ? (
          announcements?.data?.map((item) => (
            <div key={item?.id}>
              <Card item={item} editable />
            </div>
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
