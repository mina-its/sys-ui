<template>
    <div class="api-doc p-4">
        <div class="api-doc-block mb-5" v-for="block of data.blocks">
            <h3>{{block.title}}</h3>
            <div class="m-2 api-doc-operation" v-for="opr of block.operations">
                <div class="card">
                    <div class="card-header p-1">
                        <a class="card-link" data-toggle="collapse" :href="'#'+getOprId(block, opr)">
                            <span :class="'api-doc-method text-white p-1 rounded text-center d-inline-block method-'+opr.method">{{opr.method}}</span>
                            <span class="api-doc-opr-uri font-weight-bolder mx-2 text-dark">{{data.uriPrefix}}{{opr.uri}}</span>
                            <span class="api-doc-opr-comment text-black-50">{{opr.comment}}</span>
                        </a>
                    </div>
                    <div :id="getOprId(block, opr)" class="collapse" data-parent=".api-doc">
                        <div class="card-body">
                            <a target="_blank" :href="data.uriPrefix+opr.uri"
                               class="api-doc-opr-uri font-weight-bolder mx-2 text-dark">{{data.uriPrefix}}{{opr.uri}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="api-doc-block mb-5">
            <h3>Schemas</h3>
            <div class="m-2 api-doc-schema" v-for="schema of data.schemas">
                <div class="card">
                    <div class="card-header p-1">
                        <a class="card-link" data-toggle="collapse" :href="'#schema-'+schema.name">
                            <span class="api-doc-opr-uri font-weight-bolder mx-2 text-dark">{{schema.name}}</span>
                            <span class="api-doc-opr-comment text-black-50">{{schema.comment}}</span>
                        </a>
                    </div>
                    <div :id="'schema-'+schema.name" class="collapse" data-parent=".api-doc">
                        <div class="card-body"><p>{</p>
                            <div class="row pl-3" v-for="prop of schema.properties">
                                <span class="col-2 text-dark text-nowrap">{{prop.name}}<span class="text-danger"
                                                                                             v-if="prop.required">*</span></span>
                                <span class="col-2 text-primary text-nowrap">{{prop.type}}</span>
                            </div>
                            <p>}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="api-doc-block mb-5">
            <h3>Enumerations</h3>
            <div class="m-2 api-doc-enum" v-for="enm of data.enums">
                <div class="card">
                    <div class="card-header p-1">
                        <a class="card-link" data-toggle="collapse" :href="'#enum-'+enm.name">
                            <span class="api-doc-opr-uri font-weight-bolder mx-2 text-dark">{{enm.name}}</span>
                            <span class="api-doc-opr-comment text-black-50">{{enm.comment}}</span>
                        </a>
                    </div>
                    <div :id="'enum-'+enm.name" class="collapse" data-parent=".api-doc">
                        <div class="card-body">
                            <div class="" v-for="item of enm.items">
                                <span class="text-dark">{{item.name}} =</span>
                                <span class="text-primary">{{item.value}}</span>
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
	import {ObjectViewType} from "../../../sys/src/types";

	@Component
	export default class ApiDoc extends Vue {
		@Prop() private data: any;

		getOprId(block, opr) {
			return 'oper-' + block.name + '-' + opr.method + "-" + opr.uri.replace(/\//g, '-');
		}
	}
</script>

<style lang="scss">
    .api-doc {
        .api-doc-method {
            width: 75px;
            font-weight: 500;

            &.method-GET {
                background-color: #61affe;
            }

            &.method-POST {
                background-color: #49cc90;
            }

            &.method-PUT {
                background-color: #fca130;
            }

            &.method-DELETE {
                background-color: #f93e3e;
            }
        }

        .api-doc-schema {
            font-family: monospace;
        }

        .api-doc-enum {
            font-family: monospace;
        }
    }
</style>
