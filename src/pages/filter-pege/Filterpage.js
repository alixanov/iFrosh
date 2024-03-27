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

import "./style.css";
import { useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";

export default function Filterpage() {
  const [amenities, setAmenities] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  console.log(openFilter);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const search = new URLSearchParams(location.search);

  // Convert URLSearchParams object to an array of [key, value] pairs
  const paramsArray = Array.from(search.entries());

  // Convert array of [key, value] pairs to an object
  const params = Object.fromEntries(paramsArray);
  const maxPrice = useMemo(
    () =>
      announcements?.data?.sort((a, b) => b?.price - a?.price)[0]?.price || 5,
    [announcements]
  );
  const minPrice = useMemo(() => {
    if (announcements?.data?.length > 1) {
      return (
        announcements?.data?.sort((a, b) => a?.price - b?.price)[0]?.price || 0
      );
    }
    return 0;
  }, [announcements]);
  const maxM2 = useMemo(
    () => announcements?.data?.sort((a, b) => b?.m2 - a?.m2)[0]?.m2 || 5,
    [announcements]
  );
  const minM2 = useMemo(() => {
    if (announcements?.data?.length > 1) {
      return announcements?.data?.sort((a, b) => a?.m2 - b?.m2)[0]?.m2 || 0;
    }
    return 0;
  }, [announcements]);

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
    return () => {
      getAminites();
    };
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
      m2: [0, 5],
      price: [0, 5],
    },
  });

  const onSubmit = (values) => console.log(values);

  const handleFirstInputChange = (e, name, paramName) => {
    const value = parseInt(Number(e.target.value));
    const currentValues = watch(name);
    const newValue = [
      value < currentValues[1] - 3 ? value : currentValues[1] - 3,
      currentValues[1],
    ];
    setValue(name, newValue);
    paramName && setSearchParams({ ...desiredObject, [paramName]: value });
  };

  const handleSecondInputChange = (e, name, paramName) => {
    const value = Number(e.target.value);
    const currentValues = watch(name);
    const newValue = [
      currentValues[0],
      value > currentValues[0] + 3 ? value : currentValues[0] + 3,
    ];
    setValue(name, newValue);
    paramName && setSearchParams({ ...desiredObject, [paramName]: value });
  };

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
        `https://api.frossh.uz/api/announcement/get-by-filter${location.search}`
      )
      .then(({ data }) => {
        setLoading(false);
        setAnnouncements(data?.result?.nonTop);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [location.search]);

  useEffect(() => {
    if (!watch("m2")[0] || !watch("price")[0]) {
      setValue("price", [minPrice, maxPrice]);
      setValue("m2", [minM2, maxM2]);
    }
  }, [minPrice, maxPrice, minM2, maxM2, setValue, watch]);
  const region_id = watch("region_id");
  useEffect(() => {
    region_id &&
      setSearchParams((ee) => ({
        ...Object.fromEntries(Array.from(ee.entries())),
        region_id,
      }));
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
        label: "Kvartira",
      },
      {
        value: "home",
        label: "Xonadon",
      },
      {
        value: "dry land",
        label: "Quruq yer",
      },
      {
        value: "business place",
        label: "Biznes uchun joy",
      },
      {
        value: "skyscraper",
        label: "Turar joy majmuasi",
      },
    ],
    repair_types = [
      {
        value: "bad",
        label: "Yomon",
      },
      {
        value: "good",
        label: "O’rtacha",
      },
      {
        value: "new",
        label: "Yaxshi",
      },
    ],
    sortes = [
      {
        value: "popular",
        label: "Ommabop",
      },
      {
        value: "cheap",
        label: "Arzonroq",
      },
      {
        value: "expensive",
        label: "Qimmatroq",
      },
    ];

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
            !openFilter
              ? { transform: "translateX(-100%)" }
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
              label={"Saralash"}
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
                label={"Joy turini tanlang"}
                options={place_types}
                control={control}
                required
              />
            </div>

            {/* <div className="input-progress">
              <p>Hajmi</p>
              <div className="input-size">
                <input
                  type="number"
                  onChange={(e) => handleFirstInputChange(e, "m2")}
                  placeholder="dan"
                  value={watch("m2")[0]}
                />
                <input
                  type="number"
                  onChange={(e) => handleSecondInputChange(e, "m2")}
                  placeholder="gacha"
                  value={watch("m2")[1]}
                />
              </div>
            </div>

            <RangeSlider
              onChange={(value) => setValue("m2", value)}
              value={watch("m2")}
              aria-label={"['min', 'max']"}
              className="range-slider"
              max={maxM2}
              min={minM2}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} bg={"#0085AF"} />
              <RangeSliderThumb index={1} bg={"#0085AF"} />
            </RangeSlider> */}
            <div className="input-progress">
              <p>Narxi</p>
              <div className="input-size">
                <input
                  type="number"
                  onChange={(e) =>
                    handleFirstInputChange(e, "price", "price_from")
                  }
                  placeholder="dan"
                  value={watch("price")[0]}
                />
                <input
                  type="number"
                  onChange={(e) =>
                    handleSecondInputChange(e, "price", "price_to")
                  }
                  placeholder="gacha"
                  value={watch("price")[1]}
                />
              </div>
            </div>
            <RangeSlider
              max={maxPrice}
              min={minPrice}
              aria-label={"['min', 'max']"}
              onChange={(value) => {
                setValue("price", value);
              }}
              onChangeEnd={(value) => {
                setSearchParams({
                  ...desiredObject,
                  price_from: value[0],
                  price_to: value[1],
                });
              }}
              value={watch("price")}
              className="range-slider"
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} bg={"#0085AF"} />
              <RangeSliderThumb index={1} bg={"#0085AF"} />
            </RangeSlider>
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
              label={"Ta’mir holati"}
              options={repair_types}
              control={control}
              required
            />
            <div className="checkboxes">
              <Checkbox
                type="radio"
                name={"sale_type"}
                value={"sale"}
                label={"Sotib olish"}
                register={register}
                defaultChecked={searchParams.get("sale_type") === "sale"}
                onChange={({ sale_type }) =>
                  setSearchParams({ ...desiredObject, sale_type: sale_type })
                }
              />
              <Checkbox
                type="radio"
                name={"sale_type"}
                value={"rent"}
                label={"Ijaraga olish"}
                register={register}
                defaultChecked={searchParams.get("sale_type") === "rent"}
                onChange={({ sale_type }) =>
                  setSearchParams({ ...desiredObject, sale_type: sale_type })
                }
              />
            </div>
            <AccordionDynamicHeight
              defaultOpened={!!searchParams.get("region_id")}
              classes={{ header: "header-acc" }}
              header={
                <>
                  <p>Viloyatlar</p>
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
                      label={item.name_uz}
                      register={register}
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
                  <p>Qo`shimcha qulayliklar</p>
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
                      label={item?.name_uz}
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
                {"E'lonlar topilmadi"}
                <NotFound />
              </h3>
            )}
          </div>
          <div className="paginations">
            {announcements?.links?.map((item) => (
              <button
                key={item?.label}
                dangerouslySetInnerHTML={{
                  __html: item?.label
                    ?.replace(/\b(Previous|Next)\b/g, "")
                    ?.trim(),
                }}
                onClick={() =>
                  setSearchParams({
                    ...desiredObject,
                    page: item?.url?.split("=")[1],
                  })
                }
                className={item?.active ? "active" : undefined}
                disabled={!item?.url || !announcements?.data?.length}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
