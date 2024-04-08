import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "../../components/select";
import { Card } from "../../components/card";
import Checkbox from "../../components/checkbox";
import AccordionDynamicHeight from "../../components/accord";
//chakra range slayder
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";
import { ArrowSelect, LoadingIcon, NotFound, Search } from "../../assets/svgs";
import { useTranslation } from "react-i18next";
import "./style.css";
import { useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useStoreState } from "../../redux/selectors";

export default function Filterpage() {
  const user = useStoreState("user");
  const { i18n } = useTranslation();
  const [amenities, setAmenities] = useState([]);
  const [openFilter, setOpenFilter] = useState(true);
  const [announcements, setAnnouncements] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { t } = useTranslation();

  // Convert URLSearchParams object to an array of [key, value] pairs
  const paramsArray = Array.from(search.entries());

  // Convert array of [key, value] pairs to an object
  const params = Object.fromEntries(paramsArray);
  // const maxPrice = useMemo(
  //   () =>
  //     announcements?.data?.sort(
  //       (a, b) =>
  //         b?.[`price_${user?.curency?.code?.toLowerCase()}`] -
  //         a?.[`price_${user?.curency?.code?.toLowerCase()}`]
  //     )[0]?.[`price_${user?.curency?.code?.toLowerCase()}`] || 5,
  //   [announcements, user?.curency?.code]
  // );
  // const minPrice = useMemo(() => {
  //   if (announcements?.data?.length > 1) {
  //     return (
  //       announcements?.data?.sort(
  //         (a, b) =>
  //           a?.[`price_${user?.curency?.code?.toLowerCase()}`] -
  //           b?.[`price_${user?.curency?.code?.toLowerCase()}`]
  //       )[0]?.[`price_${user?.curency?.code?.toLowerCase()}`] || 0
  //     );
  //   }
  //   return 0;
  // }, [announcements, user?.curency?.code]);

  const getAminites = useCallback(() => {
    if (amenities?.length) return;
    axios
      .get("https://api.frossh.uz/api/amenity/get")
      .then(({ data }) => {
        setAmenities(data?.result);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, [amenities?.length]);

  useEffect(() => {
    getAminites();
  }, [getAminites]);
  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      repair_type: searchParams.get("repair_type") || "",
      sale_type: searchParams.get("sale_type") || "",
      place_type: searchParams.get("place_type") || "",
      region_id: searchParams.get("region_id") || "",
      sort: searchParams.get("sort") || "",
      price: [0, 5],
    },
  });

  const onSubmit = (values) => console.log(values);

  const desiredObject = useMemo(
    () =>
      Object.assign(
        {},
        ...Array.from(Object.keys(params), (obj) => ({
          [obj]: searchParams.get(obj),
        }))
      ),
    [searchParams, params]
  );
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://api.frossh.uz/api/announcement/get-by-filter${encodeURI(
          location.search
        )}`
      )
      .then(({ data }) => {
        setLoading(false);
        setAnnouncements({
          data: [...data?.result?.top, ...data?.result?.non_top?.data],
          links: data?.result?.non_top?.links,
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [location.search]);

  const region_id = watch("region_id");

  useEffect(() => {
    if (region_id) {
      setSearchParams((ee) => ({
        ...Object.fromEntries(Array.from(ee.entries())),
        region_id,
      }));
      setCurrentPage(1);
    }
  }, [region_id, setSearchParams]);

  const searchBar = (
    <div className="search-bar form">
      <input
        type="text"
        required
        placeholder="Qidirish"
        value={searchParams.get("title") || ""}
        onChange={({ target: { value } }) =>
          setSearchParams({ ...desiredObject, title: value })
        }
      />
      <button type="submit">
        {loading ? <LoadingIcon color={"#fff"} size={"34px"} /> : <Search />}
      </button>
    </div>
  );

  const place_types = [
      {
        value: "apartment",
        label: t("flat"),
      },
      {
        value: "home",
        label: t("home"),
      },
      {
        value: "dry land",
        label: t("quruq"),
      },
      {
        value: "business place",
        label: t("business_place"),
      },
      {
        value: "skyscraper",
        label: t("slider_title"),
      },
    ],
    repair_types = [
      {
        value: "bad",
        label: t("bad"),
      },
      {
        value: "good",
        label: t("good"),
      },
      {
        value: "new",
        label: t("new"),
      },
    ],
    sortes = [
      {
        value: "popular",
        label: t("popular"),
      },
      {
        value: "cheap",
        label: t("cheap"),
      },
      {
        value: "expensive",
        label: t("expensive"),
      },
    ];

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
            announcements?.links[0],
            ...announcements?.links?.filter((item) => {
              if (
                currentPage - 2 < item?.label &&
                item?.label < currentPage + 2
              ) {
                return item;
              }
            }),
            announcements?.links[announcements?.links?.length - 1],
          ].filter((item, index, array) => array?.indexOf(item) === index)
        : [],
    [announcements?.links, currentPage]
  );

  return (
    <div className="container">
      <div className="filterpage">{searchBar}</div>
      <div onClick={() => setOpenFilter(!openFilter)} className="close_filter">
        <ArrowSelect
          style={
            !openFilter
              ? { transform: "rotate(-180deg)" }
              : { transform: "rotate(0deg)" }
          }
        />
      </div>
      <div className="grid-filter">
        <div
          style={
            openFilter
              ? window.innerWidth <= 1000
                ? { transform: "translateX(-100%)" }
                : {}
              : { transform: "translateX(0px)" }
          }
          className="f-left"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Select
              defaultValue={
                sortes.find((it) => it.value === searchParams.get("sort"))
                  ?.label
              }
              onSelect={(v) => setSearchParams({ ...desiredObject, sort: v })}
              error={errors["sort"]}
              name={"sort"}
              label={t("sort")}
              options={sortes}
              control={control}
              required
            />
            <div className="checkboxes">
              <Select
                defaultValue={
                  place_types.find(
                    (it) => it.value === searchParams.get("place_type")
                  )?.label
                }
                onSelect={(v) =>
                  setSearchParams({ ...desiredObject, place_type: v })
                }
                error={errors["place_type"]}
                name={"place_type"}
                label={t("place")}
                options={place_types}
                control={control}
                required
              />
            </div>

            <div className="checkboxes">
              <Select
                defaultValue={
                  repair_types.find(
                    (it) => it.value === searchParams.get("repair_type")
                  )?.label
                }
                onSelect={(e) =>
                  setSearchParams({ ...desiredObject, repair_type: e })
                }
                error={errors["repair_type"]}
                name={"repair_type"}
                label={t("tamir")}
                options={repair_types}
                control={control}
                required
              />
            </div>
            <div className="checkboxes">
              <Checkbox
                type="radio"
                name={"sale_type"}
                value={"sale"}
                label={t("buy")}
                register={register}
                defaultChecked={searchParams.get("sale_type") === "sale"}
                onChange={({ sale_type }) =>
                  setSearchParams({ ...desiredObject, sale_type: sale_type })
                }
                onClick={() => {
                  if (searchParams.get("sale_type") === "sale") {
                    delete desiredObject["sale_type"];
                    setValue("sale_type", "");
                    setSearchParams({
                      ...desiredObject,
                    });
                  }
                }}
              />
              <Checkbox
                type="radio"
                name={"sale_type"}
                value={"rent"}
                label={t("rent")}
                register={register}
                defaultChecked={searchParams.get("sale_type") === "rent"}
                onChange={({ sale_type }) =>
                  setSearchParams({ ...desiredObject, sale_type })
                }
                onClick={() => {
                  if (searchParams.get("sale_type") === "rent") {
                    delete desiredObject["sale_type"];
                    setValue("sale_type", "");
                    setSearchParams({
                      ...desiredObject,
                    });
                  }
                }}
              />
            </div>
            <AccordionDynamicHeight
              defaultOpened={!!searchParams.get("region_id")}
              classes={{ header: "header-acc" }}
              header={
                <>
                  <p>{t("regions")}</p>
                  <ArrowSelect />
                </>
              }
              headerOpen={
                <>
                  <p>{t("close")}</p>
                  <ArrowSelect />
                </>
              }
              body={
                <div className="checkboxes fs-100">
                  {[
                    {
                      id: 1,
                      name_uz: "Qoraqalpog'iston Respublikasi",
                      name_ru: "Республика Каракалпакстан",
                    },
                    {
                      id: 2,
                      name_uz: "Andijon viloyati",
                      name_ru: "Андижанская область",
                    },
                    {
                      id: 3,
                      name_uz: "Buxoro viloyati",
                      name_ru: "Бухарская область",
                    },
                    {
                      id: 4,
                      name_uz: "Jizzax viloyati",
                      name_ru: "Джизакская область",
                    },
                    {
                      id: 5,
                      name_uz: "Qashqadaryo viloyati",
                      name_ru: "Кашкадарьинская область",
                    },
                    {
                      id: 6,
                      name_uz: "Navoiy viloyati",
                      name_ru: "Навоийская область",
                    },
                    {
                      id: 7,
                      name_uz: "Namangan viloyati",
                      name_ru: "Наманганская область",
                    },
                    {
                      id: 8,
                      name_uz: "Samarqand viloyati",
                      name_ru: "Самаркандская область",
                    },
                    {
                      id: 9,
                      name_uz: "Surxandaryo viloyati",
                      name_ru: "Сурхандарьинская область",
                    },
                    {
                      id: 10,
                      name_uz: "Sirdaryo viloyati",
                      name_ru: "Сырдарьинская область",
                    },
                    {
                      id: 11,
                      name_uz: "Toshkent viloyati",
                      name_ru: "Ташкентская область",
                    },
                    {
                      id: 12,
                      name_uz: "Farg'ona viloyati",
                      name_ru: "Ферганская область",
                    },
                    {
                      id: 13,
                      name_uz: "Xorazm viloyati",
                      name_ru: "Хорезмская область",
                    },
                    {
                      id: 14,
                      name_uz: "Toshkent shahri",
                      name_ru: "г. Ташкент",
                    },
                  ].map((item) => (
                    <Checkbox
                      key={item.id}
                      type="radio"
                      name="region_id"
                      value={item.id}
                      label={item?.[`name_${i18n.language}`]}
                      register={register}
                      onClick={() => {
                        if (+searchParams.get("region_id") === item.id) {
                          delete desiredObject["region_id"];
                          setValue("region_id", "");
                          setSearchParams({
                            ...desiredObject,
                          });
                        }
                      }}
                      defaultChecked={
                        +searchParams.get("region_id") === item.id
                      }
                    />
                  ))}
                </div>
              }
            />
            <AccordionDynamicHeight
              defaultOpened={
                !!Object.keys(desiredObject).find((item) =>
                  item.includes("Amenites")
                )
              }
              classes={{ header: "header-acc" }}
              header={
                <>
                  <p> {t("additional_comfort")} </p>
                  <ArrowSelect />
                </>
              }
              headerOpen={
                <>
                  <p>Yopish</p>
                  <ArrowSelect />
                </>
              }
              body={
                <div className="checkboxes fs-100">
                  {amenities?.map((item, i) => (
                    <Checkbox
                      key={item?.id}
                      onChange={(option) => {
                        if (option.checked) {
                          delete option.checked;
                          setSearchParams({ ...desiredObject, ...option });
                        } else if (!option.checked) {
                          delete desiredObject[`Amenites[${i}]`];
                          setSearchParams({ ...desiredObject });
                        }
                      }}
                      name={`Amenites[${i}]`}
                      value={item?.id}
                      label={item?.[`name_${i18n.language}`]}
                      register={register}
                      defaultChecked={desiredObject[`Amenites[${i}]`]}
                    />
                  ))}
                </div>
              }
            />
          </form>
        </div>
        <div
          // style={openFilter ? { opacity: 0.3 } : { opacity: 1 }}
          className="f-right personinfo"
        >
          <div
            className={"cards-container new-card-style"}
            style={
              announcements?.data?.length
                ? undefined
                : { gridTemplateColumns: "auto" }
            }
          >
            {announcements?.data?.length ? (
              announcements?.data?.map((item) => (
                <Card key={item?.id} item={item} />
              ))
            ) : loading ? null : (
              <h3 className="not-found">
                {t("elon")}
                <NotFound />
              </h3>
            )}
          </div>
          {announcements?.data?.length ? (
            <div className="paginations">
              {shortLinks?.map((item) => (
                <button
                  key={item?.label}
                  dangerouslySetInnerHTML={{
                    __html: item?.label
                      ?.replace(/\b(Previous|Next)\b/g, "")
                      ?.trim(),
                  }}
                  onClick={() => {
                    setSearchParams({
                      ...desiredObject,
                      page: item?.url?.split("=")[1],
                    });
                    setCurrentPage(
                      item?.label === "..."
                        ? currentPage
                        : isNaN(item?.label)
                        ? Number(item?.url?.split("page=")[1])
                        : Number(item?.label)
                    );
                  }}
                  className={item?.active ? "active" : undefined}
                  disabled={!item?.url || !announcements?.data?.length}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
