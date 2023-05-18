<template>
	<div id="leftNav">
		<el-menu
			active-text-color="#ffd04b"
			background-color="#545c64"
			class="el-menu-vertical-demo"
			default-active="1"
			text-color="#fff"
			style="height: 100%"
		>
			<el-sub-menu index="1">
				<template #title>
					<i class="iconfont icon-VertexShader menuItab" />
					<span>着色器材质</span>
				</template>
				<el-menu-item-group title="天气">
					<el-menu-item index="1-1" @click="createShaderMaterial('1-1')">雨天</el-menu-item>
					<el-menu-item index="1-2" @click="createShaderMaterial('1-2')">雪天</el-menu-item>
					<el-menu-item index="1-3" @click="createShaderMaterial('1-3')">雾天</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group>
					<template #title><span>线</span></template>
					<el-menu-item index="1-4" @click="createShaderMaterial('1-4')">道路穿梭线</el-menu-item>
					<el-menu-item index="1-5" @click="createShaderMaterial('1-5')">道路闪烁线</el-menu-item>
					<el-menu-item index="1-6" @click="createShaderMaterial('1-6')">抛物流动飞线</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group>
					<template #title><span>墙</span></template>
					<el-menu-item index="1-7" @click="createShaderMaterial('1-7')">动态立体墙</el-menu-item>
					<el-menu-item index="1-8" @click="createShaderMaterial('1-8')">道路闪烁线</el-menu-item>
					<el-menu-item index="1-9" @click="createShaderMaterial('1-9')">抛物流动飞线</el-menu-item>
				</el-menu-item-group>
			</el-sub-menu>
			<el-menu-item index="2">
				<i class="iconfont icon-moxingtiaodu menuItab" />
				<template #title>模型调度</template>
			</el-menu-item>
			<el-menu-item index="3">
				<i class="iconfont icon-layer menuItab" />
				<template #title>图层加载</template>
			</el-menu-item>
			<el-menu-item index="4" @click="createDialogCss">
				<i class="iconfont icon-layer menuItab" />
				<template #title>弹窗样式</template>
			</el-menu-item>
			<el-menu-item index="5" @click="createDitheringBillboard">
				<i class="iconfont icon-layer menuItab" />
				<template #title>鼠标悬浮billboard</template>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script lang="ts" setup>
import * as Cesium from "cesium";
import { parabolaFlowInit, roadRapidEffect, lineFlickerMaterial, startRain, startSnow, startFog, dynamicWall } from "@/utils/shaders";
import { ref, getCurrentInstance } from "vue";
import { getAssetsFile } from "@/utils/tools/unit";

const { proxy } = getCurrentInstance() as any; //获取上下文实例，ctx=vue2的this

