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
				<el-menu-item-group>
					<template #title><span>Group One</span></template>
					<el-menu-item index="1-1" @click="createShaderMaterial('1-1')">道路穿梭线</el-menu-item>
					<el-menu-item index="1-2" @click="createShaderMaterial('1-2')">抛物流动飞线</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group title="Group Two">
					<el-menu-item index="1-3">item three</el-menu-item>
				</el-menu-item-group>
				<el-sub-menu index="1-4">
					<template #title><span>item four</span></template>
					<el-menu-item index="1-4-1">item one</el-menu-item>
				</el-sub-menu>
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
import { parabolaFlowInit, roadRapidEffect } from "@/utils/shaders";
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any; //获取上下文实例，ctx=vue2的this
const createShaderMaterial = (type: string) => {
	switch (type) {
		case "1-1":
			proxy.$message({
				type: "success",
				message: "道路穿梭线",
				duration: 3000,
			});
			roadRapidEffect(window.viewer, 3000, "");
			break;
		case "1-2":
			proxy.$message({
				type: "success",
				message: "抛物流动飞线",
				duration: 3000,
			});
			parabolaFlowInit(window.viewer, 5, "in");
			break;
		default:
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
