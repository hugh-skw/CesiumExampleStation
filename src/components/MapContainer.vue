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
		// imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
		// 	url: "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
		// 	// url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
		// }),
		imageryProvider: new Cesium.UrlTemplateImageryProvider({
			url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
			// layer: "tdtVecBasicLayer",
			// style: "default",
			// format: "image/png",
			// tileMatrixSetID: "GoogleMapsCompatible",
			// show: false,
		}),
	});
	viewer.imageryLayers.addImageryProvider(
		new Cesium.UrlTemplateImageryProvider({
			url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
		})
	);
	viewer.scene.debugShowFramesPerSecond = true;
	// var path = "M0,3,160,3,160,136,3,136,3,0";
	let svg: Element = viewer.selectionIndicator.viewModel.selectionIndicatorElement.getElementsByTagName("svg:svg")[0];
	// svg.innerHTML = `<g transform="translate(80,80)"><path data-bind="attr: { transform: _transform }" d=${path} transform="scale(1)"></path></g>`; //修改选择器外观
	// svg.innerHTML = `<g transform="translate(80,80)"><path data-bind="attr: { transform: _transform }" d="M -34 -34 L -34 -11.25 L -30 -15.25 L -30 -30 L -15.25 -30 L -11.25 -34 L -34 -34 z M 11.25 -34 L 15.25 -30 L 30 -30 L 30 -15.25 L 34 -11.25 L 34 -34 L 11.25 -34 z M -34 11.25 L -34 34 L -11.25 34 L -15.25 30 L -30 30 L -30 15.25 L -34 11.25 z M 34 11.25 L 30 15.25 L 30 30 L 15.25 30 L 11.25 34 L 34 34 L 34 11.25 z" transform="scale(1)" height="20"></path></g>`; //修改选择器外观
	svg["style"].fill = "#3cf1ff"; //还可以修改样式
	// console.log("1:", svg.getElementsByTagName("g")[0].getElementsByTagName("path")[0]);
	// console.log("1:", svg.getElementsByTagName("path")[0].getAttribute("g"));

	// svg.getElementsByTagName("path")[0].setAttribute("tra", "20");
	// svg.getElementsByTagName("path")[0].setAttribute("height", "20");
	viewer.entities.add({
		polyline: {
			show: true, //是否显示，默认显示
			positions: Cesium.Cartesian3.fromDegreesArrayHeights([70, 40, 600000, 75, 30, 400000, 120, 25, 200000]),
			width: 2, //线的宽度（像素），默认为1
			granularity: Cesium.Math.RADIANS_PER_DEGREE,
			material: Cesium.Color.BLUE, //线的颜色，默认为白色
			// depthFailMaterial: Cesium.Color.RED, //线被遮挡部分的颜色，默认为空（不显示被遮挡的部分），设置后可显示被遮挡的部分
			arcType: Cesium.ArcType.NONE, //线的地理类型，NONE表示纯直线，GEODESIC表示为测地线，RHUMB表示等角航线，默认为测地线
			// arcType: Cesium.ArcType.GEODESIC,
			// arcType: Cesium.ArcType.RHUMB,
			clampToGround: false, //是否贴地，默认为否
			shadows: Cesium.ShadowMode.DISABLED, //是否显示光照阴影，默认为否
			// distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100.0, 2000000.0), //显示的视角距离条件，在该范围内显示，范围不显示，默认为空
			classificationType: Cesium.ClassificationType.BOTH,
			zIndex: 0, //显示深度，越大表示图层在上
		},
	});
	viewer.entities.add({
		polyline: {
			show: true, //是否显示，默认显示
			positions: Cesium.Cartesian3.fromDegreesArray([70, 40, 75, 30, 120, 25]),
			width: 2, //线的宽度（像素），默认为1
			granularity: Cesium.Math.RADIANS_PER_DEGREE,
			material: Cesium.Color.RED, //线的颜色，默认为白色
			// depthFailMaterial: Cesium.Color.RED, //线被遮挡部分的颜色，默认为空（不显示被遮挡的部分），设置后可显示被遮挡的部分
			arcType: Cesium.ArcType.NONE, //线的地理类型，NONE表示纯直线，GEODESIC表示为测地线，RHUMB表示等角航线，默认为测地线
			// arcType: Cesium.ArcType.GEODESIC,
			// arcType: Cesium.ArcType.RHUMB,
			clampToGround: false, //是否贴地，默认为否
			shadows: Cesium.ShadowMode.DISABLED, //是否显示光照阴影，默认为否
			// distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100.0, 2000000.0), //显示的视角距离条件，在该范围内显示，范围不显示，默认为空
			classificationType: Cesium.ClassificationType.BOTH,
			zIndex: 0, //显示深度，越大表示图层在上
		},
	});
	window.viewer = viewer;
});
</script>
<style lang="scss" scoped>
#mapContainer {
	width: calc(100% - 200px);
	height: 100%;
}
</style>
