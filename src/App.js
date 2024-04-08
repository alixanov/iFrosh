import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { routes } from "routes";
import "global/style.css";
import Header from "components/header";
import Footer from "components/footer";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import translationuz from "localization/translationsUZ";
import translationru from "localization/translationsRU";

i18next.use(initReactI18next).init({
  resources: {
    uz: { translation: translationuz },
    ru: { translation: translationru },
  },
  lng: localStorage.getItem("i18nextLng") || "uz",
  fallbackLng: localStorage.getItem("i18nextLng") || "uz",
});

function App() {
  const { pathname } = useLocation();
  const appRef = useRef();

  // scroll to top every path change

  useEffect(() => {
    appRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);
  //uz/ru
  const Changelang = (value) => {
    i18next.changeLanguage(value);
  };

  return (
    <div className="app-container" ref={appRef}>
      <div className="space-top-container">
        <Header changeLanguage={Changelang} />
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
