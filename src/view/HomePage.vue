<script setup lang="ts">
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
import Nav from "@/components/NavMenu.vue";
import MapContainer from "@/components/MapContainer.vue";
const store = useStore();
const { name, age, sex, getAddParamsAge } = storeToRefs(store);

const changeValue = () => {
	store.$patch((state) => {
		state.name = "新名字";
		state.age = 33;
	});
};
</script>

<template>
	<div style="display: flex; height: 100%; width: 100%; overflow: hidden">
		<Nav />
		<map-container />
	</div>
</template>

<style scoped></style>