let rain: any = null;
let snow: any = null;
let fog: any = null;
const createShaderMaterial = (type: string) => {
	try {
		if (rain) {
			rain.destroy();
			rain = null;
		}
		if (snow) {
			snow.destroy();
			snow = null;
		}
		if (fog) {
			fog.destroy();
			fog = null;
		}
	} finally {
		switch (type) {
			case "1-1":
				proxy.$message({
					type: "success",
					message: "雨天",
					duration: 3000,
				});
				rain = startRain(window.viewer, {
					tiltAngle: -0.6, //倾斜角度
					rainSize: 0.6, // 雨大小
					rainSpeed: 120.0, // 雨速
				});
				break;
			case "1-2":
				proxy.$message({
					type: "success",
					message: "雪天",
					duration: 3000,
				});
				snow = startSnow(window.viewer, {
					snowSize: 0.02, // 雪花大小
					snowSpeed: 60.0, // 雪速
				});
				break;
			case "1-3":
				proxy.$message({
					type: "success",
					message: "雾天",
					duration: 3000,
				});
				snow = startFog(window.viewer, {
					visibility: 0.2,
					color: new Cesium.Color(0.8, 0.8, 0.8, 0.3),
				});
				break;
			case "1-4":
				proxy.$message({
					type: "success",
					message: "道路穿梭线",
					duration: 3000,
				});
				roadRapidEffect(window.viewer, 3000, "");
				break;
			case "1-5":
				proxy.$message({
					type: "success",
					message: "道路穿梭线",
					duration: 3000,
				});
				lineFlickerMaterial(
					window.viewer,
					Cesium.Color.YELLOW,
					// 设置随机变化速度
					20 * Math.random()
				);
				break;
			case "1-6":
				proxy.$message({
					type: "success",
					message: "抛物流动飞线",
					duration: 3000,
				});
				parabolaFlowInit(window.viewer, 5, "in");

				break;
			case "1-7":
				proxy.$message({
					type: "success",
					message: "动态立体墙",
					duration: 3000,
				});
				dynamicWall(window.viewer, Cesium.Cartesian3.fromDegreesArray([-107.0, 43.0, -97.0, 43.0, -97.0, 40.0, -107.0, 40.0, -107.0, 43.0]));

				break;
			default:
				proxy.$message({
					type: "warning",
					message: "开发中~~~~~",
					duration: 3000,
				});
		}
	}
};
const drawCanvas = function () {
	let canvas: HTMLCanvasElement = document.createElement("canvas");
	canvas.width = 100;
	canvas.height = 100;
	let ctx1: CanvasRenderingContext2D = canvas.getContext("2d");
	let x = canvas.width / 2;
	let y = canvas.height / 2;
	let radius = 30;

	ctx1.beginPath();
	ctx1.arc(x, y, radius, 0, Math.PI * 2);
	ctx1.strokeStyle = "#00f";
	ctx1.lineWidth = 10;
	ctx1.stroke();

	let ctx2: CanvasRenderingContext2D = canvas.getContext("2d");
	let x2 = canvas.width / 2;
	let y2 = canvas.height / 2;
	let radius2 = 15;
	ctx2.beginPath();
	ctx2.arc(x, y, radius2, 0, Math.PI * 2);
	ctx2.closePath();
	ctx2.fillStyle = "#00f";
	// ctx2.lineWidth = 10;
	ctx2.fill();
	return canvas;
};

