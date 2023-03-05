/**
 *  精灵穿梭路光效果，
 *  参考gitee开源
 *  entity的材质使用MaterialProperty,而primitive使用的是material。
 *  @Data：2022-01-11
 */
import * as Cesium from "cesium";
import spriteline1Img from "/static/shaderNeeds/spriteline1.png";
export function roadRapidEffect(viewer: Cesium.Viewer, duration: number, image: string) {
	class Spriteline1MaterialProperty {
		_definitionChanged: any;
		duration: any;
		// image: any;
		_time: any;
		constructor(duration: number) {
			this._definitionChanged = new Cesium.Event();
			this.duration = duration;
			// this.image = image;
			this._time = performance.now();
		}
		getType(time: any) {
			return "Spriteline1";
		}
		getValue(time: any, result: any) {
			if (!Cesium.defined(result)) {
				result = {};
			}
			// result.image = this.image;
			result.time = ((performance.now() - this._time) % this.duration) / this.duration;
			return result;
		}
		equals(e: any) {
			return this === e || (e instanceof Spriteline1MaterialProperty && this.duration === e.duration);
		}
	}
	Object.defineProperties(Spriteline1MaterialProperty.prototype, {
		isConstant: {
			get: function () {
				return false;
			},
		},
		definitionChanged: {
			get: function () {
				return this._definitionChanged;
			},
		},
		color: Cesium.createPropertyDescriptor("color"),
		duration: Cesium.createPropertyDescriptor("duration"),
	});
	// Cesium.Spriteline1MaterialProperty = Spriteline1MaterialProperty;
	// st :二维纹理坐标
	// czm_material：保存可用于照明的材质信息
	Cesium.Material._materialCache.addMaterial("Spriteline1", {
		fabric: {
			type: "Spriteline1",
			uniforms: {
				color: new Cesium.Color(1, 0, 0, 0.5),
				image: spriteline1Img,
				transparent: true,
				time: 20,
			},
			source: `
			czm_material czm_getMaterial(czm_materialInput materialInput)
			{
			  czm_material material = czm_getDefaultMaterial(materialInput);
			  vec2 st = materialInput.st;
			  vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
			  material.alpha = colorImage.a;
			  material.diffuse = colorImage.rgb * 1.5 ;
			  return material;
			}
			`,
		},
		translucent: function (material: any) {
			return true;
		},
	});

	Cesium.GeoJsonDataSource.load("/static/shaderNeeds/gaochun_xianshengdao_route1.geojson").then((dataSource) => {
		viewer.dataSources.add(dataSource);
		const entitiesArr: any = dataSource.entities.values;
		for (let i = 0; i < entitiesArr.length; i++) {
			const entity = entitiesArr[i];
			entity.polyline.width = 1;
			entity.polyline.material = new Spriteline1MaterialProperty(3000);
		}
	});
}
