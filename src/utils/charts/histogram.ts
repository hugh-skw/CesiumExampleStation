import * as Cesium from "cesium";
export function histogram({ position }: { position: any }) {
	const viewer = window.viewer;
	let height = 0;
	const maxHeight = Math.random() * 10000;
	const material = { r: 0.4, g: 0.4, b: 0.4 };
	// const color = Cesium.Color.fromCssColorString("rgb(" + 255 * material.r + "," + 255 * material.g + "," + 255 * material.b + ")");
	// console.log(Cesium.Color.fromCssColorString());
	const labelEntity = viewer.entities.add({
		position: Cesium.Cartesian3.fromDegrees(position[0], position[1], 100),
		label: {
			text: height + "",
		},
	});
	const entity = viewer.entities.add({
		position: Cesium.Cartesian3.fromDegrees(position[0], position[1]),
		name: "电力",
		ellipse: {
			semiMinorAxis: 700.0,
			semiMajorAxis: 700.0,
			extrudedHeight: new Cesium.CallbackProperty(() => {
				if (height < maxHeight) {
					height += 100;
					// material.r += 0.002;
					material.g += 0.005;
					// material.b += 0.001;
					(entity.ellipse as any).material = Cesium.Color.fromCssColorString(
						"rgb(" + 255 * material.r + "," + 255 * material.g + "," + 255 * material.b + ")"
					);
					(labelEntity as any).position = Cesium.Cartesian3.fromDegrees(position[0], position[1], 200 + height);
					(labelEntity as any).label.text = height + "";
				}
				return height;
			}, false),
			rotation: Cesium.Math.toRadians(45),
			// material: color,
			heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
			extrudedHeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
		},
	});

	// time1 = setInterval(addHeight, 1000);
}

// function addHeight() {
// 	if (dlEllipse.ellipse.extrudedHeight < 15) {
// 		dlEllipse.ellipse.extrudedHeight += 1.5;
// 	}
// }
