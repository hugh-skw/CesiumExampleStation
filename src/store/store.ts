//src/store/store.ts
import { defineStore } from "pinia";

// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore("main", {
	// 其它配置项
	state: () => {
		return {
			name: "李华",
			age: 25,
			sex: "男",
		};
	},
	getters: {
		getAddAge: (state) => {
			return state.age + 100;
		},
		getAddParamsAge: (state) => {
			return (params: number) => state.age + 100 + params;
		},
		getNameAndAge(): string {
			return this.name + this.getAddAge;
		},
	},
	actions: {
		saveName(name: string) {
			// 修改state中的name
			this.name = name;
		},
	},
});
