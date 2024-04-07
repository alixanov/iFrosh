/* eslint-disable react/prop-types */
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
  console.log(image, "image.id");
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
      toast.error("10 tadan ko'p rasmlar tanlash mumkin emas!");
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
          advance_month: data?.result?.announcement?.advance_month,
          room_floor: data?.result?.announcement?.room_floor,
          room_count: data?.result?.announcement?.room_count,
          construction_year: data?.result?.announcement?.construction_year,
          address: data?.result?.announcement?.address,
          latitude: data?.result?.announcement?.latitude,
          longitude: data?.result?.announcement?.longitude,
          amenities: data?.result?.announcement?.amenities?.map((am) => am?.id),
        });
        seTimgFiles(
          data?.result?.announcement?.images?.map((photo) => ({
            id: photo?.id,
            path: `https://api.frossh.uz/${photo?.path}`,
          }))
        );
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
      advance_month: "",
      room_floor: "",
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
    setLoading(true);
    const data = {
      id,
      ...defaultValues,
      photo: imgFiles?.filter(({ file }) => file)?.map(({ file }) => file),
      removedImages: removedImages,
      _method: "PUT",
    };
    delete data.place_type;
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
      if (key === "price") {
        return formData.append(
          key,
          data[key][user?.currency?.code?.toLowerCase()]
        );
      }
      return formData.append(key, data[key]);
    });
    setLoading(true);
    axios
      .put("https://api.frossh.uz/api/announcement/update", formData, {
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

  return (
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
                    ? () =>
                        toast.error(
                          "10 tadan ko'p rasmlar tanlash mumkin emas!"
                        )
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
            {defaultValues?.place_type ? (
              <Select
                error={errors["place_type"]}
                name={"place_type"}
                label={t("select_place_type")}
                options={[
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
                    label: t("majmuo"),
                  },
                ]}
                control={control}
                required
                defaultValue={
                  [
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
                      label: t("majmuo"),
                    },
                  ].find((item) => item.value === defaultValues?.place_type)
                    .label
                }
              />
            ) : null}
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
              />
            ) : null}
            {defaultValues?.sale_type ? (
              <Select
                defaultOpened
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
                      label={"Oyni tanlash"}
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
                      defaultValue={defaultValues?.advance_month}
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
                  {place_type === "dry land" ? null : (
                    <Select
                      error={errors["construction_year"]}
                      name={"construction_year"}
                      label={t("year_built")}
                      options={Array.from({ length: 25 }, (_, i) => ({
                        label: 2000 + i,
                        value: 2000 + i,
                      }))}
                      control={control}
                      required
                      defaultValue={defaultValues?.construction_year}
                    />
                  )}
                  {place_type === "dry land" ? null : (
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
                        label={item?.name_uz}
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
        <button
          className={`sender-btn mt-30 ${
            place_type === "skyscraper" ? "disabled" : ""
          }`}
          disabled={place_type === "skyscraper"}
        >
          <span>{t("save")}</span>
          <Save />
        </button>
      </form>
    </>
  );
};

export default UpdateAnnouncement;
