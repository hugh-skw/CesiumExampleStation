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
		infoBox: true,
		contextOptions: {
			requestWebgl1: true,
		},
		imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
			url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
		}),
	});
	viewer.scene.debugShowFramesPerSecond = true;
	window.viewer = viewer;
});
</script>
<style lang="scss" scoped>
#mapContainer {
	width: 100%;
	height: 100%;
}
</style>
