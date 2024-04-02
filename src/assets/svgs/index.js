import { ReactComponent as Exit } from "./exit-screen.svg";
import { ReactComponent as Floor } from "./floor.svg";
import { ReactComponent as Room } from "./room.svg";
import { ReactComponent as Quadrad } from "./quadrad.svg";
import { ReactComponent as Home } from "./home.svg";
import { ReactComponent as Gas } from "./gas.svg";
import { ReactComponent as Water } from "./water.svg";
import { ReactComponent as Electric } from "./electric.svg";
import { ReactComponent as Wifi } from "./wifi.svg";
import { ReactComponent as AirCondition } from "./air-condition.svg";
import { ReactComponent as Refrigerator } from "./refrigerator.svg";
import { ReactComponent as TvIcon } from "./tv.svg";
import { ReactComponent as Washing } from "./washing.svg";
import { ReactComponent as Telegram } from "./telegram.svg";
import { ReactComponent as Instagram } from "./instagram.svg";
import { ReactComponent as Fecebook } from "./fecebook.svg";
import { ReactComponent as Announcement } from "./announcement.svg";
import { ReactComponent as User } from "./user.svg";
import { ReactComponent as Wishes } from "./wishes.svg";
import { ReactComponent as Plus } from "./plus.svg";
import { ReactComponent as Search } from "./search.svg";
import { ReactComponent as ImagePicker } from "./image-picker.svg";
import { ReactComponent as Close } from "./clear-x.svg";
import { ReactComponent as Save } from "./save.svg";
import { ReactComponent as Arrow } from "./arrow.svg";
import { ReactComponent as ArrowSelect } from "./arrow-select.svg";
import { ReactComponent as Eye } from "./eye.svg";
import { ReactComponent as Pen } from "./pen.svg";
import { ReactComponent as Reload } from "./reload.svg";
import { ReactComponent as Checkbox } from "./checkbox.svg";
import { ReactComponent as NotFound } from "./404.svg";
import { ReactComponent as rus } from "./rus.svg";
import { ReactComponent as Star } from "./star.svg";

import Appstore from "assets/images/Appstore.png";
import GooglePlay from "assets/images/Googleplay.png";
import Click from "assets/images/click.png";
import Payme from "assets/images/payme.png";

// eslint-disable-next-line react/prop-types

const LoadingIcon = ({ color, size = "48px", ...props }) => (
  <span
    style={color && { "--loader-color": color, "--loader-size": size }}
    className="loader"
    {...props}
  ></span>
);

export {
  Exit,
  Floor,
  Room,
  Quadrad,
  Home,
  Gas,
  Water,
  Electric,
  Wifi,
  AirCondition,
  Refrigerator,
  TvIcon,
  Washing,
  Telegram,
  Instagram,
  Fecebook,
  Announcement,
  User,
  Wishes,
  Plus,
  Search,
  ImagePicker,
  Close,
  Save,
  Arrow,
  ArrowSelect,
  Eye,
  Pen,
  Reload,
  Checkbox,
  NotFound,
  Star,
  LoadingIcon,
  // image sources
  Appstore,
  GooglePlay,
  Click,
  Payme,
  rus,
};
