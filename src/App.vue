<template>
    <div class="d-flex h-100 flex-column">
        <header>
            <NavBar></NavBar>
        </header>
        <main class="d-flex align-items-stretch overflow-auto">
            <SideNav></SideNav>
            <div class="d-flex flex-column flex-fill overflow-auto">
                <Toolbar></Toolbar>
                <div class="main-body h-100 overflow-auto w-100 d-flex" @scroll="onScroll()">
                    <FormElem v-for="elem in form.elems" :elem="elem"></FormElem>
                </div>
            </div>
        </main>
        <section class="helpers-section">
            <FileGallery></FileGallery>
            <div id="snackbar"></div>
            <input id="file-browse" type="file" class="d-none" @change="fileBrowsed" style="width: 0;height: 0;"
                   multiple="true">
            <NotifyBox></NotifyBox>
            <WebSocket></WebSocket>
            <QuestionBox></QuestionBox>
            <ContextMenu></ContextMenu>
            <!--  <geo-map></geo-map>-->
        </section>
    </div>
</template>

<script lang="ts">
	declare let $: any;
	import {Vue} from 'vue-property-decorator';
	import {$t, hideCmenu, load, notify} from "@/main";
	import {LogType, NotificationInfo, Form} from '../../sys/src/types';

	const main = require("./main");

	export default class App extends Vue {
		onScroll() {
			main.hideCmenu();
		}

		fileBrowsed(e) {
			console.log("fileBrowsed!");
			this.$store.state.fileGallery.fileBrowsed(e.target.files);
		}

		handleWindowEvents() {
			$(window)
				.on('notify', function (e: any) {
					let notify = e.detail as NotificationInfo;
					if (notify.type == LogType.Debug) {
						$("#snackbar").addClass("visible").text(notify.message);
						setTimeout(function () {
							$("#snackbar").removeClass("visible");
						}, 3000);
					} else
						main.updateRoot({notify});
				})
				.on('question', function (e: any) {
					main.updateRoot({question: e.detail});
				})
				.on("popstate", (e) => {
					load(location.href);
				})
				.on("beforeunload", (e) => {
					if (this.$store.state.dirty) {
						e = e || window.event;
						if (e)
							e.returnValue = $t('save-before');
						return $t('save-before');
					}
				})
				.on("resize", (e) => {
					hideCmenu();
				})
				.on("keydown", (e) => {
					if (this.$store.state.cmenu.show)
						main.handleCmenuKeys(e);
					main.updateRoot({notify: null});
				})
				.on("click", (e) => {
					if (e.target.tagName == "A") {
						if (e.target.getAttribute('target')) return; // especially _blank
						let href = e.target.getAttribute('href');
						if (href) {
							if (href.match(/^javascript/) || /^#/.test(href)) return; // if (/^#/.test(href)) return false;
							e.preventDefault();
							if (this.$store.state.dirty) {
								notify($t('save-before'), LogType.Warning);
								return;
							} // dirty page
							if (/\bf=\d/.test(href)) { // function link

							} else
								history.pushState(null, null, href);
							load(href);
						}
					}
				})
				.on("mouseup", (e) => {
					if (this.$store.state.cmenu.show &&
						!$('.dropdown-item').is(e.target)
						&& $('.dropdown-item').has(e.target).length === 0
						&& $('.dropdown-menu.show').has(e.target).length === 0
					) hideCmenu();
				});
		}

		mounted() {
			this.handleWindowEvents();
			console.log(
				`%c main started. %c version: ${this.$store.state.config.version} %c`,
				'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
				'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
				'background:transparent'
			);
		}

		get form(): Form {
			return this.$store.state.form;
		}
	}
</script>

<style lang="scss">
    $left: left;
    $right: right;

    $theme-colors: (
            "primary": #0072C6,
            "danger": #ff4136,
            "dark": #24292e,
            "warning": #ff7700,
        //my custom colors
            "grid-head" : #f6f8fa,
            "grid-border": #d7d9dc,
            "panel-separator-line" : #dee2e6,
            "grid-row-hover" : #f0f8ff,
            "grid-row-selected": #FFC,
            "grid-row-header-selected": #FFE,
            "form-label": #666,
            "layout-border": #ddd,
            "side-nav": #2f353c,
            "breadcrumb-separator": #aaa,
    );
    @import "bootstrap";

    @function color($key: "blue") {
        @return map-get($colors, $key);
    }

    @function theme-color($key: "primary") {
        @return map-get($theme-colors, $key);
    }

    @function gray($key: "100") {
        @return map-get($grays, $key);
    }

    html {
        height: 100%;
    }

    body {
        height: 100%;
        overflow: hidden;
        text-align: $left;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
        font-size: 15px;
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

        .btn-toolbar {
            border-color: theme-color("layout-border");
        }
    }

    a {
        color: #0366d6;

        &:hover {
            color: #0366d6;
        }

        &:focus {
            outline: none;
        }
    }

    td {
        .prop-focused {
            outline: 1px solid theme-color("primary");
        }
    }

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
        border-color: theme-color("panel-separator-line") !important;
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
            color: theme-color("breadcrumb-separator");
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
            @if $left == left {
                content: "\f053" !important;
            } @else {
                content: "\f054" !important;
            }
        }

        &right:before {
            @if $right == right {
                content: "\f054" !important;
            } @else {
                content: "\f053" !important;
            }
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
</style>
