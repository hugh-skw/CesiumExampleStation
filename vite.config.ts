import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import cesium from "vite-plugin-cesium";
import eslintPlugin from "vite-plugin-eslint";
export default defineConfig({
	plugins: [
		vue(),
		cesium({ rebuildCesium: true }),
		eslintPlugin({
			include: ["src/**/*.ts", "src/**/*.vue", "src/*.ts", "src/*.vue"],
		}),
	],
	//解决“vite use `--host` to expose”
	base: "./", //不加打包后白屏
	server: {
		host: "0.0.0.0",
		port: 7779,
		open: true,
	},
	resolve: {
		//别名配置，引用src路径下的东西可以通过@如：import Layout from '@/layout/index.vue'
		alias: [
			{
				find: "@",
				replacement: resolve(__dirname, "src"),
			},
		],
	},
});
