<template>
    <div class="change-region mx-2">
        <a class="nav-link py-0 px-0" href="#" id="navbarDropdownLocale" role="button" data-toggle="modal" data-target="#changeRegion">
            <i style="font-size: 16px" class="fal fa-globe text-white px-1"></i>{{$t("change-region")}}
        </a>

        <div class="modal fade" id="changeRegion" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <div>
                            <h5 class="font-weight-bold" id="exampleModalLabel">Choose your region</h5>
                            <div>Selecting a region changes the language and/or content.</div>
                        </div>
                        <button type="button" class="close text-dark" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body  px-4">
                        <div class="countries d-flex flex-wrap flex-column align-content-start">
                            <div v-for="item of items" class="item">
                                <div v-if="!item.ref" :class="{'font-weight-bold pt-3':1,'pr-5':ltr,'pl-5':rtl}">{{item.name}}</div>
                                <div v-if="item.ref" :class="{'country':1,'pr-5':ltr,'pl-5':rtl}">
                                    <a @click="changeRegion(item)"
                                       href="javascript:void(0);">{{item.name}}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Country, Locale} from "../../../sys/src/types";
    import {$t, onlyUnique, call, setQs} from "@/main";

    @Component({name: 'AppChangeRegion'})
    export default class AppChangeRegion extends Vue {
        private countries: Country[] = [];

        created() {
            call("getRegionCountries", null, (err, res) => {
                this.countries = res.data;
            });
        }

        changeRegion(item) {
            location.href = setQs('e', item.ref, true);
        }

        get items() {
            let items: { name: string, ref?: string }[] = [];
            let groups = this.countries.filter(c => c.locale && c.group).map(c => c.group).filter(onlyUnique);
            for (let group of groups) {
                items.push({name: group});
                let countries = this.countries.filter(c => c.locale && group == $t(c.group));
                for (let country of countries) {
                    items.push({name: country.localName || country.name, ref: Locale[country.locale]});
                }
            }
            return items;
        }
    }
</script>

<style lang="scss">
    .change-region {
        .modal-dialog {
            max-width: 50%;
            margin: 10rem auto !important;

            .countries {
                height: 200px;
                overflow: auto;
            }
        }
    }
</style>
