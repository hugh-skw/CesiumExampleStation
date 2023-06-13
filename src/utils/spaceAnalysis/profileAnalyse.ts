import * as Cesium from "cesium";
import * as echarts from "echarts";
import * as turf from "@turf/turf";
class ProfileAnalyse {
	handler: any;
	polyline_point_arr: number[];
	temporary_polyline_entity: any;
	analyseResult: any;
	constructor() {
		this.handler = null;
		this.polyline_point_arr = [];
		this.temporary_polyline_entity = null;
		this.analyseResult = null;
	}

	createDom(viewer: Cesium.Viewer): void {
		// viewer = viewer;
		const mapContainer = document.getElementById("mapContainer");

		const div = document.createElement("div");
		div.style.setProperty("position", "absolute");
		div.style.setProperty("right", "10px");
		div.style.setProperty("top", "7px");
		div.style.setProperty("width", "260px");
		div.style.setProperty("height", "48px");
		div.style.setProperty("display", "flex");
		div.style.setProperty("align-items", "center");
		div.style.setProperty("justify-content", "space-between");
		div.style.setProperty("background-color", "#0288d1");
		div.style.setProperty("padding", "0 18px 0 18px");
		div.style.setProperty("border-radius", "2px");
		mapContainer?.appendChild(div);

		const drawButton = document.createElement("input");
		drawButton.className = "origin-button-class";
		drawButton.type = "button";
		drawButton.value = "绘制";
		drawButton.onclick = () => {
			this.draw(viewer);
		};

		const clearButton = document.createElement("input");
		clearButton.className = "origin-button-class";
		clearButton.type = "button";
		clearButton.value = "清除";

		div.appendChild(drawButton);
		div.appendChild(clearButton);
	}

