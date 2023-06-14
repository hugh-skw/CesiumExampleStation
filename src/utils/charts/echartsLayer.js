import * as Cesium from "cesium/Cesium";
import * as echarts from "echarts";
!(function () {
	function EchartsLayer(viewer) {
		this._viewer = viewer;
		registerMap(this);
		createChart(this);
		resize(this);
	}

	Object.defineProperties(EchartsLayer.prototype, {
		chart: {
			get: function () {
				return this._chart;
			},
		},
	});

	function registerMap(layer) {
		if (!Cesium.defined(echarts)) {
			throw new Cesium.DeveloperError("echarts is undefined.");
		}
		echarts.registerCoordinateSystem("GLMap", getCoordinateSystem(layer._viewer)),
			echarts.registerAction(
				{
					type: "GLMapRoam",
					event: "GLMapRoam",
					update: "updateLayout",
				},
				function (t, e) {
					//
				}
			),
			echarts.extendComponentModel({
				type: "GLMap",
				defaultOption: { roam: !1 },
			});
		echarts.extendComponentView({
			type: "GLMap",
			init: function (t, e) {
				this.api = e;
				layer._viewer.scene.postRender.addEventListener(this.moveHandler, this);
			},
			moveHandler: function (t, e) {
				this.api.dispatchAction({
					type: "GLMapRoam",
				});
			},
			render: function (t, e, i) {
				//
			},
			dispose: function (t) {
				layer._viewer.scene.postRender.removeEventListener(this.moveHandler, this);
			},
		});
	}

	function createChart(layer) {
		var scene = layer._viewer.scene;
		scene.canvas.setAttribute("tabIndex", 0);
		var ele = document.createElement("div");
		ele.style.position = "absolute";
		ele.style.top = "0px";
		ele.style.left = "0px";
		ele.style.width = scene.canvas.width + "px";
		ele.style.height = scene.canvas.height + "px";
		ele.style.pointerEvents = "none";
		ele.setAttribute("id", "echarts");
		ele.setAttribute("class", "echartMap");
		layer._viewer.container.appendChild(ele);
		layer._echartsContainer = ele;
		layer._chart = echarts.init(ele);
	}

	function resize(layer) {
		window.onresize = function () {
			var scene = layer._viewer.scene;
			layer._echartsContainer.style.width = scene.canvas.style.width + "px";
			layer._echartsContainer.style.height = scene.canvas.style.height + "px";
			layer._chart.resize();
		};
	}

	EchartsLayer.prototype.isDestroyed = function () {
		return false;
	};

	EchartsLayer.prototype.destroy = function () {
		if (this._echartsContainer) {
			this._viewer.container.removeChild(this._echartsContainer);
			this._echartsContainer = undefined;
		}
		if (this._chart) {
			this._chart.dispose();
			this._chart = undefined;
		}
		Cesium.destroyObject(this);
	};

	function getCoordinateSystem(viewer) {
		function GLMapCoordSys(api) {
			this.dimensions = ["lng", "lat"];
			this._mapOffset = [0, 0];
			this._api = api;
			this._viewer = viewer;
			this._occluder = new Cesium.EllipsoidalOccluder(this._viewer.scene.globe.ellipsoid, this._viewer.scene.camera.position);
		}

		GLMapCoordSys.prototype.dimensions = ["lng", "lat"];

		GLMapCoordSys.prototype.setMapOffset = function (mapOffset) {
			this._mapOffset = mapOffset;
		};

		GLMapCoordSys.prototype.dataToPoint = function (data) {
			var e = [0, 0],
				i = Cesium.Cartesian3.fromDegrees(data[0], data[1]);
			if (!i) return e;
			this._occluder.cameraPosition = this._viewer.scene.camera.position;
			if (!this._occluder.isPointVisible(i)) {
				return [];
			}
			var n = viewer.scene.cartesianToCanvasCoordinates(i);
			if (!n) return e;
			return Cesium.Cartesian3.angleBetween(viewer.scene.camera.position, i) < Cesium.Math.toRadians(75)
				? [n.x - this._mapOffset[0], n.y - this._mapOffset[1]]
				: e;
		};

		GLMapCoordSys.prototype.pointToData = function (pt) {
			var mapOffset = this._mapOffset;
			var cart = viewer.scene.pickPosition(new Cesium.Cartesian2(pt[0] + mapOffset[0], pt[1] + mapOffset[1]), new Cesium.Cartesian3());
			var carto = Cesium.Cartographic.fromCartesian(cart);
			return [Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)];
		};

		GLMapCoordSys.prototype.getViewRect = function () {
			var api = this._api;
			return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
		};

		GLMapCoordSys.prototype.getRoamTransform = function () {
			return echarts.matrix.create();
		};

		GLMapCoordSys.dimensions = GLMapCoordSys.prototype.dimensions;

		GLMapCoordSys.create = function (ecModel, api) {
			var coordSys;
			ecModel.eachComponent("GLMap", function (GLMapModel) {
				coordSys = new GLMapCoordSys(api);
				coordSys.setMapOffset(GLMapModel.__mapOffset || [0, 0]);
				GLMapModel.coordinateSystem = coordSys;
			});
			ecModel.eachSeries(function (seriesModel) {
				if (seriesModel.get("coordinateSystem") === "GLMap") {
					seriesModel.coordinateSystem = coordSys;
				}
			});
		};
		return GLMapCoordSys;
	}

	window.EchartsLayer = EchartsLayer;
})();
