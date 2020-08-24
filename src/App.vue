<template>
    <div class="d-flex h-100 flex-column">
        <app-header/>
        <main class="d-flex overflow-auto">
            <NavMenu/>
            <object-view v-if="objectElemUri" :uri="objectElemUri" :level="0"/>
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

    @Component({name: "App"})
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

        get objectElemUri() {
            if (glob.form.elems && glob.form.elems.length == 1 && glob.form.elems[0].type == ElemType.Object && glob.form.elems[0]._)
                return glob.form.elems[0]._.ref;
            else
                return null;
        }
    }
</script>

<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap.scss';
    @import '../src/css/fonts';
    @import url('https://fonts.googleapis.com/css?family=Roboto');

    :root {
        /* nav-menu */
        --nav-menu-bg: #3b3b3b;
        --nav-menu-link: #FFF;
        --nav-menu-link-hover-bg: #555;
        --nav-menu-link-active: #bbc;
        --nav-menu-link-active-bg: #222;
        --nav-menu-icon: #bbc;

        --primary: #0072C6;
        --mina-blue: #007bff;
        --danger: #ff4136;
        --dark: #24292e;
        --header-bg: #24292e;
        --warning: #e46e29;
        --grid-head: #f6f8fa;
        --grid-border: #d7d9dc;
        --object-border: #ccc;
        --panel-separator-line: #ccc;
        --check-box-border: #d7d9dc;
        --grid-row-hover: #f0f8ff;
        --grid-row-highlight: #FFC;
        --grid-row-header-highlight: #FFE;
        --form-label: #666;
        --layout-border: #ddd;
        /*--nav-menu-bg: #1a486b;*/

        --breadcrumb-separator: #aaa;
        --link-color: #4285f4;
        --main-bg: #eee;

        --font-size-base: 1rem;
        --badge-padding-x: 0.25rem;

        --wide-props-width: 30rem;
        --text-multiline-height: 10rem;
    }

    body.theme-light {
        /* nav-menu */
        --nav-menu-bg: #fff;
        --nav-menu-icon: #999;
        --nav-menu-link: #464646;
        --nav-menu-link-active: #ccc;
        --nav-menu-link-hover-bg: #777;
        --nav-menu-link-active-bg: #444;
    }

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

    body {
        height: 100%;
        overflow: hidden;
        font-family: Roboto, IRANSans, RobotoDraft, Calibri, Helvetica, Arial, sans-serif;
        font-size: 15px;
        text-align: start;
    }

    main {
        flex: 1 1 auto;
        scroll-behavior: smooth;
        background-color: var(--main-bg);
    }

    ul {
        padding-inline-start: 0;
    }

    /*header {*/
    /*    flex: 0 1 auto;*/
    /*}*/

    a {
        color: var(--link-color);

        &:hover {
            color: #0366d6;
        }

        &:focus {
            outline: none;
        }
    }

    /* Bootstrap overwrites */
    .form-group {
        margin-bottom: .5rem;
    }

    .table {
        width: inherit;
    }

    .navbar-brand {
        margin-right: unset !important;
        margin-inline-end: 1rem;
    }

    /* Bootstrap extensions */
    .btn-light {
        background-color: #ededed;
        border-color: #ededed;
    }

    .bg-grayblue {
        background-color: #789;
    }

    .bg-gray {
        background-color: #f1f1f1 !important;
    }

    .border-chip {
        border-radius: 3rem;
        white-space: nowrap;
    }

    .rtl {
        direction: rtl;
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
        text-align: left;
        z-index: 10000;
        left: 0;
        right: inherit;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
        border-radius: 0 0 .25rem .25rem;
        border: none !important;
        /*!*margin-top: .55rem;*! I removed this because of multi reference problem*/
    }

    .text-end {
        text-align: end;
    }

    .border-end {
        border-inline-end: 1px solid #dee2e6 !important;
    }

    .border-start {
        border-inline-start: 1px solid #dee2e6 !important;
    }

    .text-start {
        text-align: start;
    }

    .token {
        white-space: pre;
    }

    .aside {
        position: sticky;
        top: 0;
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

    .cursor-pointer {
        cursor: pointer;
    }

    .outline-0 {
        outline: none;
    }

    .hover-opacity:hover {
        opacity: .5;
    }

    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        /* Non-prefixed version, currently
                                         supported by Chrome, Edge, Opera and Firefox */
    }

    .main-bg-image {
        background-repeat: no-repeat;
        /*background-image: url('//public/images/bg2.webp');*/
        background-position-y: bottom;
        background-position-x: right;
    }

    /* Comments and Help documents */
    .inline-note {
        padding: 1rem;
        border-radius: 5px;
        border: 1px solid rgba(0, 115, 187, .35);
        background-color: rgba(241, 250, 255, .8);
    }

    .h-0 {
        height: 0;
    }

    .w-0 {
        width: 0;
    }

    .inline-tip {
        padding: 1rem;
        border-radius: 5px;
        border: 1px solid #FFDE80;
        background-color: #fef6e0;
    }

    .border-2 {
        border-width: 2px !important;
    }

    /* Code mirror markdown style */
    .cm-header {
        font-weight: 500;
        line-height: 1.2;
        font-family: Roboto;

        &.cm-header-1 {
            font-size: 2.5rem;
            color: #212529;
        }

        &.cm-header-2 {
            font-size: 2rem;
            color: #212529;
        }
    }

    .cm-em {
        color: red;
    }

    /* Specific forms styles */
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

    @media (max-width: 576px) {
        .function-open-page {
            margin: 0 auto;
            overflow: auto;
            background-color: white;
            padding: 1rem;
            border: none;
            border-radius: 0;
            height: 100%;
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

    .database-shell-command {
        .prop-text-editor {
            height: 20rem;
        }

        .form-group {
            margin-bottom: 0;
        }

        .log-terminal {
            height: 20rem !important;
        }
    }

    .line-center-text {
        width: 100%;
        height: 1px;
        position: relative;
        background-color: #2222;
        text-align: center;
        margin: 2rem 0;

        span {
            color: #525c69;
            background: #fff;
            padding: 0 1rem;
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
        }
    }

</style>
