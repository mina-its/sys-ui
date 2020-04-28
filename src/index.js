import * as types from './types';
import * as main from './main';
import FormView from "./components/FormView.vue";
import NavBar from "./components/NavBar.vue";
import CheckBox from "./components/CheckBox.vue";
import Property from "./components/Property.vue";

export default {FormView, ...main, ...types, NavBar, CheckBox, Property};
