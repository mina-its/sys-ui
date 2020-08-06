<template>
    <div class="checkbox-wrapper text-center mr-2 outline-0" @click="changed">
        <input @focus="focus" class="checkbox" @keyup.space="changed" @keydown="keydown" type="checkbox" :checked="checked" tabindex="0" @input="changed">
        <label :class="{'checkbox-label':true, 'no-label':!label}">{{label}}</label>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {PropEventArg} from "../types";

    @Component({name: 'CheckBox'})
    export default class CheckBox extends Vue {
        @Prop() private checked: boolean;
        @Prop() private label?: string;

        @Emit('changed')
        changed() {
            return {val: !this.checked};
        }

        @Emit('focus')
        focus(e): PropEventArg {
            return e;
        }

        @Emit('keydown')
        keydown(e) {
            return e;
        }
    }
</script>

<style lang="scss">
    td > .checkbox-wrapper {
        display: flex;
        justify-content: center;
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
        font-family: "Font Awesome 5 Pro";
        font-weight: 600;
        content: "\f00c";
        color: #666;
    }

</style>
