import * as types from './types';
import * as main from './main';
import FormView from "./components/FormView.vue";
import AppLocaleMenu from "./components/AppLocaleMenu.vue";
import AppUserLoginMenu from "./components/AppUserLoginMenu.vue";
import CheckBox from "./components/CheckBox.vue";
import Property from "./components/Property.vue";
import BrowseFile from "./components/BrowseFile.vue";
import ContextMenu from "./components/ContextMenu.vue";
import ToolbarModifyButtons from "./components/ToolbarModifyButtons.vue";
import HelperObjects from "./components/HelperObjects.vue";
import AppHeader from "./components/AppHeader.vue";
import App from "./App.vue";
import DashboardInfoBox from "./components/DashboardInfoBox.vue";
import AppChangeRegion from "./components/AppChangeRegion.vue";
import ImagePreview from "./components/ImagePreview.vue";
import DetailsView from "./components/DetailsView.vue";
import GridView from "./components/GridView.vue";
import Function from "./components/Function.vue";
import NavMenu from "./components/NavMenu.vue";
import LayoutDefault from "./components/LayoutDefault.vue";
import AppChart from "./components/AppChart.vue";
import SwitchBox from "./components/SwitchBox.vue";
import HeaderMenu from "./components/HeaderMenu.vue";

export default {
    FormView, ...main, ...types, CheckBox, Property, AppLocaleMenu, AppUserLoginMenu, BrowseFile, ContextMenu, LayoutDefault, SwitchBox,
    ToolbarModifyButtons, HeaderMenu, HelperObjects, AppHeader, App, DashboardInfoBox, AppChangeRegion, ImagePreview, DetailsView, GridView, Function, NavMenu, AppChart
};
