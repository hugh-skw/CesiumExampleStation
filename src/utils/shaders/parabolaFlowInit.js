/**
 * @description: 抛物飞线效果初始化
 * @param {*} _viewer
 * @param {*} _num :每条线上的飞线数量
 * @return {*}
 */
import * as Cesium from "cesium";
/*
 * @Description: 飞线效果（参考开源代码）
 * @Version: 1.0
 * @Author: Julian
 * @Date: 2022-03-05 16:13:21
 * @LastEditors: hugh-skw 43328844+hugh-skw@users.noreply.github.com
 * @LastEditTime: 2023-03-06 10:54:08
 */

export function parabolaFlowInit(_viewer, _num, direction = "out") {
	function LineFlowMaterialProperty(options) {
		this._definitionChanged = new Cesium.Event();
		this._color = undefined;
		this._speed = undefined;
		this._percent = undefined;
		this._gradient = undefined;
		this.color = options.color;
		this.speed = options.speed;
		this.percent = options.percent;
		this.gradient = options.gradient;
		this._time = new Date().getTime();
	}

	Object.defineProperties(LineFlowMaterialProperty.prototype, {
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
		speed: Cesium.createPropertyDescriptor("speed"),
		percent: Cesium.createPropertyDescriptor("percent"),
		gradient: Cesium.createPropertyDescriptor("gradient"),
	});
	LineFlowMaterialProperty.prototype.getType = function (time) {
		return "LineFlowMaterialType";
	};
	LineFlowMaterialProperty.prototype.getValue = function (time, result) {
		if (!Cesium.defined(result)) {
			result = {};
		}

		result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
		result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 5.0, result.speed);
		result.percent = Cesium.Property.getValueOrDefault(this._percent, time, 0.1, result.percent);
		result.gradient = Cesium.Property.getValueOrDefault(this._gradient, time, 0.01, result.gradient);
		return result;
	};
	LineFlowMaterialProperty.prototype.equals = function (other) {
		return (
			this === other ||
			(other instanceof LineFlowMaterialProperty &&
				Cesium.Property.equals(this._color, other._color) &&
				Cesium.Property.equals(this._speed, other._speed) &&
				Cesium.Property.equals(this._percent, other._percent) &&
				Cesium.Property.equals(this._gradient, other._gradient))
		);
	};

	Cesium.Material._materialCache.addMaterial("LineFlowMaterialType", {
		fabric: {
			type: "LineFlowMaterialType",
			uniforms: {
				color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
				speed: 10.0,
				percent: 0.1,
				gradient: 0.01,
			},
			source: `
            uniform vec4 color;
            uniform float speed;
            uniform float percent;
            uniform float gradient;
            
            czm_material czm_getMaterial(czm_materialInput materialInput){
              czm_material material = czm_getDefaultMaterial(materialInput);
              vec2 st = materialInput.st;
              float t =fract(czm_frameNumber * speed / 1000.0);
              t *= (1.0 + percent);
              float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
              alpha += gradient;
              material.diffuse = color.rgb;
              material.alpha = alpha;
              return material;
            }
            `,
		},
		translucent: function (material) {
			return true;
		},
	});
	let _center = [113.9236839, 22.528061];
	let parentEntity = new Cesium.Entity({
		id: "parabolaEntity",
		position: new Cesium.Cartesian3.fromDegrees(..._center),
		point: {
			color: Cesium.Color.RED,
		},
	});
	let _positions = [
		[113.8236839, 22.528061],
		[114.0236839, 22.528061],
		[113.9236839, 22.428061],
		[113.9236839, 22.628061],
		[113.8236839, 22.428061],
		[114.0236839, 22.628061],
		[113.8236839, 22.628061],
		[114.0236839, 22.428061],
	];
	_positions.forEach((item, index) => {
		let _siglePositions = parabola(_center, item, 5000);
		// 创建飞线
		for (let i = 0; i < _num; i++) {
			_viewer.entities.add({
				parent: parentEntity,
				polyline: {
					positions: direction === "out" ? _siglePositions : _siglePositions.reverse(),
					material: new LineFlowMaterialProperty({
						color: new Cesium.Color(1.0, 1.0, 0.0, 0.8),
						speed: 15 * Math.random(),
						percent: 0.1,
						gradient: 0.01,
					}),
				},
			});
		}
		// 创建轨迹线
		// let entity = _viewer.entities.add({
		// 	parent: parentEntity,
		// 	polyline: {
		// 		positions: _siglePositions,
		// 		material: new Cesium.Color(1.0, 1.0, 0.0, 0.0),
		// 	},
		// });
		// if (index === _positions.length - 1) {
		// 	_viewer.flyTo(entity);
		// }
	});
	_viewer.entities.add(parentEntity);
	_viewer.flyTo(parentEntity);

	/**
	 * @description: 抛物线构造函数（参考开源代码）
	 * @param {*}
	 * @return {*}
	 */
	function parabola(startPosition, endPosition, height = 0, count = 50) {
		//方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
		let result = [];
		height = Math.max(+height, 100);
		count = Math.max(+count, 50);
		let diffLon = Math.abs(startPosition[0] - endPosition[0]);
		let diffLat = Math.abs(startPosition[1] - endPosition[1]);
		let L = Math.max(diffLon, diffLat);
		let dlt = L / count;
		if (diffLon > diffLat) {
			//base on lon
			let delLat = (endPosition[1] - startPosition[1]) / count;
			if (startPosition[0] - endPosition[0] > 0) {
				dlt = -dlt;
			}
			for (let i = 0; i < count; i++) {
				let h = height - (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) / Math.pow(L, 2);
				let lon = startPosition[0] + dlt * i;
				let lat = startPosition[1] + delLat * i;
				let point = new Cesium.Cartesian3.fromDegrees(lon, lat, h);
				result.push(point);
			}
		} else {
			//base on lat
			let delLon = (endPosition[0] - startPosition[0]) / count;
			if (startPosition[1] - endPosition[1] > 0) {
				dlt = -dlt;
			}
			for (let i = 0; i < count; i++) {
				let h = height - (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) / Math.pow(L, 2);
				let lon = startPosition[0] + delLon * i;
				let lat = startPosition[1] + dlt * i;
				let point = new Cesium.Cartesian3.fromDegrees(lon, lat, h);
				result.push(point);
			}
		}
		return result;
	}
}
