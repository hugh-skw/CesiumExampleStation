export async function initMapContainer() {
	const mapContainer = document.getElementById("mapContainer");
	if (mapContainer) {
		mapContainer.innerHTML = "";
	}
	const viewer = await new window.Cesium.Viewer("mapContainer", {
		infoBox: false,
		contextOptions: {
			requestWebgl1: true,
		},
		baseLayer: new window.Cesium.ImageryLayer(
			new window.Cesium.UrlTemplateImageryProvider({
				url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
			}),
			{}
		),
	});
	const terrain = await new window.Cesium.createWorldTerrainAsync();
	viewer.scene.globe.depthTestAgainstTerrain = true;
	viewer.terrainProvider = terrain;
	viewer.imageryLayers.addImageryProvider(
		new window.Cesium.UrlTemplateImageryProvider({
			url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
		})
	);
	return viewer;
}
