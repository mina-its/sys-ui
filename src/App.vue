<template>
    <div class="d-flex h-100 flex-column">
        <header>
            <NavBar/>
        </header>
        <main class="d-flex align-items-stretch overflow-auto">
            <SideNav/>
            <ObjectView v-if="objectElem" :elem="objectElem" :level="0"/>
            <FormView v-else/>
        </main>
        <HelperObjects/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {glob} from "./main";
    import {JQuery} from "./types";
    import {ElemType} from '../../sys/src/types';

    declare let $: JQuery;

    @Component({name: "App", components: {}})
    export default class App extends Vue {
        mounted() {
            console.log(
                `%c mina framework started. %c version: ${glob.config.version} %c`,
                'background:#05B ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
                'background:#0072C6 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
                'background:transparent'
            );
            $('[data-toggle="tooltip"]').tooltip();
        }

        get objectElem() {
            if (glob.form.elems && glob.form.elems.length == 1 && glob.form.elems[0].type == ElemType.Object)
                return glob.form.elems[0];
            else
                return null;
        }
    }
</script>

<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap.scss';
    @import '../src/css/rtl';
    @import '../src/css/fonts';
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
        --main-bg: #eee;

        --font-size-base: 15px;
        --badge-padding-x: 0.25rem;

        --left: left;
        --right: right;

        --wide-props-width: 500px;
        --text-multiline-height: 150px;
    }

    $left: var(--left);
    $right: var(--right);

    .cs- {
        &obj {

        }

        &form {
            color: green;
            font-weight: 600;
        }

        &func {
            color: purple;
            font-weight: 600;
        }
    }

    html {
        height: 100%;
    }

    .rtl {
        direction: rtl;
    }

    body {
        height: 100%;
        overflow: hidden;
        font-family: Roboto, IRANSans, RobotoDraft, Calibri, Helvetica, Arial, sans-serif;
        font-size: 15px;
    }

    .table {
        width: inherit;
    }

    main {
        flex: 1 1 auto;
        scroll-behavior: smooth;
        background-color: var(--main-bg);
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

    .nav {
        padding: 0;
    }

    .no-select {
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    .toolbar {
        z-index: 1;
        background-color: white;
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .3), 0 2px 6px 2px rgba(60, 64, 67, .15);
        min-height: 3.4rem;
    }

    .separator-line {
        border-color: var(--panel-separator-line) !important;
    }

    .dropdown-menu {
        text-align: $left;
        z-index: 10000;
        #{$left}: 0;
        #{$right}: inherit;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
        border-radius: 0 0 .25rem .25rem;
        border: none !important;
        margin-top: .55rem;
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

    .user-forget-password-comment {
        display: block;
        color: gray;
        font-size: smaller;
        padding-top: 0.3rem;
    }

    .user-profile-title {
        color: red;

        a {
            color: #5a6268;
            display: inline-block;
            font-weight: 400;
            text-align: center;
            vertical-align: middle;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            border: 1px solid #5a6268;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 0.25rem;

            &:hover {
                text-decoration: none;
                color: white;
                background-color: #5a6268;
            }
        }
    }

    .function-open-page {
        margin: 4rem auto;
        background-color: white;
        padding: 2rem;
        border: 1px solid #dddfe2;
        border-radius: 3px;

        button {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
    }

    .function-login-comment {
        color: gray;
        font-size: smaller;
        padding-top: 0.3rem;

        a {
            font-size: larger;
        }
    }

    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #ccc;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    .outline-0 {
        outline: none;
    }

</style>