const createDialogCss = () => {
	let initScale = 0.2;
	let iconStatus = "plus";
	const entity = window.viewer.entities.add({
		id: "overWindow_point",
		position: Cesium.Cartesian3.fromDegrees(118.770959, 31.988475),
		billboard: {
			// image: getAssetsFile("icons/locate.png"),
			image: drawCanvas(),
			scale: new Cesium.CallbackProperty(() => {
				if (iconStatus === "plus") {
					initScale += 0.002;
				}
				if (iconStatus === "minus") {
					initScale -= 0.002;
				}
				if (initScale <= 0.2) {
					iconStatus = "plus";
				}
				if (initScale >= 0.3) {
					iconStatus = "minus";
				}
				return initScale;
			}, false),
		},
		properties: {
			locate: "安德门大街",
			name: "南京航天宏图信息技术有限公司",
		},
	});
	let setTimeoutId = -1;
	let animations = [1, 2, 3, 4, 5, 6, 7, 8];
	let index = 0;
	let dx = 1;
	let dy = 0;
	let x = 20;
	let y = 33;

	let timex = 33;
	window.viewer.screenSpaceEventHandler.setInputAction(async (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
		const pickId = window.viewer.scene.pick(event.position).id;
		const position = pickId.position._value;
		// const drawRoom1Res = await drawRoom1(getAssetsFile("icons/label_bg.png"));
		// testLabelCanvas("测试Label", (canvasRes: HTMLCanvasElement) => {
		window.viewer.entities.add({
			id: "test_label_canvas",
			position: position,
			// point: {
			// 	pixelSize: 1,
			// },
			billboard: {
				// material: new Cesium.ImageMaterialProperty({
				image: new Cesium.CallbackProperty((time, res) => {
					const canvas = document.createElement("canvas");
					// function handleExecute() {
					// 获取canvas元素
					// const canvas = document.querySelector("#myCanvas");
					canvas.width = 700;
					canvas.height = 700;

					// 获取canvas渲染上下文
					const ctx = canvas.getContext("2d");

					// 设置线条样式
					ctx.strokeStyle = "rgba(81, 160, 255,1)";
					ctx.lineWidth = 4;
					ctx.lineJoin = "round";

					// 定义起点和终点的坐标
					const startX = 100;
					const startY = 100;
					const endX = 700;
					const endY = 700;
					let prevX = startX;
					let prevY = startY;
					let nextX;
					let nextY;
					// 第一帧执行的时间
					let startTime;
					// 期望动画持续的时间
					const duration = 1000;

					/*
					 * 动画帧绘制方法.
					 * currentTime是requestAnimation执行回调方法step时会传入的一个执行时的时间(由performance.now()获得).
					 * */
					const step = (currentTime: any) => {
						// 第一帧绘制时记录下开始的时间
						!startTime && (startTime = currentTime);
						// 已经过去的时间(ms)
						const timeElapsed = currentTime - startTime;
						// 动画执行的进度 {0,1}
						const progress = Math.min(timeElapsed / duration, 1);

						// 绘制方法
						const draw = () => {
							console.log(prevX, prevY);
							// 创建新的路径
							ctx.beginPath();
							// 创建子路径,并将起点移动到上一帧绘制到达的坐标点
							ctx.moveTo(prevX, prevY);
							// 计算这一帧中线段应该到达的坐标点,并且将prevX/Y更新为此值给下一帧使用.
							prevX = nextX = startX + (endX - startX) * progress;
							prevY = nextY = startY + (endY - startY) * progress;
							// 用直线将刚刚moveTo中的点连接到(nextX,nextY)上
							ctx.lineTo(nextX, nextY);
							ctx.strokeStyle = `rgba(${81}, ${160}, ${255},${0.25})`;
							// 把这一帧的路径绘制出来
							ctx.stroke();
						};
						draw();

						// if (progress < 1) {
						// 	requestAnimationFrame(step);
						// } else {
						// 	console.log("动画执行完毕");
						// }
					};
					step(time);
					// requestAnimationFrame(step);
					// }
					return canvas.toDataURL("image/png");
				}, false),
				pixelOffset: new Cesium.Cartesian2(150, -60),
				// transparent: true,
				// }),
				// height: 0.0,
				// semiMajorAxis: 1000.0,
			},
			// billboard: {
			// 	image: new Cesium.CallbackProperty(() => drawRoom1(getAssetsFile("icons/label_bg.png")), false),
			// 	// image: getAssetsFile("icons/label_bg_content.png"),
			// 	// new Cesium.CallbackProperty(() => {
			// 	// 	let canvas: HTMLCanvasElement = document.createElement("canvas");
			// 	// 	canvas.width = 120;
			// 	// 	canvas.height = 40;
			// 	// 	if (canvas.getContext) {
			// 	// 		let ctx = canvas.getContext("2d");
			// 	// 		// 定义图像
			// 	// 		let img = new Image();
			// 	// 		// 设置图像的地址
			// 	// 		img.src = getAssetsFile("icons/label_bg_content.png");
			// 	// 		// img.src = "https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9057bd739104dfe95855c7ba694a545~tplv-k3u1fbpfcp-watermark.image";
			// 	// 		// img.onload = function () {
			// 	// 		ctx.clearRect(0, 0, 120, 40);
			// 	// 		x = x + dx;
			// 	// 		y = y + dy;
			// 	// 		ctx.fillStyle = "#ffffff";
			// 	// 		ctx.fillRect(0, 0, 119, 33);
			// 	// 		// };

			// 	// 		return canvas;

			// 	// 		// 动画绘制
			// 	// 	}
			// 	// }, false),
			// 	scale: 1,
			// 	pixelOffset: new Cesium.Cartesian2(150, -60),
			// },
		});
		// });
		// console.log(labelCanvas);

		let bubble = document.createElement("div");
		bubble.setAttribute("id", "bubbleDiv");
		//设置弹出框位置
		let winpos = window.viewer.scene.cartesianToCanvasCoordinates(position);
		bubble.style.width = "500px";
		bubble.style.height = "300px";
		bubble.style.position = "absolute";
		bubble.style.background = "transparent";
		bubble.style.zIndex = "999";
		bubble.style.left = winpos.x + 20 + "px";
		bubble.style.top = winpos.y + 50 + "px";
		bubble.innerHTML = `	<div class="bubble_box">
									<span></span>
									<span></span>
									<span></span>
									<span></span>
									<div class="content">
									<h2>My animated Border </h2>
									<p><a>All our modules are designed to play nicely with responsive of course. At the end of the day it comes down to the theme you use - our code doesn't get in your way.</a></p>
									</div>
								</div>`;
		document.getElementById("app").appendChild(bubble);

		/**
     *

     */
		// trackPop = pickId.position._value;
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

const drawRoom1 = async function (imageSrc: string) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	const ratio = 1;
	const w = 318;
	const h = 133;
	canvas.width = w * ratio;
	canvas.height = h * ratio;
	canvas.style.width = w / 2 + "px";
	canvas.style.height = h / 2 + "px";
	ctx?.scale(ratio, ratio);
	const image = await loadImage(imageSrc);
	let timex = 100;
	const setIntervalId = setInterval(() => {
		console.log("timex", timex);
		if (timex >= w + 2) {
			clearInterval(setIntervalId);
			return;
		}
		ctx?.drawImage(image, 0, 0, timex++, h, 10, 0, timex++, h);
		let ctx1 = canvas.getContext("2d");
		let x = w / 2;
		let y = h / 2;
		let radius = 8;

		ctx1?.beginPath();
		ctx1?.arc(10, 124, radius, 0, Math.PI * 2);
		ctx1.strokeStyle = "#41ffd4";
		ctx1.lineWidth = 2;
		ctx1?.stroke();

		// let ctx2 = canvas.getContext("2d");
		let radius2 = 4;
		ctx1?.beginPath();
		ctx1?.arc(10, 124, radius2, 0, Math.PI * 2);
		ctx1?.closePath();
		ctx1.fillStyle = "#41ffd4";
		// ctx2.lineWidth = 10;
		ctx1?.fill();

		// 绘制文字
		const ctx2 = canvas.getContext("2d");
		// ctx2.scale(ratio, ratio);
		const text = ["房主姓名：杨学东", "租客姓名：梁启明", "联系方式：18755738299"];
		ctx2.font = "15px Arial";
		drawtext(ctx2, text, x - 20, 14);
		return canvas;
	}, 100);
	ctx?.drawImage(image, 0, 0, timex++, h, 10, 0, timex++, h);
	let ctx1 = canvas.getContext("2d");
	let x = w / 2;
	let y = h / 2;
	let radius = 8;

	ctx1?.beginPath();
	ctx1?.arc(10, 124, radius, 0, Math.PI * 2);
	ctx1.strokeStyle = "#41ffd4";
	ctx1.lineWidth = 2;
	ctx1?.stroke();

	// let ctx2 = canvas.getContext("2d");
	let radius2 = 4;
	ctx1?.beginPath();
	ctx1?.arc(10, 124, radius2, 0, Math.PI * 2);
	ctx1?.closePath();
	ctx1.fillStyle = "#41ffd4";
	// ctx2.lineWidth = 10;
	ctx1?.fill();

	// 绘制文字
	const ctx2 = canvas.getContext("2d");
	// ctx2.scale(ratio, ratio);
	const text = ["房主姓名：杨学东", "租客姓名：梁启明", "联系方式：18755738299"];
	ctx2.font = "15px Arial";
	drawtext(ctx2, text, x - 20, 14);
	return canvas;

	// var img = new Image();
	// img.src = imageSrc;
	// ctx.clearRect(0, 0, cwidth, cheight);
	// img.onload = await function () {
	//     // if (i <= cwidth) {
	//     if (currentImagePercent <= 119) {
	//         ctx.drawImage(img, currentImagePercent, 0, cwidth, cheight);
	//         currentImagePercent++;
	//     }
	//     // } else
	//     // i = 0
	//     // i += 3;
	//     return canvas;
	// }
};

// 加载图片,异步方法
function loadImage(url: string) {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.src = url;
	});
}

