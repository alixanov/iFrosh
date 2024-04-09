/* eslint-disable react/prop-types */
import { useState, useRef, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { set, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  setError
) => {
  setActiveIndex((index) => index - 1);
  element?.current?.classList?.add("this-removed");
  setTimeout(() => {
    seTimgFiles((files) => {
      const arr = files.filter((item) => item.id !== image.id);
      !arr?.length && setError("photo");
      return arr;
    });
  }, 500);
};

export const ImageRow = ({ image, seTimgFiles, setActiveIndex, setError }) => {
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
          handleRemoveImage(image, ref, seTimgFiles, setActiveIndex, setError);
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
                setError
              )
            }
          />
          <img src={image.path} alt={`uploaded-img ${image.id}`} />
          <p className="file-size">{formatFileSize(image.size)}</p>
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

const CreateAnnouncement = () => {
  const {
    t,
    i18n: { language: lang },
  } = useTranslation();
  const user = useStoreState("user");
  const navigation = useNavigate();
  const [imgFiles, seTimgFiles] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [keyCounter, setKeyCounter] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [resultStatus, setResultStatus] = useState(null);
  const [location, setLocation] = useState({
    lat: 40.98,
    lng: 71.58,
  });
  const [mapsArray, setMapArray] = useState([]);

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
    setLoading(true);
    const data = { ...values, photo: imgFiles?.map(({ file }) => file) };
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
      return formData.append(key, data[key]);
    });
    setLoading(true);
    axios
      .post("https://api.frossh.uz/api/announcement/create", formData, {
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
                ].find((item) => item.value === watch("place_type"))?.label
              }
            />
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
                ].find((item) => item.value === watch("repair_type"))?.label
              }
            />
            <Select
              error={errors["sale_type"]}
              name={"sale_type"}
              label={t("select_type_sale")}
              options={[
                {
                  value: "sale",
                  label: t("sell"),
                },

                {
                  value: "rent",
                  label: t("rent_out"),
                },
              ].filter(Boolean)}
              control={control}
              required
              defaultValue={
                [
                  { value: "sale", label: t("sell") },
                  { value: "rent", label: t("rent_out") },
                ].find((item) => item.value === watch("sale_type"))?.label
              }
            />
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
                      />
                      <Checkbox
                        type="radio"
                        label={t("yoq")}
                        value="0"
                        required
                        name="advance"
                        error={errors["advance"]}
                        register={register}
                      />
                    </div>
                  </div>
                  {watch("advance") === "1" ? (
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
                    value="1"
                    required
                    name="bargain"
                    error={errors["bargain"]}
                    register={register}
                  />
                  <Checkbox
                    type="radio"
                    label={t("not_exist")}
                    value="0"
                    required
                    name="bargain"
                    error={errors["bargain"]}
                    register={register}
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
                        label={item[`name_${lang}`]}
                        register={register}
                      />
                    ))
                  : t(" Nothingfound")}
              </div>
            </div>
            <h3 className="h3 mt-30">{t("where")}*</h3>
            <div
              className={mapsArray.length > 1 ? "address-row" : "inputs-row"}
            >
              {mapsArray?.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="edit-address"
                    onClick={() => setMapArray([])}
                  >
                    {t("write")}
                  </button>
                  <Select
                    label={getValues("address")}
                    loading={isLoading}
                    name={"address"}
                    options={mapsArray.map((map) => ({
                      label: String(map?.formatted)?.replace(
                        "unnamed road,",
                        ""
                      ),
                      value: map?.geometry,
                    }))}
                    onSelect={(value, { label }) => {
                      setValue("address", label);
                      setValue("latitude", value?.lat);
                      setValue("longitude", value?.lng);
                      setLocation(value);
                      setMapArray([]);
                    }}
                  />
                </>
              ) : (
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
                  {isLoading && <LoadingIcon />}
                </label>
              )}
            </div>
            <div className="mt-30">
              <MapContainer
                address={address}
                setValue={setValue}
                location={location}
                onSelect={() => setMapArray([])}
                setLoading={setIsLoading}
              />
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
          onClick={() => {
            if (!imgFiles.length) {
              setError("photo");
            }
          }}
        >
          <span>{t("save")}</span>
          <Save />
        </button>
      </form>
    </>
  );
};

export default CreateAnnouncement;
