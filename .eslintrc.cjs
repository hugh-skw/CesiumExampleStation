module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	extends: [
		"eslint-config-prettier",
		"eslint:recommended", // 使用推荐的eslint
		"plugin:@typescript-eslint/recommended",
		"plugin:vue/vue3-recommended", // 使用插件支持vue3
		"plugin:vue/vue3-essential",
		//1.继承.prettierrc.js文件规则  2.开启rules的 "prettier/prettier": "error"  3.eslint fix的同时执行prettier格式化
		"plugin:prettier/recommended",
	],
	parser: "vue-eslint-parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		parser: "@typescript-eslint/parser",
	},
	plugins: [],
	globals: {
		defineProps: "readonly",
		defineEmits: "readonly",
		defineExpose: "readonly",
		withDefaults: "readonly",
	},
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? ["error", { allow: ["error", "warn"] }] : "off", //生产模式不允许使用log
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off", //生产默认不允许使用debugger
		"@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: ".*", args: "none" }], //变量声明未使用
		"@typescript-eslint/no-explicit-any": "off", // 允许ts使用any
		// '@typescript-eslint/no-var-requires': 'off', // 强制使用 import 且不允许使用 require 设置off关闭检查
		// 'vue/require-v-for-key': 'off', // 对保留元素检查 vue3中v-for会自动追加key值，所以不用再强制添加key属性，所以不检查key的填写
		// 'vue/valid-v-for': 'off', // 对于非保留(自定义)元素检查  vue3中v-for会自动追加key值，所以不用再强制添加key属性，所以不检查key的填写
		// // 添加组件命名忽略规则 vue官方默认规则是多单词驼峰来进行组件命名
		// 'vue/multi-word-component-names': [
		// 	'warn',
		// 	{
		// 		ignores: ['index'], //需要忽略的组件名
		// 	},
		// ],
	},
};