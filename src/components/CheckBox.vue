<template>
    <div class="checkbox-wrapper text-center mr-2" @click="changed">
        <input class="checkbox" @keyup.space="changed" @keydown="keydown" type="checkbox" v-model="checked" tabindex="0"
               @input="changed">
        <label :class="{'checkbox-label':true, 'no-label':!label}">{{label}}</label>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';

    @Component({name: 'CheckBox'})
    export default class CheckBox extends Vue {
        @Prop() private checked: boolean;
        @Prop() private label?: string;

        @Emit('changed')
        changed() {
            return {val: !this.checked};
        }

        @Emit('keydown')
        keydown(e) {
            return e;
        }
    }
</script>

<style lang="scss">
    .checkbox-wrapper {
        outline: none;
        display: inline-block;
    }

    td > .checkbox-wrapper {
        display: block;
    }

    .checkbox {
        opacity: 0;
        position: absolute;
    }

    .checkbox, .checkbox-label {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
    }

    .checkbox-label {
        position: relative;
        margin-bottom: 0;
    }

    .checkbox + .checkbox-label:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        width: 1.4rem;
        height: 1.4rem;
        text-align: center;
        margin-right: 0.5rem;
        border: 1px solid var(--check-box-border);
        border-radius: 3px;
    }

    .checkbox-label.no-label:before {
        margin-right: -0.5rem;
    }

    .checkbox:focus + .checkbox-label:before {
        border-color: #999;
    }

    .checkbox:checked + .checkbox-label:before {
        font-family: "Font Awesome 5 Free";
        font-weight: 600;
        content: "\f00c";
        color: #666;
    }

</style>
