<template>
	<div class="cool-website">
		<div ref="screenDom" class="canvas-container"></div>
		<div class="header">
			<div class="logo"></div>
			<!-- <div class="menu">
				<a href="https://www.cpengx.cn/" class="menuItem">首页</a>
				<a href="https://www.cpengx.cn/%e8%af%be%e7%a8%8b%e6%ba%90%e7%a0%81" class="menuItem">课程源码</a>
				<a href="https://www.cpengx.cn/moxing" class="menuItem">素材模型</a>
			</div> -->
		</div>
		<div ref="pages" class="pages">
			<div class="page">
				<h2 class="title">学习Threejs</h2>
				<p>轻松、好玩、有趣掌握前沿硬核前端技术</p>
			</div>
			<div class="page">
				<h2 class="title">WEB 3D可视化</h2>
				<p>领略WEB 3D的魅力，让页面无比酷炫</p>
			</div>
			<div class="page">
				<h2 class="title">ThreeJS框架</h2>
				<p>让前端开发3D效果更方便</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import * as THREE from "three";
import { ref, onMounted } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { gsap } from "gsap";
import { getAssetsFile, getGltfDracoDir } from "@/utils/tools/unit";
let screenDom = ref(null);
let pages = ref(null);
onMounted(() => {
	// 创建场景
	let scene = new THREE.Scene();
	// 创建相机
	let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);

	camera.position.set(0, 0, 10);
	// 创建渲染器
	let renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	// 将画布添加到页面中
	screenDom.value.appendChild(renderer.domElement);

	// 创建星空的背景
	let url = getAssetsFile("coolWebsite/25s.jpg");
	let envTexture = new THREE.TextureLoader().load(url);
	envTexture.mapping = THREE.EquirectangularReflectionMapping;
	scene.background = envTexture;
	scene.environment = envTexture;

	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	render();

	// 添加灯光
	let light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 0, 1);
	scene.add(light);
	let light2 = new THREE.DirectionalLight(0xffffff, 0.5);
	light2.position.set(0, 0, -1);
	scene.add(light2);
	let light3 = new THREE.AmbientLight(0xffffff, 0.5);
	light3.position.set(-1, 1, 1);
	scene.add(light3);

	// 设置解压缩的加载器
	let dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath(getGltfDracoDir());
	dracoLoader.setDecoderConfig({ type: "js" });
	let loader = new GLTFLoader();
	loader.setDRACOLoader(dracoLoader);
	loader.load(getAssetsFile("coolWebsite/model/xz.glb"), (gltf) => {
		gltf.scene.scale.set(0.1, 0.1, 0.1);
		gltf.scene.position.set(3, 0, 0);
		scene.add(gltf.scene);

		window.addEventListener("mousemove", (e) => {
			let x = (e.clientX / window.innerWidth) * 2 - 1;
			let y = (e.clientY / window.innerHeight) * 2 - 1;

			let timeline = gsap.timeline();
			timeline.to(gltf.scene.rotation, {
				duration: 0.5,
				x: y,
				y: x,
				// duration: 1,
			});
		});
	});

	loader.load(getAssetsFile("coolWebsite/model/xq6.glb"), (gltf) => {
		gltf.scene.scale.set(0.1, 0.1, 0.1);
		gltf.scene.position.set(3, -8, 0);
		scene.add(gltf.scene);

		window.addEventListener("mousemove", (e) => {
			let x = (e.clientX / window.innerWidth) * 2 - 1;
			let y = (e.clientY / window.innerHeight) * 2 - 1;

			let timeline = gsap.timeline();
			timeline.to(gltf.scene.rotation, {
				duration: 0.5,
				x: y,
				y: x,
				// duration: 1,
			});
		});
	});

	loader.load(getAssetsFile("coolWebsite/model/gr75.glb"), (gltf) => {
		// gltf.scene.scale.set(0.1, 0.1, 0.1);
		gltf.scene.position.set(3, -16, 0);
		scene.add(gltf.scene);

		window.addEventListener("mousemove", (e) => {
			let x = (e.clientX / window.innerWidth) * 2 - 1;
			let y = (e.clientY / window.innerHeight) * 2 - 1;

			let timeline = gsap.timeline();
			timeline.to(gltf.scene.rotation, {
				duration: 0.5,
				x: y,
				y: x,
				// duration: 1,
			});
		});
	});

	let page = 0;
	let timeline2 = gsap.timeline();
	window.addEventListener("mousewheel", (e) => {
		if (e.wheelDelta < 0) {
			page++;
			if (page > 2) {
				page = 2;
			}
		}
		if (e.wheelDelta > 0) {
			page--;
			if (page < 0) {
				page = 0;
			}
		}
		if (!timeline2.isActive()) {
			timeline2.to(camera.position, {
				duration: 0.5,

				y: page * -8,
				// duration: 1,
			});
			gsap.to(pages.value, {
				duration: 1,
				y: -page * window.innerHeight,
				// duration: 1,
			});
		}
	});

	loader.load(getAssetsFile("coolWebsite/model/moon.glb"), (gltf) => {
		let moon = gltf.scene.children[0];
		for (let j = 0; j < 10; j++) {
			let moonInstance = new THREE.InstancedMesh(moon.geometry, moon.material, 100);

			// scene.add(moon);
			for (let i = 0; i < 100; i++) {
				let x = Math.random() * 1000 - 500;
				let y = Math.random() * 1000 - 500;
				let z = Math.random() * 1000 - 500;

				let matrix = new THREE.Matrix4();
				let size = Math.random() * 20 - 8;
				matrix.makeScale(size, size, size);
				matrix.makeTranslation(x, y, z);
				moonInstance.setMatrixAt(i, matrix);
			}

			gsap.to(moonInstance.position, {
				duration: Math.random() * 10 + 2,
				z: -1000,
				ease: "linear",
				repeat: -1,
			});
			scene.add(moonInstance);
		}
	});
});
</script>

<style>
* {
	margin: 0;
	padding: 0;
}
body {
	background-color: #000;
}
.canvas-container {
	width: 100vw;
	height: 100vh;
}
.cool-website {
	width: 100vw;
	height: 100vh;
	transform-origin: 0 0;
}
.header {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.header .logo {
	height: 100px;
	width: 300px;
	background-image: url("./assets/lcdm.png");
	background-size: 60%;
	background-position: center;
	background-repeat: no-repeat;
}
.canvas-container {
	width: 100%;
	height: 100%;
}
.menu {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-right: 50px;
}
.menuItem {
	padding: 0 15px;
	text-decoration: none;
	color: #fff;
	font-weight: 900;
	font-size: 15px;
}
.loading {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-image: url(./assets/loading.jpg);
	background-size: cover;
	filter: blur(50px);
	z-index: 100;
}
.progress {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 101;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	color: #fff;
}
.progress > img {
	padding: 0 15px;
}

/* .title {
    width: 380px;
    height: 40px;
    position: fixed;
    right: 100px;
    top: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    line-height: 40px;
    text-align: center;
    color: #fff;
    border-radius: 5px;
    z-index: 110;
  } */
.pages {
	display: flex;
	flex-direction: column;
	position: fixed;
	top: 0;
	left: 0;
}
.pages .page {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	color: #fff;
	padding: 15%;
	box-sizing: border-box;
}
.pages .page .title {
	font-size: 50px;
	font-weight: 900;
	margin-bottom: 20px;
}
.pages .page p {
	font-size: 25px;
}
</style>
