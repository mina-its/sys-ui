<template>
    <div class="chart">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType} from "../../../sys/src/types";

	@Component
	export default class Chart extends Vue {
		@Prop() private data: any;

		mounted() {
			let chartData = {labels: [], datasets: []};
			chartData.labels = this.data.series.map((s) => {
				return s.x
			});

			let dataSet = {backgroundColor: ChartColors[0], data: [], label: this.data.title, type: this.data.type};
			this.data.series.forEach(function (s) {
				dataSet.data.push(s.y);
			});
			chartData.datasets.push(dataSet);

			let ctx = this.$refs.canvas.getContext("2d");
			new Chart(ctx, {
				type: 'bar', data: chartData, options: {
					legend: {
						display: true,
						labels: {fontFamily: "calibri"}
					}, responsive: true, tooltips: {
						mode: 'index',
						intersect: true,
						titleFontFamily: "calibri",
						titleMarginBottom: 15,
						bodyFontFamily: "calibri"
					},
					pointLabels: {
						fontFamily: "calibri"
					}
				}
			});
			ctx.font = "tahoma";
		}
	}
</script>

<style scoped lang="scss">

</style>
