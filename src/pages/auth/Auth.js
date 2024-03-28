import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OtpInput from "react-otp-input";
import Cookies from "js-cookie";
import trudemodal from "../../assets/images/tru.png";
import falsemodal from "../../assets/images/false.png";
import "./auth.css";
import { toast } from "react-toastify";
import { formatTime } from "../../utils";
import { LoadingIcon } from "assets/svgs";
import { useTranslation } from "react-i18next";
import rightimg from "../../assets/images/123.png";
import { setUser } from "../../redux/user";
import { useDispatch } from "react-redux";

export default function Auth() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [num, setNum] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [otp, setOtp] = useState("");
  const [openSelect, setOpenSelect] = useState("");
  const [step, setStep] = useState("register"); // register || login || modal-otp || modal-[success||reject]
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds - 1 <= 0 ? 0 : prevSeconds - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  //Code/verification
  const onVerificationCode = (data) => {
    setLoading(true);
    axios
      .post(
        "https://api.frossh.uz/api/auth/verify",
        {
          code: data,
          phone_number: num,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setStep("modal-success");
        dispatch(setUser(response?.data?.result));
        Cookies.set("token", response?.data?.result?.token);
      })
      .catch((error) => {
        setLoading(false);
        setStep("modal-reject");
        console.log(error);
        toast.error(error?.response?.data?.message || "Xatolik bor!");
      });
  };
  //Login
  const onLogin = (data) => {
    setLoading(true);
    axios
      .post(
        "https://api.frossh.uz/api/auth/login",
        {
          phone_number: data.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then(() => {
        setLoading(false);
        setNum(data.phone);
        setStep("modal-otp");
        setSeconds(60);
        reset();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error?.response?.data);
        toast.error(error?.response?.data?.message || "Xatolik bor!");
      });
  };
  const onResendMessage = (data) => {
    setSeconds(60);
    axios
      .post(
        "https://api.frossh.uz/api/auth/resend",
        {
          code: data,
          phone_number: num,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        toast.success(response?.data?.result || "Yuborildi");
      })
      .catch((error) => {
        console.log(error?.response?.data);
        toast.error(error?.response?.data?.message || "Xatolik bor!");
      });
  };

  const onRegister = (data) => {
    if (data.year && data.month && data.day) {
      data.date = `${data.year}-${data.month}-${data.day}`;
    }
    delete data.year;
    delete data.month;
    delete data.day;
    setLoading(true);
    axios
      .post(
        "https://api.frossh.uz/api/auth/register",
        {
          last_name: data.lastName,
          first_name: data.firstName,
          birth_date: data.date,
          phone_number: data.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        setLoading(false);
        setNum(data.phone);
        setStep("modal-otp");
        setSeconds(60);
        reset();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error?.response?.data);
        toast.error(error?.response?.data?.message || "Xatolik bor!");
      });
  };
  const request = {
    login: onLogin,
    register: onRegister,
    "modal-otp": onVerificationCode,
  };

  const onSubmit = (values) => request[step](values);

  const months = [
    {
      label: "Yanvar",
      value: "01",
      days: 31,
    },
    {
      label: "Fevral",
      value: "02",
      days: 28,
    },
    {
      label: "Mart",
      value: "03",
      days: 31,
    },
    {
      label: "Aprel",
      value: "04",
      days: 30,
    },
    {
      label: "May",
      value: "05",
      days: 31,
    },
    {
      label: "Iyun",
      value: "06",
      days: 30,
    },
    {
      label: "Iyul",
      value: "07",
      days: 31,
    },
    {
      label: "Avgust",
      value: "08",
      days: 31,
    },
    {
      label: "Sentabr",
      value: "09",
      days: 30,
    },
    {
      label: "Oktabr",
      value: "10",
      days: 31,
    },
    {
      label: "Noyabr",
      value: "11",
      days: 30,
    },
    {
      label: "Dekabr",
      value: "12",
      days: 31,
    },
  ];

  return (
    <div className="register">
      <div className="register-card">
        <div className="reg-card-left">
          <p>{step === "login" ? "Hisobga kirish" : "Ro’yxatdan o’tish"}</p>
          <img src={rightimg} alt="images-left" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="reg-card-register">
          <p>{"Ma'lumotlaringizni kiriting"}</p>
          {step !== "login" ? (
            <>
              <input
                type="text"
                placeholder="Ismingiz"
                {...register("firstName", { required: true })}
                className={errors.firstName ? "error" : ""}
              />
              <input
                type="text"
                placeholder="Familiyangiz"
                {...register("lastName", { required: true })}
                className={errors.lastName ? "error" : ""}
              />
            </>
          ) : null}
          <input
            {...register("phone", {
              required: true,
              pattern: { value: /^[0-9]{12}$/ },
            })}
            type="text"
            placeholder="998"
            className={errors.phone ? "error" : ""}
          />
          {step !== "login" ? (
            <>
              {" "}
              <div className="input-row">
                <div
                  className={openSelect === "month" ? "opened" : ""}
                  aria-hidden
                  onClick={() => setOpenSelect("month")}
                >
                  <input
                    {...register("month", { required: true })}
                    readOnly
                    type="number"
                    placeholder="mm"
                    className={errors.month ? "error" : ""}
                  />
                  <div className="options">
                    {months.map((item) => (
                      <div
                        key={item.value}
                        className="option"
                        aria-hidden
                        onClick={(e) => {
                          e.stopPropagation();
                          setValue("month", item.value);
                          clearErrors("month");
                          setOpenSelect(() => (!watch("day") ? "day" : ""));
                        }}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className={openSelect === "day" ? "opened" : ""}
                  aria-hidden
                  onClick={() =>
                    setOpenSelect(() => {
                      !watch("month") && setError("");
                      return watch("month") ? "day" : "month";
                    })
                  }
                >
                  <input
                    {...register("day", { required: true })}
                    readOnly
                    type="number"
                    placeholder="dd"
                    className={errors.day ? "error" : ""}
                  />
                  <div className="options">
                    {watch("month")
                      ? Array.from(
                          {
                            length: months.find(
                              (item) => item?.value === watch("month")
                            )?.days,
                          },
                          (_, i) => `${i + 1 < 9 ? "0" : ""}${i + 1}`
                        ).map((item) => (
                          <div
                            className="option"
                            key={item}
                            aria-hidden
                            onClick={(e) => {
                              e.stopPropagation();
                              setValue("day", item);
                              clearErrors("day");
                              setOpenSelect(() =>
                                !watch("year") ? "year" : ""
                              );
                            }}
                          >
                            {item}
                          </div>
                        ))
                      : null}
                  </div>
                </div>
                <div
                  className={openSelect === "year" ? "opened" : ""}
                  aria-hidden
                  onClick={() => setOpenSelect("year")}
                >
                  <input
                    {...register("year", { required: true })}
                    type="number"
                    readOnly
                    placeholder="yyyy"
                    className={errors.year ? "error" : ""}
                  />
                  <div className="options">
                    {Array.from(
                      { length: 60 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((item) => (
                      <div
                        className="option"
                        key={item}
                        aria-hidden
                        onClick={(e) => {
                          e.stopPropagation();
                          setValue("year", item);
                          clearErrors("year");
                          setOpenSelect("");
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <label>
                <input type="checkbox" className="oferta" required />
                <p>{t("oferta")}!</p>
              </label>
              <div className="row-link-bottom">
                {t("account")}?{" "}
                <span
                  aria-hidden
                  onClick={() => setStep("login")}
                  className="link"
                >
                  {t("login")}
                </span>
              </div>
            </>
          ) : (
            <div className="row-link-bottom">
              Hali hisob ochmadingizmi?
              <span
                aria-hidden
                onClick={() => setStep("register")}
                className="link"
              >
                Hisob ochish
              </span>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? <LoadingIcon color={"#fff"} /> : "Sms kod yuborish"}
          </button>
        </form>
      </div>

      {step.includes("modal") ? (
        <div className="modal">
          {step === "modal-otp" ? (
            <div className="modal-card">
              <p>Tasdiqlash kodini kiriting!</p>
              <OtpInput
                inputStyle={{
                  width: "77px",
                  height: "77px",
                  flexShrink: 0,
                  margin: 18,
                  borderRadius: 18,
                  fontSize: 32,
                  border: "1px solid black",
                }}
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderInput={(props) => <input {...props} required />}
              />
              <span>{formatTime(seconds)}</span>
              {seconds ? null : (
                <span>
                  Kod kelmadimi?{" "}
                  <button onClick={() => onResendMessage(otp)}>
                    Qayta yuborish
                  </button>
                </span>
              )}
              <button onClick={() => onVerificationCode(otp)}>Yuborish</button>
            </div>
          ) : (
            <div className="truecart">
              {step === "modal-success" ? (
                <>
                  <img src={trudemodal} alt="cs" />
                  <p>Siz muvaffaqiyatli ro’yxatdan o’tdingiz!</p>
                  <button onClick={() => navigate("/")}>Bosh menyu </button>
                </>
              ) : step === "modal-reject" ? (
                <>
                  <img src={falsemodal} alt="cs" />
                  <p>Hatolik yuz berdi! Keynroq urinib ko’ring</p>
                  <button onClick={() => setStep("register")}>
                    Bosh menyu
                  </button>
                </>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