// 文字换行
function drawtext(ctx: any, t: any, x: any, y: any) {
	//参数说明
	//ctx：canvas的 2d 对象，t：绘制的文字，x,y:文字坐标，w：文字最大宽度
	// let chr = t.split(" ")
	// let temp = ""
	// let row = []

	// for (let a = 0; a < chr.length; a++) {
	//     if (ctx.measureText(temp).width < w && ctx.measureText(temp + (chr[a])).width <= w) {
	//         temp += chr[a];
	//     } else {
	//         row.push(temp);
	//         temp = chr[a];
	//     }
	// }
	// row.push(temp)
	for (let b = 0; b < t.length; b++) {
		// console.log('row[b]:', row[b])
		ctx.fillText(t[b], x, y + (b + 1) * 28); //每行字体y坐标间隔20
	}
}

const createDitheringBillboard = () => {
	const positions = [
		[119.770959, 31.988475],
		[118.771959, 32.987475],
		[117.772959, 32.088175],
		[118.770359, 30.988375],
		[117.370859, 32.581475],
	];
	for (let i = 0; i < positions.length; i++) {
		const position = positions[i];
		window.viewer.entities.add({
			id: "dithering_point" + i,
			position: Cesium.Cartesian3.fromDegrees(position[0], position[1]),
			billboard: {
				image: getAssetsFile("icons/locate.png"),
				scale: 0.24,
				pixelOffset: new Cesium.Cartesian2(0, 0),
			},
		});
	}

	var rotation = -0.31;
	var rotationStatus = "right";
	let fudu = 0.3;
	let scale = 0.24;
	let count = 1;
	let count2 = 50;
	let y = 0;
	var handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);
	let tmpEntity: any = null;
	handler.setInputAction(function (event: Cesium.ScreenSpaceEventHandler.MotionEvent) {
		if (!window.viewer.scene.pick(event.endPosition)) {
			console.log("空白处");
			if (tmpEntity) {
				console.log("清除晃动");
				// tmpEntity.billboard!.rotation = 0;
				tmpEntity.billboard!.scale = 0.24;
				tmpEntity.billboard!.pixelOffset = new Cesium.Cartesian2(0, 0);
				tmpEntity = null;
			}
			return;
		}
		let entity: Cesium.Entity = window.viewer.scene.pick(event.endPosition).id;
		tmpEntity = entity;
		entity.billboard!.scale = new Cesium.CallbackProperty(function (time, result) {
			if (rotationStatus === "right") {
				scale += 0.002;
			}
			if (rotationStatus === "left") {
				scale -= 0.002;
			}
			if (scale >= 0.3) {
				rotationStatus = "left";
			}
			if (scale <= 0.24) {
				rotationStatus = "right";
			}
			return scale;
		}, false);
		entity.billboard!.pixelOffset = new Cesium.CallbackProperty(function (time, result) {
			if (rotationStatus === "right") {
				y -= 0.16;
			}
			if (rotationStatus === "left") {
				y += 0.16;
			}
			return new Cesium.Cartesian2(0, y);
		}, false);
		// entity.billboard!.rotation = new Cesium.CallbackProperty(function (time, result) {
		// 	if (count === 50) {
		// 		count2--;
		// 		if (count2 !== 0) {
		// 			return 0;
		// 		}
		// 		count = 0;
		// 		count2 = 50;
		// 	}
		// 	if (rotationStatus === "right") {
		// 		rotation += 0.08;
		// 	} else {
		// 		rotation -= 0.08;
		// 	}
		// 	if (rotation > 0.3) {
		// 		rotationStatus = "left";
		// 	}
		// 	if (rotation < -0.3) {
		// 		rotationStatus = "right";
		// 	}
		// 	count++;
		// 	return rotation;
		// }, false);
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
};
</script>

<style scoped lang="scss">
#leftNav {
	// background: url('/src/assets/nav_bac.jpg') no-repeat;
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;

		.menuItab {
			margin-right: 10px;
		}
	}
}
</style>
