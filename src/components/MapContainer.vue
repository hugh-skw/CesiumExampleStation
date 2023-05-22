<template>
	<div id="mapContainer"></div>
</template>
<script setup lang="ts">
import * as Cesium from "cesium";
import { Viewer } from "cesium";
import { onMounted } from "vue";

Cesium.Ion.defaultAccessToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ODE2MTJmNi02NjA4LTRmOWYtODhiNi1jYjZhYWQ0NTZjZWYiLCJpZCI6ODYzODEsImlhdCI6MTY0Nzc3NTE0OX0.RM0iXXF2qCSAiqfLBRY2siP-gSMGgfHxQTMRX6WSH2A";
// 设置Cesium相机默认位置在中国区域上方
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);
onMounted(() => {
	const viewer = new Viewer("mapContainer", {
		infoBox: false,
		contextOptions: {
			requestWebgl1: true,
		},
		imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
			url: "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
			// url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
		}),
	});
	viewer.scene.debugShowFramesPerSecond = true;
	// var path = "M0,3,160,3,160,136,3,136,3,0";
	let svg: SVGElement = viewer.selectionIndicator.viewModel.selectionIndicatorElement.getElementsByTagName("svg:svg")[0];
	// svg.innerHTML = `<g transform="translate(80,80)"><path data-bind="attr: { transform: _transform }" d=${path} transform="scale(1)"></path></g>`; //修改选择器外观
	// svg.innerHTML = `<g transform="translate(80,80)"><path data-bind="attr: { transform: _transform }" d="M -34 -34 L -34 -11.25 L -30 -15.25 L -30 -30 L -15.25 -30 L -11.25 -34 L -34 -34 z M 11.25 -34 L 15.25 -30 L 30 -30 L 30 -15.25 L 34 -11.25 L 34 -34 L 11.25 -34 z M -34 11.25 L -34 34 L -11.25 34 L -15.25 30 L -30 30 L -30 15.25 L -34 11.25 z M 34 11.25 L 30 15.25 L 30 30 L 15.25 30 L 11.25 34 L 34 34 L 34 11.25 z" transform="scale(1)" height="20"></path></g>`; //修改选择器外观
	svg.style.fill = "#3cf1ff"; //还可以修改样式
	// console.log("1:", svg.getElementsByTagName("g")[0].getElementsByTagName("path")[0]);
	// console.log("1:", svg.getElementsByTagName("path")[0].getAttribute("g"));

	// svg.getElementsByTagName("path")[0].setAttribute("tra", "20");
	// svg.getElementsByTagName("path")[0].setAttribute("height", "20");

	window.viewer = viewer;
});
</script>
<style lang="scss" scoped>
#mapContainer {
	width: 100%;
	height: 100%;
}
</style>
