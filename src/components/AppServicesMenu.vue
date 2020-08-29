<template>
    <div class="app-services-menu d-flex apps-list overflow-auto flex-wrap p-5 align-content-start">
        <a target="_self" :href="getServiceUrl(service)" class="small bg-white m-3 business-app cursor-pointer" v-for="service of services" style="width: 8rem">
            <div class="text-center p-2">
                <div class="app-icon p-3 text-white" :style="{'background-color':service.iconColor}"><i :class="service.iconStyle + ' fa-4x'"></i></div>
                <label class="pt-2 font-weight-bold" style="color: #444;font-size: .7rem">{{service.title}}</label>
            </div>
        </a>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {call, prepareServerUrl} from "../main";

    declare let $: any;

    @Component({name: 'AppServicesMenu'})
    export default class AppServicesMenu extends Vue {
        private services: { name: string, iconColor: string, iconStyle: string, title: string }[] = [];

        getServiceUrl(service) {
            return prepareServerUrl(service.name);
        }

        created() {
            call("getAppServices", null, (err, res) => {
                // console.log(res);
                this.services = res.data;
            });
        }
    }
</script>

<style lang="scss">
    .app-services-menu {
        .business-app {
            box-shadow: rgba(0, 0, 0, 0.1) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.1) 0px 4.8px 14.4px 0px;

            &:hover {
                box-shadow: rgba(0, 0, 0, 0.3) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.3) 0px 4.8px 14.4px 0px;
            }
        }

        .apps-menu {
            .apps-list {
                width: 36rem
            }

            button a {
                width: 16px;

                rect {
                    fill: none;
                    stroke: white;
                    stroke-linejoin: round;
                    stroke-width: 2px;
                }

                &:hover {
                    rect {
                        stroke: gray;
                    }
                }

            }
        }
    }
</style>
