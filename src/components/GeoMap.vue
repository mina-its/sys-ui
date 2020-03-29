<template>
    <div v-if="glob.geoMap.show" class="position-fixed fixed-top w-100 h-100 geo-map bg-light">
        <div class="w-100 h-100" ref="map"></div>
        <div class="position-fixed m-2 p-2 btn-group bg-light" style="bottom: 0">
            <button type="button" class="btn btn-success px-5" @click="select()">${$t('select')}</button>
            <button type="button" class="btn btn-secondary px-5" @click="hideGeoMap()">${$t('close')}</button>
            <button type="button" class="btn btn-warning px-5" @click="clear()">${$t('clear')}</button>
        </div>
    </div>
</template>

<script lang="ts">
	declare let google: any;
	import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
	import {glob} from "@/main";

	const main = require("./main");

	@Component
	export default class GeoMap extends Vue {
		hideGeoMap() {
			glob.geoMap.show = false;
		}

		select() {
			let marker = glob.geoMap.marker;
			let val = {x: marker.position.lat(), y: marker.position.lng(), z: marker.map.zoom};
			glob.geoMap.select(val);
			this.hideGeoMap();
		}

		clear() {
			glob.geoMap.select(null);
			this.hideGeoMap();
		}

		get show() {
			return glob.geoMap.show;
		}

		@Watch('show')
		onPropertyChanged(val) {
			if (val) {
				setTimeout(() => {
					let point = glob.geoMap.val ? {lat: glob.geoMap.val.x || 0, lng: glob.geoMap.val.y || 0} : {
						lat: 0,
						lng: 0
					};
					let mc = {
						center: point,
						zoom: (glob.geoMap.val ? glob.geoMap.val.z : 0) || 3,
						mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]},
						disableDefaultUI: true,
						mapTypeControl: true,
						scaleControl: true,
						streetViewControl: true,
						fullscreenControl: true,
						zoomControl: true,
						zoomControlOptions: {style: google.maps.ZoomControlStyle.LARGE},
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};

					let map = new google.maps.Map(this.$refs.map, mc);
					glob.geoMap.marker = new google.maps.Marker({
						position: point,
						title: "TITLE",
						map,
						draggable: true,
						animation: google.maps.Animation.DROP
					});
					map.panTo(point);
					map.setZoom(mc.zoom);
				}, 0);
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
