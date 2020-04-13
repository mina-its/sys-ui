<template>
    <div class="d-flex h-100 flex-column">
        <header>
            <NavBar></NavBar>
        </header>
        <main class="d-flex align-items-stretch overflow-auto">
            <SideNav></SideNav>
            <div class="d-flex flex-column flex-fill overflow-auto">
                <Toolbar></Toolbar>
                <FormView></FormView>
            </div>
        </main>
        <section class="helpers-section">
            <FileGallery></FileGallery>
            <div id="snackbar"></div>
            <BrowseFile></BrowseFile>
            <NotifyBox></NotifyBox>
            <WebSocket></WebSocket>
            <QuestionBox></QuestionBox>
            <ContextMenu></ContextMenu>
            <ProgressBar></ProgressBar>
            <!--  <geo-map></geo-map>-->
        </section>
    </div>
</template>

<script lang="ts">
    import SideNav from "@/components/SideNav.vue";
    import NavBar from '@/components/NavBar.vue';
    import FormElem from "@/components/FormElem.vue";
    import FileGallery from "@/components/FileGallery.vue";
    import NotifyBox from "@/components/NotifyBox.vue";
    import WebSocket from "@/components/WebSocket.vue";
    import QuestionBox from "@/components/QuestionBox.vue";
    import ContextMenu from "@/components/ContextMenu.vue";
    import Toolbar from "@/components/Toolbar.vue";
    import ProgressBar from "@/components/ProgressBar.vue";
    import BrowseFile from "@/components/BrowseFile.vue";
    import {Component, Vue} from 'vue-property-decorator';
    import {$t, hideCmenu, load, notify, glob} from "./main";
    import {Constants} from "./types";
    import {LogType, NotificationInfo} from '../../sys/src/types';
    import $ from 'jquery';
    import * as main from './main';
    import FormView from "@/components/FormView.vue";

    @Component({
        components: {
            FormView,
            BrowseFile,
            ProgressBar,
            ContextMenu,
            QuestionBox,
            WebSocket,
            NotifyBox,
            FileGallery,
            FormElem,
            Toolbar,
            SideNav,
            NavBar
        }
    })
    export default class App extends Vue {
        mounted() {
            console.log(
                `%c mina framework started. %c version: ${glob.config.version} %c`,
                'background:#05B ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
                'background:#0072C6 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
                'background:transparent'
            );
        }
    }
</script>

<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap.scss';
    @import url('https://fonts.googleapis.com/css?family=Roboto');

    :root {
        --primary: #0072C6;
        --danger: #ff4136;
        --dark: #24292e;
        --header-bg: #24292e;
        --warning: #ff7700;
        --grid-head: #f6f8fa;
        --grid-border: #d7d9dc;
        --check-box-border: #d7d9dc;
        --panel-separator-line: #dee2e6;
        --grid-row-hover: #f0f8ff;
        --grid-row-highlight: #FFC;
        --grid-row-header-highlight: #FFE;
        --form-label: #666;
        --layout-border: #ddd;
        --side-nav-bg: #2f353c;
        --side-nav-color: #fff;
        --breadcrumb-separator: #aaa;
        --link-color: #4285f4;
        --main-body-bg: #eee;

        --font-size-base: 15px;
        --badge-padding-x: 0.25rem;

        --left: left;
        --right: right;

        --wide-props-width: 500px;
        --text-multiline-height: 150px;
    }

    $left: var(--left);
    $right: var(--right);

    html {
        height: 100%;
    }

    body {
        height: 100%;
        overflow: hidden;
        text-align: $left;
        font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
        font-size: 15px;
    }

    .table {
        width: inherit;
    }

    main {
        flex: 1 1 auto;
        scroll-behavior: smooth;
    }

    input {
        &[type=date],
        &[type=time],
        &[type=datetime-local],
        &[type=month] {
            -webkit-appearance: normal;
        }
    }

    header {
        flex: 0 1 auto;

        nav {
            background-color: var(--header-bg);
        }

        .btn-toolbar {
            border-color: var(--layout-border);
        }
    }

    a {
        color: var(--link-color);

        &:hover {
            color: #0366d6;
        }

        &:focus {
            outline: none;
        }
    }

    td {
        .prop-focused {
            outline: 1px solid var(--primary);
        }
    }

    // todo: disable print
    /*#print{display:none!important;}@media print{*{display:none;}}*/

    /* Animations to fade the snackbar in and out */
    @-webkit-keyframes fadein {
        from {
            bottom: 0;
            opacity: 0;
        }
        to {
            bottom: 30px;
            opacity: 1;
        }
    }

    @keyframes fadein {
        from {
            bottom: 0;
            opacity: 0;
        }
        to {
            bottom: 30px;
            opacity: 1;
        }
    }

    @-webkit-keyframes fadeout {
        from {
            bottom: 30px;
            opacity: 1;
        }
        to {
            bottom: 0;
            opacity: 0;
        }
    }

    @keyframes fadeout {
        from {
            bottom: 30px;
            opacity: 1;
        }
        to {
            bottom: 0;
            opacity: 0;
        }
    }

    .separator-line {
        border-color: var(--panel-separator-line) !important;
    }

    .dropdown-menu {
        text-align: $left;
        z-index: 10000;
        #{$left}: 0;
        #{$right}: inherit;
    }

    .breadcrumb-item {
        font-weight: 500;

        + .breadcrumb-item {
            padding-#{$left}: 0.5rem;

            &::before {
                padding-#{$right}: 0.5rem;
                padding-#{$left}: 0;
                content: "";
            }
        }

        i {
            color: var(--breadcrumb-separator);
        }
    }

    #snackbar {
        visibility: hidden; /* Hidden by default. Visible on click */
        min-width: 250px; /* Set a default minimum width */
        margin-#{$left}: -125px; /* Divide value of min-width by 2 */
        background-color: #333; /* Black background color */
        color: #fff; /* White text color */
        text-align: center; /* Centered text */
        border-radius: 2px; /* Rounded borders */
        padding: 16px; /* Padding */
        position: fixed; /* Sit on top of the screen */
        z-index: 1; /* Add a z-index if needed */
        left: 50%; /* Center the snackbar */
        bottom: 30px; /* 30px from the bottom */

        .visible {
            visibility: visible; /* Show the snackbar */
            /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
            However, delay the fade out process for 2.5 seconds */
            -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
            animation: fadein 0.5s, fadeout 0.5s 2.5s;
        }
    }

    .fa-chevron- {
        &left:before {
            //@if var(--left) == left {
            //    content: "\f053" !important;
            //} @else {
            //    content: "\f054" !important;
            //}
        }

        &right:before {
            //@if var(--right) == right {
            //    content: "\f054" !important;
            //} @else {
            //    content: "\f053" !important;
            //}
        }
    }

    .token {
        white-space: pre;
    }

    .fade- {
        &enter-active {
            transition: opacity .1s;
        }

        &leave-active {
            transition: opacity .8s;
        }

        &enter, &leave-to {
            opacity: 0;
        }
    }

    .aside {
        position: sticky;
        top: 0;
    }

    .modal {
        .prop-comment {
            //background-color: inherit;
            //border: none;
            //padding: 0 !important;
            //color: gray;
        }
    }

    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
    }

</style>
