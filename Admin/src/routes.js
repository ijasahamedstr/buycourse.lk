import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import Promotionalgiftssection from "layouts/Promotional-gifts-section";
import AddPromotionalgifts from "layouts/Promotional-gifts-section/AddPromotionalgifts";

// @mui icons
import Icon from "@mui/material/Icon";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import EditPromotionalgifts from "layouts/Promotional-gifts-section/EditPromotionalgifts";
import PrintingDepartment from "layouts/Printing-Department-Section";
import PrintIcon from "@mui/icons-material/Print";
import AddPrintingDepartment from "layouts/Printing-Department-Section/AddPrintingDepartment";
import EditPrintingDepartment from "layouts/Printing-Department-Section/EditPrintingDepartment";
import Screenssection from "layouts/Screens-section";
import SmartScreenIcon from "@mui/icons-material/SmartScreen";
import AddScreenssection from "layouts/Screens-section/AddScreenssection";
import EditScreenssection from "layouts/Screens-section/EditScreenssection";
import ArabicCalligraphy from "layouts/ArabicCalligraphy-section";
import TranslateIcon from "@mui/icons-material/Translate";
import AddArabicCalligraphy from "layouts/ArabicCalligraphy-section/AddArabicCalligraphy";
import EditArabicCalligraphy from "layouts/ArabicCalligraphy-section/EditArabicCalligraphy";
import Socialmediasection from "layouts/Social-media-section";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import AddSocialmediasection from "layouts/Social-media-section/AddSocialmediasection";
import EditSocialmediasection from "layouts/Social-media-section/EditSocialmediasection";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import MediaCommunicationsSection from "layouts/MediaCommunications";
import MediaCommunicationsphoto from "layouts/MediaCommunications/Photo";
import AddMediaCommunications from "layouts/MediaCommunications/Photo/AddMediaCommunications";
import EditMediaCommunications from "layouts/MediaCommunications/Photo/EditMediaCommunications";
import MediaCommunicationsvideo from "layouts/MediaCommunications/Video";
import AddMediaCommunicationsvideo from "layouts/MediaCommunications/Video/AddMediaCommunicationsvideo";
import EditMediaCommunicationsVideo from "layouts/MediaCommunications/Video/EditMediaCommunicationsvideo";
import News from "layouts/News";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import AddNews from "layouts/News/AddNews";
import EditNews from "layouts/News/EditNews";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import Partner from "layouts/partner";
import AddPartner from "layouts/partner/AddPartner";
import EditPartner from "layouts/partner/EditPartner";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Promotional gifts section",
    key: "Promotional-gifts-section",
    icon: <CardGiftcardIcon />,
    route: "/Promotional-gifts-section",
    component: <Promotionalgiftssection />,
  },
  {
    type: "collapse",
    name: "PrintingDepartment",
    key: "PrintingDepartment",
    icon: <PrintIcon />,
    route: "/PrintingDepartment",
    component: <PrintingDepartment />,
  },
  {
    type: "collapse",
    name: "Screenssection",
    key: "Screenssection",
    icon: <SmartScreenIcon />,
    route: "/Screenssection",
    component: <Screenssection />,
  },
  {
    type: "collapse",
    name: "ArabicCalligraphy",
    key: "ArabicCalligraphy",
    icon: <TranslateIcon />,
    route: "/ArabicCalligraphy",
    component: <ArabicCalligraphy />,
  },
  {
    type: "collapse",
    name: "Socialmediasection",
    key: "Socialmediasection",
    icon: <Diversity2Icon />,
    route: "/Socialmediasection",
    component: <Socialmediasection />,
  },
  {
    type: "collapse",
    name: "Media Communications",
    key: "MediaCommunications",
    icon: <NotStartedIcon />,
    route: "/MediaCommunications",
    component: <MediaCommunicationsSection />,
  },
  {
    type: "collapse",
    name: "News",
    key: "News",
    icon: <NewspaperIcon />,
    route: "/News",
    component: <News />,
  },
  {
    type: "collapse",
    name: "Partner",
    key: "Partner",
    icon: <SensorOccupiedIcon />,
    route: "/Partner",
    component: <Partner />,
  },
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    route: "/Add-Promotional-gifts-section",
    component: <AddPromotionalgifts />,
  },
  {
    route: "/Edit-Promotional-gifts-section/:id",
    component: <EditPromotionalgifts />,
  },
  {
    route: "/Add-PrintingDepartment",
    component: <AddPrintingDepartment />,
  },
  {
    route: "/Edit-PrintingDepartment/:id",
    component: <EditPrintingDepartment />,
  },
  {
    route: "/Add-Screenssection",
    component: <AddScreenssection />,
  },
  {
    route: "/Edit-Screenssection/:id",
    component: <EditScreenssection />,
  },
  {
    route: "/Add-ArabicCalligraphy",
    component: <AddArabicCalligraphy />,
  },
  {
    route: "/Edit-ArabicCalligraphy/:id",
    component: <EditArabicCalligraphy />,
  },
  {
    route: "/Add-Socialmediasection",
    component: <AddSocialmediasection />,
  },
  {
    route: "/Edit-Socialmediasection/:id",
    component: <EditSocialmediasection />,
  },
  {
    route: "/MediaCommunications-photo-section",
    component: <MediaCommunicationsphoto />,
  },
  {
    route: "/Add-MediaCommunications-photo-section",
    component: <AddMediaCommunications />,
  },
  {
    route: "/Edit-MediaCommunications-photo-section/:id",
    component: <EditMediaCommunications />,
  },
  {
    route: "/MediaCommunications-video-section",
    component: <MediaCommunicationsvideo />,
  },
  {
    route: "/Add-MediaCommunications-video-section",
    component: <AddMediaCommunicationsvideo />,
  },
  {
    route: "/Edit-MediaCommunications-video-section/:id",
    component: <EditMediaCommunicationsVideo />,
  },
  {
    route: "/Add-News",
    component: <AddNews />,
  },
  {
    route: "/Edit-News/:id",
    component: <EditNews />,
  },
  {
    route: "/Add-Partner",
    component: <AddPartner />,
  },
  {
    route: "/Edit-Partner/:id",
    component: <EditPartner />,
  },
];

export default routes;
