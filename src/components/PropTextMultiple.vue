<template>
    <div @click="focus" :class="styles + ' prop-text-multi px-1 pb-0'">
        <span v-if="placeholder" class="text-muted px-1">{{placeholder}}</span>
        <div v-for="item in items"
             :class="{'ref-multi-item rounded-lg rmI d-inline-block mb-1 px-1 border text-nowrap':1,'mr-1':ltr,'ml-1':rtl}">
            <i @click="remove(item)" class="text-black-50 mx-1 rmD fa fa-times" style="cursor:pointer"></i>
            <span class="rmV cursor-pointer">{{item}}</span>
        </div>
        <input @blur="refreshText" v-model="phrase" @keydown="keypress" @change="update" v-if="!readOnly"
               class="bg-transparent rmT border-0">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, Keys} from "../../../sys/src/types";
    import {ItemChangeEventArg, PropertyLabelMode} from '../types';

    declare let $: any;

    @Component({name: 'PropTextMultiple'})
    export default class PropTextMultiple extends Vue {
        @Prop() private type: string;
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private styles: string;
        @Prop() private readOnly: boolean;
        @Prop() private labelMode: PropertyLabelMode;
        private phrase: string = '';

        get placeholder() {
            return this.labelMode == PropertyLabelMode.PlaceHolder && (!this.items || !this.items.length) ? this.prop.title : null;
        }

        keypress(e) {
            switch (e.which) {
                case Keys.backspace:
                    if (!this.phrase) {
                        let item = this.items.pop();
                        if (item) this.remove(item);
                    }
                    break;
            }
        }

        update(e) {
            if (this.phrase) {
                this.addItem(this.phrase);
                this.phrase = "";
            }
        }

        refreshText() {
            let val = this.doc[this.prop.name];
            this.doc[this.prop.name] = null;
            this.doc[this.prop.name] = val;
        }

        focus() {
            $(this.$el).find("input").focus();
        }

        @Emit('changed')
        remove(item: string) {
            let val = this.items.filter(v => v != item);
            return {prop: this.prop, val, vue: this};
        }

        @Emit('changed')
        addItem(value: string): ItemChangeEventArg {
            if (!value) { // Esc
                this.refreshText();
                return;
            }
            let val = this.items;
            val.push(value);
            return {prop: this.prop, val, vue: this};
        }

        get items(): string[] {
            let val = this.doc[this.prop.name];
            if (!val) this.doc[this.prop.name] = val = [];
            else if (!Array.isArray(val))
                val = [val];
            return val;
        }
    }
</script>

<style lang="scss">
    .prop-text-multi {
        min-height: 2rem;

        &:focus-within {
            outline: 1px dotted #212121;
            outline: 5px auto -webkit-focus-ring-color;
        }

        input {
            width: 1rem !important;
            outline: none;

            &:focus {
                width: 8rem !important;
            }
        }

        .ref-multi-item {
            background-color: #f0f1f5;
        }

        .rmV {
            font-size: smaller;
            color: #666;
        }
    }
</style>
