import Auth from "pages/auth/Auth";
import Home from "pages/home";
import Profile from "pages/user";
import Announcements from "pages/announcements";
import AnnouncementSingle from "pages/announcements/single";
import CreateAnnouncement from "pages/announcements/create";
import Filterpage from "pages/filter-pege/Filterpage";
import UpdateAnnouncement from "pages/announcements/edit";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/profile/*",
    element: <Profile />,
  },
  {
    path: "/announcements",
    element: <Announcements />,
  },
  {
    path: "/announcement/:id",
    element: <AnnouncementSingle />,
  },
  {
    path: "/announcement/:id/edit",
    element: <UpdateAnnouncement />,
  },
  {
    path: "/announcement/create",
    element: <CreateAnnouncement />,
  },
  {
    path: "/filterpage",
    element: <Filterpage />,
  },
];
