import * as Cesium from "cesium";
import { getAssetsFile } from "../tools/unit";
//动态墙材质
class DynamicWallMaterialProperty {
	_definitionChanged: any;
	viewer: any;
	_color: any;
	_colorSubscription: any;
	color: any;
	duration: any;
	trailImage: any;
	_time: any;
	constructor(options: any) {
		// 默认参数设置
		this._definitionChanged = new Cesium.Event();
		this.viewer = options.viewer;
		this._color = undefined;
		this._colorSubscription = undefined;
		this.color = options.color;
		this.duration = options.duration;
		this.trailImage = options.trailImage;
		this._time = new Date().getTime();
	}
	get isConstant() {
		return false;
	}
	get definitionChanged() {
		return this._definitionChanged;
	}
	getType(time: any) {
		return "DynamicWall";
	}
	getValue(time: any, result: any) {
		if (!Cesium.defined(result)) {
			result = {};
		}
		result.color = (Cesium as any).Property.getValueOrClonedDefault(this._color, time, this.color, result.color);
		if (this.trailImage) {
			result.image = this.trailImage;
		} else {
			result.image = getAssetsFile("shaderImg/gradient.png");
		}

		if (this.duration) {
			result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration;
		}
		// console.log(this.viewer);
		this.viewer.scene.requestRender();
		return result;
	}
	equals(other: any) {
		return this === other || (other instanceof DynamicWallMaterialProperty && (Cesium as any).Property.equals(this._color, other._color));
	}
}

export function dynamicWall(viewer: Cesium.Viewer, positions: any) {
	Object.defineProperties(DynamicWallMaterialProperty.prototype, {
		color: (Cesium as any).createPropertyDescriptor("color"),
	});

	const cusSource =
		"czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                {\n\
                                                czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                vec2 st = materialInput.st;\n\
                                                vec4 colorImage = texture2D(image, vec2(fract(st.t - time), st.t));\n\
                                                vec4 fragColor;\n\
                                                fragColor.rgb = color.rgb / 1.0;\n\
                                                fragColor = czm_gammaCorrect(fragColor);\n\
                                                material.alpha = colorImage.a * color.a;\n\
                                                material.diffuse = color.rgb;\n\
                                                material.emission = fragColor.rgb;\n\
                                                return material;\n\
                                                }";
	(Cesium as any).Material._materialCache.addMaterial("DynamicWall", {
		fabric: {
			type: "DynamicWall",
			uniforms: {
				color: new Cesium.Color(1.0, 0.0, 0.0, 0),
				image: getAssetsFile("shaderImg/gradient.png"),
				time: 0,
			},
			source: cusSource,
		},
		translucent: function (material: any) {
			return true;
		},
	});

	// 绘制墙体
	const entity = viewer.entities.add({
		name: "立体墙效果",
		wall: {
			positions: positions,
			// 设置高度
			maximumHeights: new Array(positions.length).fill(50000),
			// minimunHeights: new Array(positions.length).fill(0),
			material: new DynamicWallMaterialProperty({
				color: Cesium.Color.YELLOW.withAlpha(0.7),
				duration: 1000,
				trailImage: "static/shaderNeeds/gradient.png",
				viewer: viewer,
			}),
		},
	});
	const flyRes = viewer.flyTo(entity);
}
