var Chart_1;
import { __decorate } from "tslib";
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ChartColors } from '@/types';
let Chart = Chart_1 = class Chart extends Vue {
    mounted() {
        let chartData = { labels: [], datasets: [] };
        chartData.labels = this.data.series.map((s) => {
            return s.x;
        });
        let dataSet = { backgroundColor: ChartColors[0], data: [], label: this.data.title, type: this.data.type };
        this.data.series.forEach(function (s) {
            dataSet.data.push(s.y);
        });
        chartData.datasets.push(dataSet);
        let ctx = this.$refs.canvas.getContext("2d");
        new Chart_1(ctx, {
            type: 'bar', data: chartData, options: {
                legend: {
                    display: true,
                    labels: { fontFamily: "calibri" }
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
};
__decorate([
    Prop()
], Chart.prototype, "data", void 0);
Chart = Chart_1 = __decorate([
    Component
], Chart);
export default Chart;
//# sourceMappingURL=Chart.vue.js.map