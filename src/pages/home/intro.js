import { ReactComponent as Search } from "assets/svgs/search.svg";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { handleSubmit, register, reset } = useForm({
    defaultValues: { "search-bar-frossh": "" },
  });

  const onSubmit = (values) => {
    reset();
    navigate(`/filterpage?title=${values["search-bar-frossh"]}`);
  };

  const searchBar = (
    <div className="search-bar">
      <input
        type="text"
        placeholder={t("search")}
        {...register("search-bar-frossh", { required: true })}
      />
      <button type="submit">
        <Search />
      </button>
    </div>
  );

  return (
    <div className="intro">
      <div className="content">
        <h2 className="title"> {t("intro_title")} !</h2>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          {searchBar}
        </form>
      </div>
    </div>
  );
};

export default Intro;
