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
		</el-menu>
	</div>
</template>

<script lang="ts" setup>
import * as Cesium from "cesium";
import { parabolaFlowInit, roadRapidEffect, lineFlickerMaterial, startRain, startSnow, startFog, dynamicWall } from "@/utils/shaders";
import { ref, getCurrentInstance } from "vue";
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

// const handleOpen = (key: string, keyPath: string[]) => {
//     console.log('handleOpen', key, keyPath)
// }
// const handleClose = (key: string, keyPath: string[]) => {
//     console.log('handleClose', key, keyPath)
// }
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
