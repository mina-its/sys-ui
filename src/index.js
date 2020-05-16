import * as types from './types';
import * as main from './main';
import FormView from "./components/FormView.vue";
import NavBar from "./components/NavBar.vue";
import AppLocaleMenu from "./components/AppLocaleMenu.vue";
import AppUserLoginMenu from "./components/AppUserLoginMenu.vue";
import CheckBox from "./components/CheckBox.vue";
import Property from "./components/Property.vue";
import BrowseFile from "./components/BrowseFile.vue";
import ContextMenu from "./components/ContextMenu.vue";
import ToolbarModifyButtons from "./components/ToolbarModifyButtons.vue";
import HelperObjects from "./components/HelperObjects.vue";
import SideNav from "./components/SideNav.vue";
import App from "./App.vue";
import DashboardInfoBox from "./components/DashboardInfoBox.vue";

export default {FormView, ...main, ...types, NavBar, CheckBox, Property, AppLocaleMenu, AppUserLoginMenu, BrowseFile, ContextMenu, ToolbarModifyButtons, HelperObjects, SideNav, App, DashboardInfoBox};
