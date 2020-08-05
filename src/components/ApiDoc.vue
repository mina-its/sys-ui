<template>
    <div class="api-doc p-4 overflow-auto d-flex h-100">
        <div class="w-100 h-0">
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
                                <div class="opblock-section-header">
                                    <div class="tab-header"><h4 class="opblock-title">Parameters:</h4></div>
                                    <div v-if="opr.params">
                                        <div v-for="param of opr.params">
                                            <div>{{param.name}}</div>
                                            <input v-model="param.value" />
                                        </div>
                                    </div>
                                </div>
                                <div class="opblock-section-header">
                                    <div class="tab-header"><h4 class="opblock-title">Response:</h4></div>
                                </div>
                                <button id="execute"
                                        v-on:click="getClick(data.uriPrefix+ opr.uri,opr)">Execute
                                </button>
                                <div>{{responseApi}}</div>
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
                                <div class="pl-3" v-for="prop of schema.properties">
                                <span class="text-dark schema-prop-name text-nowrap">{{prop.name}}<span
                                        class="text-danger" v-if="prop.required">*</span></span>
                                    <span class="text-primary text-nowrap">{{prop.type}}</span>
                                    <div v-if="prop.type == 'object'">
                                        <p>{</p>
                                        <div v-for="innerProp of prop.properties">
                                              <span class="text-dark schema-prop-name text-nowrap">{{innerProp.name}}<span
                                                      class="text-danger" v-if="innerProp.required">*</span></span>
                                            <span class="text-primary text-nowrap">{{innerProp.type}}</span>
                                            <span class="text-dark text-nowrap p-lg-5">{{innerProp.description}}</span>
                                            <span class="text-dark text-nowrap p-lg-5">{{innerProp.sample}}</span>
                                        </div>
                                        <p>}</p>
                                    </div>
                                    <div v-else>
                                        <span class="text-dark text-nowrap p-lg-5">{{prop.description}}</span>
                                        <span class="text-dark text-nowrap p-lg-5">{{prop.sample}}</span>
                                    </div>
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
    </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import axios from "axios";

  @Component({name: 'ApiDoc'})
  export default class ApiDoc extends Vue {
    @Prop() private data: any;
    private responseApi;

    getOprId(block, opr) {
      return 'oper-' + block.name + '-' + opr.method + "-" + opr.uri.replace(/\//g, '-').replace('{','').replace('}','');
    }

    getClick(href,opr) {
      for(let param of opr.params)
      {
        href=href.replace(param.name,param.value).replace(/{/,'').replace(/}/,'');
      }
      // call(href,{},(err,res)=>{
      //   console.log(res.data);
      //   this.getObject=res.data;
      // });
      let res = axios.get(href).then(response => {
          console.log(response.data);
          this.responseApi =  JSON.stringify(response.data);
        }
      );

    }
  }
</script>

<style lang="scss">
    .swagger-ui .opblock .opblock-section-header {
        display: flex;
        align-items: center;
        padding: 8px 20px;
        min-height: 50px;
        background: hsla(0, 0%, 100%, .8);
        box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
    }

    .swagger-ui button {
        cursor: pointer;
        outline: none;
    }

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

        .schema-prop-name {
            width: 200px;
            display: inline-block;
        }
    }
</style>
