<template>
    <div id="question-box" class="modal fade" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <i class="fa fa-question-circle fa-2x text-muted"></i>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body d-flex align-items-center">
                    <div class="flex-grow-1 mx-2" v-html="message"></div>
                </div>
                <div class="modal-footer">
                    <Function styles="btn-primary" :title="option.title" @exec="select(option)" :key="option.ref"
                              v-for="option in glob.question.options"></Function>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
	declare let $, marked: any;
	import Function from "@/components/Function.vue";
	import {Component, Vue} from 'vue-property-decorator';
	import {glob} from "@/main";
	import {Pair} from '../../../sys/src/types';

	const main = require("@/main");

	@Component({components: {Function}})
	export default class QuestionBox extends Vue {
		mounted() {
			$("#question-box").on('hidden.bs.modal', function () {
				if (glob.question.options.length)
					glob.question.select(null);
			});
		}

		select(option: Pair) {
			glob.question.select(option);
			glob.question.options = []; // to not send again null
			$("#question-box").modal('hide');
		}

		get message() {
			if (glob.question.message)
				return marked(glob.question.message);
			else
				return "";
		}
	}
</script>

<style lang="scss">
    #question-box {
        background-color: #5555;

        .modal-header {
            color: #ffc4c4 !important;
        }

        .modal-body {
            font-weight: 500;
        }

        .btn {
            min-width: 75px;
        }
    }
</style>
