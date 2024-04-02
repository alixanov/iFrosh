import { useState, useCallback, useEffect, useMemo } from "react";
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
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState({});
  const getAnnouncements = useCallback(
    (link) => {
      if (!link && announcements?.data) return;
      setLoading(true);
      axios
        .get(
          link
            ? link
            : "https://api.frossh.uz/api/announcement/get-by-favorite",
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        )
        .then(({ data }) => {
          setLoading(false);
          setAnnouncements(data?.result);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err, "err");
        });
    },
    [announcements?.data, user?.token]
  );

  const [currentPage, setCurrentPage] = useState(
    Number(
      isNaN(announcements?.links?.find((item) => item?.active)?.label)
        ? 1
        : announcements?.links?.find((item) => item?.active)?.label
    )
  );

  const shortLinks = useMemo(
    () =>
      announcements?.links?.length
        ? [
            announcements?.links?.[0],
            ...announcements?.links?.filter((item) => {
              if (
                currentPage - 2 < item?.label &&
                item?.label < currentPage + 2
              ) {
                return item;
              }
            }),
            announcements?.links[announcements?.links?.length - 1],
          ]?.filter((item, index, array) => array?.indexOf(item) === index)
        : [],
    [announcements?.links, currentPage]
  );
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
        {announcements?.data?.length
          ? shortLinks?.map((item) => (
              <button
                dangerouslySetInnerHTML={{
                  __html: item?.label
                    ?.replace(/\b(Previous|Next)\b/g, "")
                    ?.trim(),
                }}
                key={item?.label}
                onClick={() => {
                  item?.active
                    ? null
                    : getAnnouncements(
                        item?.label === "..." ? null : item?.url
                      );
                  setCurrentPage(
                    item?.label === "..."
                      ? currentPage
                      : isNaN(item?.label)
                      ? Number(item?.url?.split("page=")[1])
                      : Number(item?.label)
                  );
                }}
                className={item?.active ? "active" : undefined}
                disabled={!item?.url}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default Wishes;
