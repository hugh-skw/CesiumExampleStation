import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/lib/locale/lang/zh-cn"; //国际化
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 阿里图标库
import "./assets/iconfont/iconfont.css";

const app = createApp(App);
import { createPinia } from "pinia";
// 实例化 Pinia
const pinia = createPinia();
// 全局注册 element-icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}
app.use(pinia);
app.use(ElementPlus, { locale: zhCn });
app.use(router);
app.mount("#app");
