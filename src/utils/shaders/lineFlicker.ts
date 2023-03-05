import * as Cesium from "cesium";

class LineFlickerMaterialProperty {
	_definitionChanged: any;
	_color: any;
	_speed: any;
	color: any;
	speed: any;
	constructor(color: any, speed: any) {
		this._definitionChanged = new Cesium.Event();
		this._color = undefined;
		this._speed = undefined;
		this.color = color;
		this.speed = speed;
	}

	get isConstant() {
		return false;
	}

	get definitionChanged() {
		return this._definitionChanged;
	}

	getType(time: any) {
		return "LineFlickerMaterialProperty";
	}

	getValue(time: any, result: any) {
		if (!Cesium.defined(result)) {
			result = {};
		}

		result.color = Cesium.Property.getValueOrDefault(this._color, time, this.color, result.color);
		result.speed = Cesium.Property.getValueOrDefault(this._speed, time, this.speed, result.speed);
		return result;
	}

	equals(other: any) {
		return (
			this === other ||
			(other instanceof LineFlickerMaterialProperty &&
				Cesium.Property.equals(this._color, other._color) &&
				Cesium.Property.equals(this._speed, other._speed))
		);
	}
}

export function lineFlickerMaterial(viewer: Cesium.Viewer, color: any, speed: number) {
	Object.defineProperties(LineFlickerMaterialProperty.prototype, {
		color: Cesium.createPropertyDescriptor("color"),
		speed: Cesium.createPropertyDescriptor("speed"),
	});
	Cesium.Material._materialCache.addMaterial("LineFlickerMaterialProperty", {
		fabric: {
			type: "LineFlickerMaterialProperty",
			uniforms: {
				color: Cesium.Color.YELLOW,
				speed: 5.0,
			},
			source: `
            uniform vec4 color;
            uniform float speed;
            czm_material czm_getMaterial(czm_materialInput materialInput){
              czm_material material = czm_getDefaultMaterial(materialInput);
              float time = fract( czm_frameNumber  *  speed / 1000.0);
              vec2 st = materialInput.st;
              float scalar = smoothstep(0.0,1.0,time);
              material.diffuse = color.rgb * scalar;
              material.alpha = color.a * scalar ;
              return material;
            }
            `,
		},
		translucent: function (material: any) {
			return true;
		},
	});
	// 道路闪烁线
	Cesium.GeoJsonDataSource.load("/static/shaderNeeds/gaochun_xianshengdao_route1.geojson").then(function (dataSource) {
		viewer.dataSources.add(dataSource);
		const entities = dataSource.entities.values;
		// 聚焦
		viewer.zoomTo(entities);
		for (let i = 0; i < entities.length; i++) {
			const entity: any = entities[i];
			entity.polyline.width = 3.0;
			// 设置材质
			entity.polyline.material = new LineFlickerMaterialProperty(
				color,
				// 设置随机变化速度
				speed
			);
		}
	});
}
