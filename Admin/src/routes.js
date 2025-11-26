import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import SliderSectionView from "layouts/Slider-section";
import AddSlider from "layouts/Slider-section/AddSlider";
import EditSlider from "layouts/Slider-section/EditSlider";

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
    name: "Slider section",
    key: "Slider-section",
    icon: <CardGiftcardIcon />,
    route: "/Slider-section",
    component: <SliderSectionView />,
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
    route: "/AddSlider",
    component: <AddSlider />,
  },
  {
    route: "/EditSlider/:id",
    component: <EditSlider />,
  },
];

export default routes;
