/* eslint-disable react/prop-types */
import { useState, useRef, useCallback, useEffect, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import {
  Arrow,
  Close,
  ImagePicker,
  LoadingIcon,
  Pen,
  Reload,
  Save,
} from "../../assets/svgs";
import { formatFileSize } from "../../utils";
import Select from "../../components/select";
import Checkbox from "../../components/checkbox";
import MapContainer from "../../components/ymap3";
import { useTranslation } from "react-i18next";
import { useStoreState } from "../../redux/selectors";
import "./style.css";

const handleRemoveImage = (
  image,
  element,
  seTimgFiles,
  setActiveIndex,
  setError,
  setRemovedImages
) => {
  setActiveIndex((index) => index - 1);
  element?.current?.classList?.add("this-removed");
  if (!element?.file) {
    setRemovedImages((prev) => [...prev, image?.id]);
  }
  setTimeout(() => {
    seTimgFiles((files) => {
      const arr = files.filter((item) => item.id !== image.id);
      !arr?.length && setError("photo");
      return arr;
    });
  }, 500);
};

export const ImageRow = ({
  image,
  seTimgFiles,
  setActiveIndex,
  setError,
  setRemovedImages,
}) => {
  const ref = useRef();
  const [scale, setScale] = useState(0);

  return (
    <Swiper
      direction={"vertical"}
      className="inner-slider"
      onProgress={(_, progress) => {
        setScale(progress > 1 ? 1 : progress);
      }}
      onSlideChange={(swiper) => {
        if (swiper.activeIndex === 1) {
          handleRemoveImage(
            image,
            ref,
            seTimgFiles,
            setActiveIndex,
            setError,
            setRemovedImages
          );
        }
      }}
    >
      <SwiperSlide>
        <button type="button" key={image.id} ref={ref}>
          <Close
            className="remover"
            onClick={() =>
              handleRemoveImage(
                image,
                ref,
                seTimgFiles,
                setActiveIndex,
                setError,
                setRemovedImages
              )
            }
          />
          <img src={image.path} alt={`uploaded-img ${image.id}`} />
          <p className="file-size">
            {formatFileSize(image.size || `image${image.id}`)}
          </p>
        </button>
      </SwiperSlide>
      <SwiperSlide>
        <div
          style={{ opacity: scale, scale: `${scale} 1` }}
          className="slide-trasher"
        >
          <Close style={{ opacity: Math.round(scale) }} />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

const UpdateAnnouncement = () => {
  const { id } = useParams();
  const {
    t,
    i18n: { language: lang },
  } = useTranslation();
  const user = useStoreState("user");
  const navigation = useNavigate();
  const [imgFiles, seTimgFiles] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [keyCounter, setKeyCounter] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [defaultValues, setDefaultValues] = useState({});
  const [resultStatus, setResultStatus] = useState(null);
  const [deleteAnnouncement, setDeleteAnnouncement] = useState(false);
  const [reasonState, setReasonState] = useState("");

  const sliderRef = useRef();

  const handleFileSelection = (event) => {
    clearErrors("photo");
    const selectedImages = event.target.files;
    const validFiles = Array.from(selectedImages).filter(
      (file) => file.size <= 10 * 1024 * 1024
    );
    const invalidFiles = Array.from(selectedImages).filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (invalidFiles.length > 0) {
      // 10 MB dan katta bo'lgan fayllar qo'shilgan
      toast.error(
        `${t("Quyidagi")} ${invalidFiles.map((file) => file.name).join(", ")}`
      );
    }
    setKeyCounter((prevCounter) => prevCounter + 1);
    // console.log(Array.from(selectedImages).map((file) => file.name));
    const arrayImages = Array.from(validFiles).map((path, index) => ({
      id: `unikey-${imgFiles?.length + index + URL.createObjectURL(path)}`,
      path: URL.createObjectURL(path),
      size: path.size,
      file: path,
    }));

    if ([...imgFiles, ...arrayImages].length > 10) {
      toast.error(t("max_img_length"));
      return;
    }
    seTimgFiles((files) => {
      const values = [...arrayImages, ...files];
      setActiveIndex(values.length);
      return values;
    });

    // KeyCounter ni o'zgartirish bilan input ni reset qilamiz
  };

  useEffect(() => {
    axios
      .get(`https://api.frossh.uz/api/announcement/get-by-id/${id}`)
      .then(({ data }) => {
        setDefaultValues({
          date: data?.result?.announcement?.date,
          space_size: data?.result?.announcement?.space_size,
          description: data?.result?.announcement?.description,
          price: {
            uzs: data?.result?.announcement?.price_uzs,
            usd: data?.result?.announcement?.price_usd,
          },
          place_type: data?.result?.announcement?.place_type,
          repair_type: data?.result?.announcement?.repair_type,
          sale_type: data?.result?.announcement?.sale_type,
          advance: data?.result?.announcement?.advance,
          bargain: data?.result?.announcement?.bargain,
          advance_month: data?.result?.announcement?.advance_month || "0",
          room_floor: data?.result?.announcement?.room_floor || "1",
          room_count: data?.result?.announcement?.room_count,
          construction_year: data?.result?.announcement?.construction_year,
          address: data?.result?.announcement?.address,
          latitude: data?.result?.announcement?.latitude,
          longitude: data?.result?.announcement?.longitude,
          amenities: data?.result?.announcement?.amenities?.map((am) => am?.id),
        });
        seTimgFiles(() => {
          const images = data?.result?.announcement?.images?.map((photo) => ({
            id: photo?.id,
            path: `https://api.frossh.uz/${photo?.path}`,
          }));
          setActiveIndex(images.length);
          return images;
        });
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, [id]);

  useEffect(() => {
    Object.keys(defaultValues).map((key) => {
      if (key === "amenities") {
        return defaultValues[key].map((am) =>
          setValue(key, [...getValues(key), am])
        );
      }
      if (key === "price") {
        return setValue(
          key,
          defaultValues[key][user?.currency?.code?.toLowerCase()]
        );
      }
      return setValue(key, defaultValues[key]);
    });
  }, [defaultValues, user?.currency?.code?.toLowerCase()]);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    control,
    setValue,
    watch,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      space_size: "",
      description: "",
      price: "",
      place_type: "",
      repair_type: "",
      sale_type: "",
      advance: "0",
      bargain: "",
      advance_month: "0",
      room_floor: "1",
      room_count: "",
      construction_year: "",
      address: "",
      latitude: "",
      longitude: "",
      amenities: [],
    },
  });

  const handleGetCordinate = (value) => {
    setAddress(value);
  };

  const onSubmit = (values) => {
    if (!getValues("address")) return setError("address");
    if (!imgFiles?.length) return setError("photo");

    // return console.log(values, "values");
    delete values.amenities;

    setLoading(true);
    const data = {
      id,
      ...defaultValues,
      ...values,
      photo: imgFiles?.filter(({ file }) => file)?.map(({ file }) => file),
      removedImages: removedImages,
      _method: "PUT",
    };
    delete data.place_type;
    delete data.date;
    const formData = new FormData();
    Object.keys(data).map((key) => {
      if (key === "photo") {
        return data[key].map((photo, index) =>
          formData.append(`photo[${index}]`, photo)
        );
      }
      if (key === "amenities") {
        return data[key].map((am, index) =>
          formData.append(`amenities[${index}]`, am)
        );
      }
      if (key === "removedImages") {
        return data[key].map((photo, index) =>
          formData.append(`remove_photos[${index}]`, photo)
        );
      }
      return formData.append(key, data[key]);
    });
    setLoading(true);
    axios
      .post("https://api.frossh.uz/api/announcement/update", formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      })
      .then(({ data }) => {
        setLoading(false);
        toast.success(data?.result || "Success");
        reset();
        seTimgFiles([]);
        setActiveIndex(0);
        setResultStatus("success");
        setTimeout(() => {
          navigation("/profile/my-announcements");
        }, 2000);
      })
      .catch((err) => {
        setResultStatus(err?.response?.data?.result?.[lang] || "reject");
        setLoading(false);
        console.log(err, "err");
        toast.error(err?.response?.data?.message || "Error");
      });
  };
  const place_type = watch("place_type");

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

  return user?.token ? (
    <>
      {resultStatus && (
        <div className="result-status" onClick={() => setResultStatus(null)}>
          {resultStatus === "success" ? (
            <div className="box-result">
              <Reload width={150} height={150} />
              <h3>{t("success_created")}</h3>
            </div>
          ) : (
            <div className="box-result">
              <Close width={150} height={150} />
              <h3>{t("reject_message")}</h3>
              <p>{resultStatus}</p>
            </div>
          )}
        </div>
      )}
      {deleteAnnouncement && (
        <div className="result-status">
          <div
            className="box-overlay"
            onClick={() => setDeleteAnnouncement(false)}
          />
          <div className="box-result">
            <h3>{t("delete_announcement_text")}</h3>
            {t("delete_announcement_reasons")
              .split(", ")
              .map((reason) => (
                <Checkbox
                  key={reason}
                  label={reason?.replace(
                    "{{date}}",
                    new Date(defaultValues?.date).toLocaleDateString()
                  )}
                  register={register}
                  name={"reason"}
                  defaultChecked={
                    reason?.replace(
                      "{{date}}",
                      new Date(defaultValues?.date).toLocaleDateString()
                    ) ===
                    reasonState?.replace(
                      "{{date}}",
                      new Date(defaultValues?.date).toLocaleDateString()
                    )
                  }
                  onChange={({ checked }) => {
                    setReasonState(
                      checked
                        ? reason?.replace(
                            "{{date}}",
                            new Date(defaultValues?.date).toLocaleDateString()
                          )
                        : ""
                    );
                  }}
                />
              ))}

            <input
              type="text"
              placeholder={t("delete_announcement_reason")}
              onChange={({ target: { value } }) => setReasonState(value)}
              value={reasonState?.replace(
                "{{date}}",
                new Date(defaultValues?.date).toLocaleDateString()
              )}
            />
            <button
              disabled={!reasonState}
              className="sender-btn mt-30"
              type="button"
              onClick={() => {
                setLoading(true);
                axios
                  .post(
                    `https://api.frossh.uz/api/announcement/delete`,
                    {
                      id,
                      reason: reasonState,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${user?.token}`,
                      },
                    }
                  )
                  .then(({ data }) => {
                    setLoading(false);
                    toast.success(
                      data?.result[lang]
                        ? data?.result[lang]
                        : (typeof data?.result === "string"
                            ? data?.result
                            : "Success") || "Success"
                    );
                    setDeleteAnnouncement(false);
                    navigation("/profile/my-announcements");
                  })
                  .catch((err) => {
                    setLoading(false);
                    toast.error(err?.response?.data?.message || "Error");
                    setDeleteAnnouncement(false);
                  });
              }}
            >
              <span>{t("yuborish")}</span>
              <svg
                width="83"
                height="39"
                viewBox="0 0 83 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M80.8661 0.912598H27.9362C27.0341 0.912598 26.3028 1.64387 26.3028 2.54603V5.62664H10.734C9.83186 5.62664 9.10059 6.35791 9.10059 7.26007C9.10059 8.16223 9.83186 8.8935 10.734 8.8935H26.3028V30.1065H16.9976C16.0954 30.1065 15.3641 30.8378 15.3641 31.74C15.3641 32.6421 16.0954 33.3734 16.9976 33.3734H26.3028V36.454C26.3028 37.3562 27.0341 38.0874 27.9362 38.0874H80.8661C81.7683 38.0874 82.4995 37.3562 82.4995 36.454V2.54603C82.4995 1.64387 81.7683 0.912598 80.8661 0.912598ZM76.8366 4.17946L54.4035 22.595L32.0728 4.17946H76.8366ZM29.5697 34.8207V6.34974L53.362 25.9705C53.6637 26.2192 54.0324 26.3438 54.4013 26.3438C54.7688 26.3438 55.1365 26.2202 55.4376 25.9729L79.2327 6.43927V34.8207H29.5697Z"
                  fill="white"
                />
                <path
                  d="M21.3 19.3346C21.3 18.4324 20.5687 17.7011 19.6665 17.7011H2.13343C1.23127 17.7011 0.5 18.4324 0.5 19.3346C0.5 20.2367 1.23127 20.968 2.13343 20.968H19.6664C20.5685 20.9682 21.3 20.2367 21.3 19.3346Z"
                  fill="white"
                />
                <path
                  d="M11.608 30.1067H10.735C9.83284 30.1067 9.10156 30.838 9.10156 31.7401C9.10156 32.6423 9.83284 33.3736 10.735 33.3736H11.608C12.5102 33.3736 13.2414 32.6423 13.2414 31.7401C13.2414 30.838 12.5102 30.1067 11.608 30.1067Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      <form
        className={`container announcements ${
          resultStatus ? "with-overlay" : ""
        }`}
        onSubmit={handleSubmit(onSubmit)}
      >
        {loading && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 55,
              display: "grid",
              placeContent: "center",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <LoadingIcon />
          </div>
        )}

        <div className="row">
          <div className={`space ${errors?.photo ? "empty" : ""}`}>
            <div className="inner">
              <label
                htmlFor="upload_img"
                className="file_uploader"
                aria-hidden
                onClick={
                  imgFiles.length === 10
                    ? () => toast.error(t("max_img_length"))
                    : null
                }
              >
                <ImagePicker />
                <span>{t("add_photo")}</span>
                <small>{t("img10")}</small>
                <input
                  disabled={imgFiles.length === 10}
                  key={keyCounter}
                  type="file"
                  hidden
                  id="upload_img"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelection}
                />
              </label>
              {imgFiles.length > 0 && (
                <div className="slider-wrapper">
                  <button
                    className="prev-btn"
                    type="button"
                    onClick={handlePrev}
                  >
                    <Arrow />
                  </button>

                  <Swiper
                    ref={sliderRef}
                    className="uplodaed-images"
                    slidesPerView={"auto"}
                    spaceBetween={26}
                  >
                    {imgFiles.map((image) => (
                      <SwiperSlide className="slide-item-1" key={image.id}>
                        <ImageRow
                          image={image}
                          seTimgFiles={seTimgFiles}
                          setActiveIndex={setActiveIndex}
                          setError={setError}
                          setRemovedImages={setRemovedImages}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <button
                    className="next-btn"
                    type="button"
                    onClick={handleNext}
                  >
                    <Arrow />
                  </button>
                </div>
              )}
            </div>
            <div className="progressbar">
              <div
                className="filled"
                style={{ "--percent": `${activeIndex * 10}%` }}
              ></div>
              <p className="absolute-center">{activeIndex}/10</p>
            </div>
          </div>
          <div className="between right-bar_">
            {defaultValues?.repair_type ? (
              <Select
                error={errors["repair_type"]}
                name={"repair_type"}
                label={t("repairment")}
                options={[
                  {
                    value: "bad",
                    label: t("bad"),
                  },
                  {
                    value: "good",
                    label: t("norm"),
                  },
                  {
                    value: "new",
                    label: t("good"),
                  },
                ]}
                control={control}
                required
                defaultValue={
                  [
                    {
                      value: "bad",
                      label: t("bad"),
                    },
                    {
                      value: "good",
                      label: t("norm"),
                    },
                    {
                      value: "new",
                      label: t("good"),
                    },
                  ].find((item) => item.value === defaultValues?.repair_type)
                    .label
                }
                onSelect={(value) => {
                  console.log(value);
                  setDefaultValues((prev) => ({
                    ...prev,
                    repair_type: value,
                  }));
                }}
              />
            ) : null}
            {defaultValues?.sale_type ? (
              <Select
                error={errors["sale_type"]}
                name={"sale_type"}
                label={t("select_type_sale")}
                options={[
                  {
                    value: "sale",
                    label: t("sell"),
                  },
                  place_type !== "skyscraper"
                    ? {
                        value: "rent",
                        label: t("rent_out"),
                      }
                    : null,
                ].filter(Boolean)}
                control={control}
                required
                defaultValue={
                  [
                    {
                      value: "sale",
                      label: t("sell"),
                    },
                    {
                      value: "rent",
                      label: t("rent_out"),
                    },
                  ].find((item) => item.value === defaultValues?.sale_type)
                    ?.label
                }
                onSelect={(value) => {
                  setDefaultValues((prev) => ({
                    ...prev,
                    sale_type: value,
                  }));
                }}
              />
            ) : null}
          </div>
        </div>
        {place_type !== "skyscraper" ? (
          <>
            <h3 className="h3">{t("price")}</h3>
            <div className="inputs-row align-center">
              <label
                className={`input-label ${errors["price"] ? "error" : ""}`}
              >
                <input
                  type="number"
                  placeholder="100.000.000"
                  {...register("price", { required: true })}
                />
                <span>{user?.currency?.code}</span>
                <Pen />
              </label>
            </div>
            <div className="inputs-row">
              {watch("sale_type") === "rent" ? (
                <>
                  <div className="space_left">
                    <h3 className="h3">{t("payment")}</h3>
                    <div className="checkboxes">
                      <Checkbox
                        type="radio"
                        label={t("ha")}
                        value="1"
                        required
                        name="advance"
                        error={errors["advance"]}
                        register={register}
                        defaultChecked={defaultValues?.advance === 1}
                        onChange={({ checked }) => {
                          console.log(checked, "checked");
                          setDefaultValues((prev) => {
                            return checked
                              ? { ...prev, advance: 1 }
                              : delete prev.advance && prev;
                          });
                        }}
                      />
                      <Checkbox
                        type="radio"
                        label={t("yoq")}
                        value="0"
                        required
                        name="advance"
                        error={errors["advance"]}
                        register={register}
                        defaultChecked={defaultValues?.advance === 0}
                        onChange={({ checked }) => {
                          console.log(checked, "checked");
                          setDefaultValues((prev) => {
                            return checked
                              ? { ...prev, advance: 0 }
                              : delete prev.advance && prev;
                          });
                        }}
                      />
                    </div>
                  </div>
                  {watch("advance") === 1 ? (
                    <Select
                      error={errors["advance_month"]}
                      name={"advance_month"}
                      label={t("select_month")}
                      options={[
                        {
                          value: "1",
                          label: "1",
                        },
                        {
                          value: "2",
                          label: "2",
                        },
                        {
                          value: "3",
                          label: "3",
                        },
                      ]}
                      control={control}
                      defaultValue={defaultValues?.advance_month || "0"}
                    />
                  ) : null}
                </>
              ) : null}
              <div className="space_left">
                <h3 className="h3">{t("bargain")}</h3>
                <div className="checkboxes">
                  <Checkbox
                    type="radio"
                    label={t("exist")}
                    value={"1"}
                    required
                    name="bargain"
                    error={errors["bargain"]}
                    register={register}
                    defaultChecked={defaultValues?.bargain === 1}
                    onChange={({ checked }) => {
                      setDefaultValues((prev) => {
                        return checked
                          ? { ...prev, bargain: 1 }
                          : delete prev.bargain && prev;
                      });
                    }}
                  />
                  <Checkbox
                    type="radio"
                    label={t("not_exist")}
                    value="0"
                    required
                    name="bargain"
                    error={errors["bargain"]}
                    register={register}
                    defaultChecked={defaultValues?.bargain === 0}
                    onChange={({ checked }) => {
                      setDefaultValues((prev) => {
                        return checked
                          ? { ...prev, bargain: 0 }
                          : delete prev.bargain && prev;
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-30">
              <div className="_col">
                <h3 className="h3">{t("general_info")}*</h3>
                <div className="row mt-30">
                  {["dry land"].includes(place_type) ? null : (
                    <Select
                      error={errors["construction_year"]}
                      name={"construction_year"}
                      label={t("year_built")}
                      options={Array.from({ length: 30 }, (_, i) => ({
                        label: 2000 + i,
                        value: 2000 + i,
                      }))}
                      control={control}
                      required
                      defaultValue={defaultValues?.construction_year}
                    />
                  )}
                  {["dry land"].includes(place_type) ? null : (
                    <Select
                      error={errors["room_count"]}
                      name={"room_count"}
                      label={t("rooms")}
                      options={Array.from({ length: 30 }, (_, i) => ({
                        label: 1 + i,
                        value: 1 + i,
                      }))}
                      control={control}
                      required
                      defaultValue={defaultValues?.room_count}
                    />
                  )}
                  {["apartment", "business place"].includes(place_type) ? (
                    <Select
                      error={errors["room_floor"]}
                      name={"room_floor"}
                      label={t("room_floor")}
                      options={Array.from({ length: 10 }, (_, i) => ({
                        value: i + 1,
                        label: i + 1,
                      }))}
                      control={control}
                      required
                      defaultValue={defaultValues?.room_floor}
                    />
                  ) : null}
                </div>
                <h3 className="h3 mt-30">{t("whole_place")}*</h3>
                <div className="inputs-row">
                  <label
                    className={`input-label w-220 ${
                      errors["space_size"] ? "error" : ""
                    }`}
                  >
                    <input
                      type="number"
                      placeholder="100"
                      {...register("space_size", {
                        required: true,
                        max: 50000,
                      })}
                    />
                    <span>m²</span>
                    <Pen />
                  </label>
                </div>
              </div>
            </div>
            <div className="_col mt-30">
              <h3 className="h3">{t("extra_comfort")}</h3>
              <div className="checkboxes col-2-check">
                {amenities?.length
                  ? amenities?.map((item) => (
                      <Checkbox
                        key={item?.id}
                        name={"amenities"}
                        value={item?.id}
                        label={item?.[`name_${lang}`]}
                        register={register}
                        defaultChecked={defaultValues?.amenities?.includes(
                          item?.id
                        )}
                        onChange={({ checked }) => {
                          setDefaultValues((prev) => {
                            return checked
                              ? {
                                  ...prev,
                                  amenities: [...prev.amenities, item.id],
                                }
                              : {
                                  ...prev,
                                  amenities: prev.amenities.filter(
                                    (am) => +am !== +item.id
                                  ),
                                };
                          });
                        }}
                      />
                    ))
                  : "Hech narsa topilmadi"}
              </div>
            </div>
            <h3 className="h3 mt-30">{t("where")}*</h3>
            <div className={"inputs-row"}>
              <label
                className={`input-label address ${
                  errors["address"] ? "error" : ""
                }`}
              >
                <input
                  type="text"
                  placeholder={t("where_situated_placeholder")}
                  {...register("address")}
                  onBlur={() => handleGetCordinate(getValues("address"))}
                />
              </label>
            </div>
            <div className="mt-30">
              <MapContainer address={address} setValue={setValue} />
            </div>
            <h3 className="h3 mt-30">{t("description")}*</h3>
            <div className="inputs-row">
              <label
                className={`input-label address ${
                  errors["description"] ? "error" : ""
                }`}
              >
                <textarea
                  placeholder={t("description*")}
                  {...register("description", { required: true })}
                />
              </label>
            </div>
          </>
        ) : null}
        <div className="row">
          <button
            className={`sender-btn mt-30 delete-btn`}
            type="button"
            onClick={() => setDeleteAnnouncement(true)}
          >
            <span>{t("delete_announcement")}</span>
            <svg
              width="40"
              height="49"
              viewBox="0 0 40 49"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.5232 6.14666C21.7625 6.14666 21.1458 5.53006 21.1458 4.76928V3.25466H10.6781V4.76937C10.6781 5.53006 10.0615 6.14675 9.30071 6.14675C8.53993 6.14675 7.92334 5.53016 7.92334 4.76937V1.87738C7.92343 1.11659 8.54003 0.5 9.30071 0.5H22.5232C23.2839 0.5 23.9006 1.11659 23.9006 1.87738V4.76937C23.9006 5.53006 23.2838 6.14666 22.5232 6.14666Z"
                fill="white"
              />
              <path
                d="M28.859 48.4999C23.087 48.4999 18.3911 43.8041 18.3911 38.0321C18.3911 32.26 23.0869 27.5642 28.859 27.5642C34.6311 27.5642 39.3267 32.2601 39.3267 38.0321C39.3267 43.8041 34.631 48.4999 28.859 48.4999ZM28.859 30.319C24.606 30.319 21.1459 33.7791 21.1459 38.0321C21.1459 42.285 24.606 45.7451 28.859 45.7451C33.1119 45.7451 36.5721 42.285 36.5721 38.0321C36.5721 33.7791 33.1119 30.319 28.859 30.319Z"
                fill="white"
              />
              <path
                d="M22.4082 45.8135H4.34033C3.63018 45.8135 3.03655 45.2737 2.96915 44.5667L0.214209 15.6431C0.177459 15.2569 0.30524 14.8731 0.56624 14.5859C0.827427 14.2988 1.19736 14.1353 1.5853 14.1353H30.2379C30.9986 14.1353 31.6153 14.7518 31.6153 15.5126C31.6153 16.2733 30.9987 16.89 30.2379 16.89H3.10021L5.59283 43.0588H22.4081C23.1688 43.0588 23.7855 43.6754 23.7855 44.4362C23.7855 45.197 23.1689 45.8135 22.4082 45.8135Z"
                fill="white"
              />
              <path
                d="M9.34825 40.3041C8.64634 40.3041 8.04663 39.7703 7.97875 39.0573L6.61956 24.7885C6.54756 24.0313 7.10284 23.359 7.86016 23.2868C8.61869 23.2149 9.28984 23.7701 9.36184 24.5274L10.721 38.7962C10.793 39.5534 10.2378 40.2257 9.48044 40.2979C9.436 40.3022 9.39194 40.3041 9.34825 40.3041Z"
                fill="white"
              />
              <path
                d="M23.2804 32.233C23.2351 32.233 23.1893 32.2307 23.1433 32.2263C22.3863 32.1515 21.8333 31.4771 21.9081 30.7202L22.5206 24.5226C22.5954 23.7654 23.2701 23.2134 24.0267 23.2874C24.7837 23.3622 25.3367 24.0366 25.2619 24.7935L24.6494 30.9911C24.5792 31.7018 23.98 32.233 23.2804 32.233Z"
                fill="white"
              />
              <path
                d="M28.959 30.3215C28.9543 30.3215 28.9497 30.3215 28.945 30.3215C28.9176 30.3212 28.8904 30.3204 28.8631 30.3195L28.8487 30.3191C28.0881 30.3191 27.4766 29.7025 27.4766 28.9417C27.4766 28.7094 27.5346 28.4905 27.6369 28.2985L27.9959 24.5276C28.0681 23.7704 28.7398 23.2154 29.4976 23.287C30.2548 23.3592 30.8102 24.0315 30.7382 24.7887L30.3299 29.0749C30.2625 29.7824 29.6683 30.3215 28.959 30.3215Z"
                fill="white"
              />
              <path
                d="M25.3314 42.937C24.9789 42.937 24.6263 42.8025 24.3575 42.5336C23.8196 41.9957 23.8196 41.1236 24.3575 40.5856L31.4125 33.5306C31.9504 32.9927 32.8225 32.9927 33.3605 33.5306C33.8983 34.0684 33.8983 34.9406 33.3605 35.4785L26.3054 42.5336C26.0365 42.8025 25.6839 42.937 25.3314 42.937Z"
                fill="white"
              />
              <path
                d="M32.3865 42.937C32.034 42.937 31.6814 42.8025 31.4125 42.5336L24.3575 35.4785C23.8196 34.9407 23.8196 34.0685 24.3575 33.5306C24.8953 32.9927 25.7675 32.9927 26.3054 33.5306L33.3605 40.5856C33.8983 41.1235 33.8983 41.9956 33.3605 42.5336C33.0915 42.8025 32.7389 42.937 32.3865 42.937Z"
                fill="white"
              />
            </svg>
          </button>
          <button
            className={`sender-btn mt-30 ${
              place_type === "skyscraper" ? "disabled" : ""
            }`}
            disabled={place_type === "skyscraper"}
          >
            <span>{t("save")}</span>
            <Save />
          </button>
        </div>
      </form>
    </>
  ) : (
    <Navigate to="/auth" />
  );
};

export default memo(UpdateAnnouncement);
