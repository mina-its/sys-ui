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
                    <function styles="btn-primary" :title="option.title" @exec="select(option)" :key="option.ref"
                              v-for="option in st.question.options"></function>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
	declare let $, marked: any;
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {st} from "@/main";
	import {Pair} from '../../../sys/src/types';

	const main = require("./main");

	@Component
	export default class QuestionBox extends Vue {
		@Prop() private prop!: string;

		mounted() {
			$("#question-box").on('hidden.bs.modal', function () {
				if (st.question.options.length)
					st.question.select(null);
			});
		}

		select(option: Pair) {
			st.question.select(option);
			st.question.options = []; // to not send again null
			$("#question-box").modal('hide');
		}

		get message() {
			if (st.question.message)
				return marked(st.question.message);
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
