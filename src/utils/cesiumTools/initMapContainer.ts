import * as Cesium from "cesium";
export async function initMapContainer() {
	const mapContainer = document.getElementById("mapContainer");
	if (mapContainer) {
		mapContainer.innerHTML = "";
	}
	const viewer = new Cesium.Viewer("mapContainer", {
		infoBox: false,
		contextOptions: {
			requestWebgl1: true,
		},
		baseLayer: new Cesium.ImageryLayer(
			new Cesium.UrlTemplateImageryProvider({
				url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
			}),
			{}
		),
	});
	viewer.terrainProvider = await new (Cesium.createWorldTerrainAsync as any)();
	viewer.scene.globe.depthTestAgainstTerrain = true;
	viewer.imageryLayers.addImageryProvider(
		new Cesium.UrlTemplateImageryProvider({
			url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
		})
	);
	window.viewer = viewer;
	return viewer;
}