	draw(viewer: Cesium.Viewer) {
		// 清除可能会用到的监听事件
		if (this.handler) {
			this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
			this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		}
		this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

		//鼠标左键--确定选中点
		this.handler.setInputAction((event: any) => {
			// 屏幕坐标转为世界坐标
			const pickRay: any = viewer.camera.getPickRay(event.position);
			const cartesian: any = viewer.scene.globe.pick(pickRay, viewer.scene);
			const ellipsoid = viewer.scene.globe.ellipsoid;
			const cartographic = ellipsoid.cartesianToCartographic(cartesian);
			const lat = Cesium.Math.toDegrees(cartographic.latitude);
			const lon = Cesium.Math.toDegrees(cartographic.longitude);
			const height = cartographic.height;
			// 判断是否定义（是否可以获取到空间坐标）
			if (Cesium.defined(cartesian)) {
				// 将点添加进保存线的坐标的数组中，鼠标停止移动的时添加的点和，点击时候添加的点，坐标一样
				// 注意顺序不能错了，先经度后纬度
				this.polyline_point_arr.push(lon);
				this.polyline_point_arr.push(lat);
				this.polyline_point_arr.push(height);
				// 判断是否开始绘制动态线，没有的话则开始绘制
				if (this.temporary_polyline_entity == null) {
					// 绘制动态线
					this.draw_dynamic_polyline(viewer);
				}
			}

			//鼠标移动--实时绘制线
			this.handler.setInputAction((event: any) => {
				// debugger;
				// 屏幕坐标转为世界坐标
				const pickRay: any = viewer.camera.getPickRay(event.endPosition);
				const cartesian: any = viewer.scene.globe.pick(pickRay, viewer.scene);
				const ellipsoid = viewer.scene.globe.ellipsoid;
				const cartographic = ellipsoid.cartesianToCartographic(cartesian);
				const lon = Cesium.Math.toDegrees(cartographic.longitude); // 经度
				const lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
				const height = cartographic.height;

				// 判断是否定义（是否可以获取到空间坐标）
				if (Cesium.defined(cartesian)) {
					// 判断是否已经开始绘制动态线，已经开始的话，则可以动态拾取鼠标移动的点，修改点的坐标
					if (this.temporary_polyline_entity) {
						// 只要元素点大于二，每次就删除二个点，因为实时动态的点是添加上去的
						if (this.polyline_point_arr.length > 3) {
							// 删除数组最后两个元素（鼠标移动添加进去的点）
							this.polyline_point_arr.pop();
							this.polyline_point_arr.pop();
							this.polyline_point_arr.pop();
						}
						// 将新的点添加进动态线的坐标的数组中，用于实时变化，注意：这里是先添加了一个点，然后再删除点，再添加，这样重复的
						// 注意顺序不能错了，先经度后纬度
						this.polyline_point_arr.push(lon);
						this.polyline_point_arr.push(lat);
						this.polyline_point_arr.push(height);
					}
				}
			}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

		//鼠标右键--结束绘制
		this.handler.setInputAction(async (event: any) => {
			// 取消鼠标移动监听
			this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			// 清除动态绘制的线
			viewer.entities.remove(this.temporary_polyline_entity);
			// 删除保存的临时线的entity
			this.temporary_polyline_entity = null;
			// 绘制结果线
			this.draw_polyline(viewer);
			// 剖面分析
			const pointsLength = this.polyline_point_arr.length;
			const start = Cesium.Cartesian3.fromDegreesArrayHeights([this.polyline_point_arr[0], this.polyline_point_arr[1], this.polyline_point_arr[2]]);
			const end = Cesium.Cartesian3.fromDegreesArrayHeights([
				this.polyline_point_arr[pointsLength - 3],
				this.polyline_point_arr[pointsLength - 2],
				this.polyline_point_arr[pointsLength - 1],
			]);
			this.analyseResult = await this.profileAnalyse(viewer, start[0], end[0]);
			this.setEchartsData(this.analyseResult);
			// 清空线点数组，用于下次绘制
			this.polyline_point_arr = [];
			// 清除所有事件
			if (this.handler) {
				this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
				this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
				this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
			}
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	}
	//绘制结果线
	draw_polyline(viewer: Cesium.Viewer) {
		// 不需要线条闭合的话，删除最后一个动态添加的点（经度和纬度），如果鼠标没移动，最后一个和倒数第二个是一样的，所以也要删除
		// this.polyline_point_arr.pop();
		// this.polyline_point_arr.pop();
		// 需要线条闭合的话，下面两句(将起始点添加到结尾)
		// polyline_point_arr[polyline_point_arr.length - 2] = polyline_point_arr[0];
		// polyline_point_arr[polyline_point_arr.length - 1] = polyline_point_arr[1];
		// 两个点以上才能绘制成线
		if (this.polyline_point_arr.length >= 3) {
			const polyline_point_entity = viewer.entities.add({
				polyline: {
					// Cesium.Cartesian3.fromDegreesArray([经度1, 纬度1, 经度2, 纬度2,])
					// Cesium.Cartesian3.fromDegreesArrayHeights([经度1, 纬度1, 高度1, 经度2, 纬度2, 高度2])
					// 如果有高度，上面的 polyline_point_arr 里面要增加高度的
					positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.polyline_point_arr),
					// 宽度
					width: 2,
					// 线的颜色
					material: Cesium.Color.RED,
					// 是否显示
					show: true,
					clampToGround: true,
				},
			});
		} else {
			return;
		}
	}

	//绘制动态线
	draw_dynamic_polyline(viewer: Cesium.Viewer) {
		this.temporary_polyline_entity = viewer.entities.add({
			polyline: {
				// 这个方法上面有重点说明
				positions: new Cesium.CallbackProperty(() => {
					return Cesium.Cartesian3.fromDegreesArrayHeights(this.polyline_point_arr);
				}, false),
				// 宽度
				width: 2,
				// 线的颜色
				material: Cesium.Color.RED,
				// 是否显示
				show: true,
				clampToGround: true,
			},
		});
	}

	//剖面分析
	async profileAnalyse(viewer: Cesium.Viewer, start: any, end: any) {
		const profile: any = {
			arrLX: [],
			ponits: [],
			arrPoint: [],
			arrHB: [],
			distance: 0,
		};
		const startGraphic = Cesium.Cartographic.fromCartesian(start);
		const endGraphic = Cesium.Cartographic.fromCartesian(end);
		const startPoint = {
			lon: Cesium.Math.toDegrees(startGraphic.longitude),
			lat: Cesium.Math.toDegrees(startGraphic.latitude),
		};
		const endPoint = {
			lon: Cesium.Math.toDegrees(endGraphic.longitude),
			lat: Cesium.Math.toDegrees(endGraphic.latitude),
		};
		const distanceBetweenStartEnd = turf.distance(turf.point([startPoint.lon, startPoint.lat]), turf.point([endPoint.lon, endPoint.lat]), {
			units: "miles",
		});
		profile.distance = distanceBetweenStartEnd;
		for (let i = 0; i < 100; i++) {
			profile.arrLX.push(i * (distanceBetweenStartEnd / 100));
		}
		const splicePointsFeatures = turf.lineChunk(
			turf.lineString([
				[startPoint.lon, startPoint.lat],
				[endPoint.lon, endPoint.lat],
			]),
			distanceBetweenStartEnd / 100,
			{
				units: "miles",
			}
		).features;
		const splicePointsArr: any = [];
		const splicePointsCartographicArr: any = [];
		splicePointsFeatures.forEach((feature) => {
			const coordinates = feature.geometry.coordinates;
			splicePointsArr.push(coordinates[0]);
			const c3 = Cesium.Cartesian3.fromDegrees(coordinates[0][0], coordinates[0][1]);
			splicePointsCartographicArr.push(Cesium.Cartographic.fromCartesian(c3));
		});
		profile.arrPoint = splicePointsArr;
		// 在地形上获取高度
		const sampleTerrainMostDetailed = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, splicePointsCartographicArr);
		sampleTerrainMostDetailed.forEach((cartographic) => {
			profile.arrHB.push(cartographic.height);
		});
		return profile;
	}
	//计算两点间的距离
	distance(viewer: Cesium.Viewer, point1: any, point2: any) {
		//let point1cartographic = Cesium.Cartographic.fromCartesian(point1);
		//let point2cartographic = Cesium.Cartographic.fromCartesian(point2);
		/**根据经纬度计算出距离**/
		const geodesic = new Cesium.EllipsoidGeodesic();
		geodesic.setEndPoints(point1, point2);
		let s = geodesic.surfaceDistance;
		//返回两点之间的距离
		s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2.height - point1.height, 2));
		return s;
	}
	//世界坐标转换为经纬度
	getDegrees(viewer: Cesium.Viewer, cart: any) {
		// const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cart);
		const lat = Cesium.Math.toDegrees(cart.latitude || cart.y);
		const lng = Cesium.Math.toDegrees(cart.longitude || cart.x);
		const alt = cart.height || cart.z;
		return { x: lng, y: lat, z: alt };
	}
	//经纬度保留两位小数
	strFormat(str: string) {
		const strString = str.toString();
		const strs = strString.slice(0, strString.indexOf(".") + 3);
		return strs;
	}
	//设置Echart数据
	setEchartsData(e: any) {
		const t = e.arrPoint;
		const chartData = {
			grid: {
				left: 10,
				right: 10,
				bottom: 10,
				containLabel: !0,
			},
			dataZoom: [
				{
					type: "inside",
					throttle: 50,
				},
			],
			tooltip: {
				trigger: "axis",
				formatter: (e: any) => {
					let a = "";
					if (0 == e.length) return a;
					e[0].value;
					const r = t[e[0].dataIndex];
					return (a +=
						"所在位置&nbsp;经度" +
						this.strFormat(r[0]) +
						",纬度" +
						this.strFormat(r[1]) +
						"<br />距起点&nbsp;<label>" +
						e[0].axisValue +
						"</label><br />" +
						e[0].seriesName +
						"&nbsp;<label style='color:" +
						e[0].color +
						";'>" +
						e[0].value +
						"</label><br />");
				},
			},
			xAxis: [
				{
					name: "行程",
					type: "category",
					boundaryGap: !1,
					axisLine: {
						show: !1,
					},
					axisLabel: {
						show: !1,
					},
					data: e.arrLX,
				},
			],
			yAxis: [
				{
					type: "value",
					axisLabel: {
						rotate: 60,
						formatter: "{value} 米",
					},
				},
			],
			series: [
				{
					name: "高程值",
					type: "line",
					smooth: !0,
					symbol: "none",
					sampling: "average",
					itemStyle: {
						normal: {
							color: "rgb(255, 70, 131)",
						},
					},
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: "rgb(255, 158, 68)",
								},
								{
									offset: 1,
									color: "rgb(255, 70, 131)",
								},
							]),
						},
					},
					data: e.arrHB,
				},
			],
		};
		if (document.getElementById("profileAnalyse-echarts")) {
			document.getElementById("profileAnalyse-echarts")!.innerHTML = "";
		}
		const echartsDiv = document.createElement("div");
		echartsDiv.style.width = "calc(100% - 200px)";
		echartsDiv.style.height = "300px";
		echartsDiv.style.position = "absolute";
		echartsDiv.style.bottom = "100px";
		echartsDiv.style.right = "0";
		echartsDiv.id = "profileAnalyse-echarts";
		document.getElementById("mapContainer")!.appendChild(echartsDiv);
		const profileAnalyseEcharts = echarts.init(echartsDiv);
		profileAnalyseEcharts.setOption(chartData);
	}
}

export default ProfileAnalyse;
