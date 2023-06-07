import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
	{
		//路由初始指向
		path: "/",
		name: "HelloWorld",
		component: () => import("../view/HomePage.vue"),
	},
	{
		path: "/three/coolWebsite",
		name: "CoolWebsite",
		component: () => import("../components/three/CoolWebSite.vue"),
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
