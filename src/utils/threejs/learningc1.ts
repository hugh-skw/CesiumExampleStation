import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

import * as dat from "dat.gui";
import { getAssetsFile, getUtilFile } from "../tools/unit";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Water } from "three/examples/jsm/objects/Water2";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
export function init() {
	// 1. 创建场景
	const scene = new THREE.Scene();
	// 2. 创建相机  角度、宽高比、近端、远端
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	// 设置相机位置
	camera.position.set(0, 0, 400);
	// 3. 添加物体
	const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
	const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	scene.add(cube);

	// 4. 初始化渲染器
	const renderer = new THREE.WebGLRenderer();
	// 设置渲染的尺寸大小
	renderer.setSize(window.innerWidth, window.innerHeight);

	function render() {
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();

	// 5. 渲染到dom
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
	return { renderer, scene, camera, dom };
}

export function orbitControl() {
	const { renderer, scene, camera, dom } = init();
	// 创建轨道控制器
	const controls = new OrbitControls(camera, renderer.domElement);
	// scene.add(controls);
	// renderer.render(scene, camera);
	return { renderer, scene, camera, dom, controls };
}

export function initHelper() {
	const { renderer, scene, camera, dom, controls } = orbitControl();

	// 添加坐标轴辅助器
	const axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper);
	return { renderer, scene, camera, dom, controls, axesHelper };
}

export function animateCube() {
	// 1. 创建场景
	const scene = new THREE.Scene();
	// 2. 创建相机  角度、宽高比、近端、远端
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	// 设置相机位置
	camera.position.set(0, 0, 100);
	// 3. 添加物体
	const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
	const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	scene.add(cube);
	// 添加坐标轴辅助器
	const axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper);
	// 4. 初始化渲染器
	const renderer = new THREE.WebGLRenderer();
	// 设置渲染的尺寸大小
	renderer.setSize(window.innerWidth, window.innerHeight);
	// 创建轨道控制器
	new OrbitControls(camera, renderer.domElement);
	const clock = new THREE.Clock();
	function render() {
		// const t = (time / 1000) % 5;
		// cube.position.x = t * 10;

		// cube.rotation.set(Math.PI - time / 1000, 0, 0);
		// cube.scale.x = t * 1;
		// cube.scale.y = t * 1;
		// cube.scale.z = t * 1;
		// if (cube.position.x > 50) {
		// 	cube.position.x = 0;
		// }
		// if (cube.scale.x > 3) {
		// 	cube.scale.x = 1;
		// 	cube.scale.y = 1;
		// 	cube.scale.z = 1;
		// }
		const ctime = clock.getElapsedTime();
		// const cDeltaTime = clock.getDelta(); // 间隔事件, 如果放开上面一行，此时一直为0
		// console.log("时钟运行的总时长：", ctime);
		// console.log("两次获取时间的间隔时间：", cDeltaTime);

		const t = ctime % 5;
		cube.position.x = t * 10;

		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();

	// 5. 渲染到dom
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
}

// 补间动画
export function gsapAnimation() {
	// 1. 创建场景
	const scene = new THREE.Scene();
	// 2. 创建相机  角度、宽高比、近端、远端
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	// 设置相机位置
	camera.position.set(0, 0, 200);
	// 3. 添加物体
	const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
	const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	scene.add(cube);
	// 添加坐标轴辅助器
	const axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper);

	// 4. 初始化渲染器
	const renderer = new THREE.WebGLRenderer();
	// 设置渲染的尺寸大小
	renderer.setSize(window.innerWidth, window.innerHeight);
	// 创建轨道控制器
	const controls = new OrbitControls(camera, renderer.domElement);
	// 设置控制器阻尼，需要在动画渲染时update
	controls.enableDamping = true;
	// 5. 渲染到dom
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);

	gsap.to(cube.position, { x: 45, duration: 5, ease: "back.out(2.5)" });
	gsap.to(cube.position, { z: 45 * 1.414, duration: 5, ease: "back.out(2.5)" });
	gsap.to(cube.scale, { x: 5, duration: 5 });
	gsap.to(cube.scale, { y: 5, duration: 5 });
	gsap.to(cube.scale, { z: 5, duration: 5 });
	gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5 });
	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();

	// resize 监听画面尺寸变化
	window.addEventListener("resize", () => {
		// 更新相机
		camera.aspect = window.innerWidth / window.innerHeight;
		// 更新相机的投影矩阵
		camera.updateProjectionMatrix();
		// 更新渲染器
		renderer.setSize(window.innerWidth, window.innerHeight);
		// 更新渲染器的像素比
		renderer.setPixelRatio(window.devicePixelRatio);
	});
}

export function douclickFullscreen() {
	// 1. 创建场景
	const scene = new THREE.Scene();
	// 2. 创建相机  角度、宽高比、近端、远端
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	// 设置相机位置
	camera.position.set(0, 0, 200);
	// 3. 添加物体
	const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
	const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	scene.add(cube);
	// 添加坐标轴辅助器
	const axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper);

	// 4. 初始化渲染器
	const renderer = new THREE.WebGLRenderer();
	// 设置渲染的尺寸大小
	renderer.setSize(window.innerWidth, window.innerHeight);
	// 创建轨道控制器
	const controls = new OrbitControls(camera, renderer.domElement);
	// 设置控制器阻尼，需要在动画渲染时update
	controls.enableDamping = true;
	// 5. 渲染到dom
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);

	gsap.to(cube.position, { x: 45, duration: 5, ease: "back.out(2.5)" });
	gsap.to(cube.position, { z: 45 * 1.414, duration: 5, ease: "back.out(2.5)" });
	gsap.to(cube.scale, { x: 5, duration: 5 });
	gsap.to(cube.scale, { y: 5, duration: 5 });
	gsap.to(cube.scale, { z: 5, duration: 5 });
	gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5 });
	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
	// resize 监听画面尺寸变化
	window.addEventListener("resize", () => {
		// 更新相机
		camera.aspect = window.innerWidth / window.innerHeight;
		// 更新相机的投影矩阵
		camera.updateProjectionMatrix();
		// 更新渲染器
		renderer.setSize(window.innerWidth, window.innerHeight);
		// 更新渲染器的像素比
		renderer.setPixelRatio(window.devicePixelRatio);
	});

	window.addEventListener("dblclick", () => {
		// 双击控制屏幕进入/退出全屏
		if (!document.fullscreenElement) {
			renderer.domElement.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	});
}

export function datGUI() {
	// 1. 创建场景
	const scene = new THREE.Scene();
	// 2. 创建相机  角度、宽高比、近端、远端
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	// 设置相机位置
	camera.position.set(0, 0, 200);
	// 3. 添加物体
	const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
	const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	scene.add(cube);
	// 添加坐标轴辅助器
	const axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper);

	// 4. 初始化渲染器
	const renderer = new THREE.WebGLRenderer();
	// 设置渲染的尺寸大小
	renderer.setSize(window.innerWidth, window.innerHeight);
	// 创建轨道控制器
	const controls = new OrbitControls(camera, renderer.domElement);
	// 设置控制器阻尼，需要在动画渲染时update
	controls.enableDamping = true;
	// 5. 渲染到dom
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);

	//**************************************/
	const gui = new dat.GUI();
	gui
		.add(cube.position, "x")
		.min(0)
		.max(50)
		.step(0.1)
		.name("移动 x 轴")
		.onChange((val) => {
			// console.log("当前x值:", val);
		})
		.onFinishChange((val) => {
			// console.log("完全停下x值:", val);
		});
	const params = {
		color: "#ff0000",
		fn: () => {
			// 让 cube 运动
			gsap.to(cube.position, { x: 45, duration: 3, yoyo: true, repeat: -1 });
		},
	};
	gui.addColor(params, "color").onChange((val) => {
		// console.log("颜色修改:", val);
		cube.material.color.set(val);
	});
	gui.add(cube, "visible").name("是否显示");
	gui.add(params, "fn").name("点击立方体运动");
	const folder = gui.addFolder("设置立方体");
	folder.add(cube.material, "wireframe");

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
	// resize 监听画面尺寸变化
	window.addEventListener("resize", () => {
		// 更新相机
		camera.aspect = window.innerWidth / window.innerHeight;
		// 更新相机的投影矩阵
		camera.updateProjectionMatrix();
		// 更新渲染器
		renderer.setSize(window.innerWidth, window.innerHeight);
		// 更新渲染器的像素比
		renderer.setPixelRatio(window.devicePixelRatio);
	});

	window.addEventListener("dblclick", () => {
		// 双击控制屏幕进入/退出全屏
		if (!document.fullscreenElement) {
			renderer.domElement.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	});
}

export function geometory() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 0, 200);

	const axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
	// ************************************************************************
	const geometry = new THREE.BufferGeometry();
	const vertices = new Float32Array([-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0]);
	geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
	const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	const mesh = new THREE.Mesh(geometry, cubeMaterial);
	scene.add(mesh);

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
}

export function triangleExample() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 0, 10);

	const axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
	// ************************************************************************
	for (let i = 0; i < 50; i++) {
		// 每个三角形需要3个顶点，每个顶点对应3个值
		const geometry = new THREE.BufferGeometry();
		const positionArr = new Float32Array(9);
		for (let j = 0; j < 9; j++) {
			positionArr[j] = Math.random() * 10 - 5;
		}
		geometry.setAttribute("position", new THREE.BufferAttribute(positionArr, 3));
		const material = new THREE.MeshBasicMaterial({
			color: new THREE.Color(Math.random(), Math.random(), Math.random()),
			transparent: true,
			opacity: Math.random(),
		});
		const mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
	}

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
}

export function basicMaterial() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 0, 10);

	const axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);

	// ************************************************************************
	const cubeGeometry = new THREE.BoxGeometry(1, 1, 1); // three.module.js:50808 THREE.BoxBufferGeometry has been renamed to THREE.BoxGeometry.
	// 纹理
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(getAssetsFile("textures/door.png"));
	const alphaTexture = textureLoader.load(getAssetsFile("textures/door_transparent.png"));
	// 纹理偏移
	// texture.offset.set(0.5, 0.5);
	// texture.offset.x = 0.5;
	// texture.offset.y = 0.5;
	// 纹理旋转
	// texture.center.set(0.5, 0.5); // 设置旋转的中心点
	// texture.rotation = Math.PI / 4; // 旋转 45°
	// 纹理重复
	// texture.repeat.set(2, 5); // 水平重复两次，竖直重复5次
	// texture.wrapS = THREE.RepeatWrapping; // 设置包裹模式，将纹理无限重复（水平），另外还有镜像重复等
	// texture.wrapT = THREE.RepeatWrapping; // 设置包裹模式，将纹理无限重复（竖直）
	// 纹素覆盖算法
	// texture.minFilter = THREE.NearestFilter;
	// texture.magFilter = THREE.NearestFilter;
	// 透明纹理

	const basicMaterial = new THREE.MeshBasicMaterial({
		color: "#fff",
		map: texture,
		alphaMap: alphaTexture,
		transparent: true,
		// opacity: 0.6,
		side: THREE.DoubleSide, // 渲染两面
		// aoMap: aoTexture,
		// aoMapIntensity: 0.5, //	aoMap的强度
	});
	const cube = new THREE.Mesh(cubeGeometry, basicMaterial);
	cubeGeometry.setAttribute("uv2", new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)); // aoMap需要第二组uv
	scene.add(cube);

	// 添加平面
	const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), basicMaterial); // three.module.js:50919 THREE.PlaneBufferGeometry has been renamed to THREE.PlaneGeometry.
	plane.position.set(2, 0, 0);
	scene.add(plane);

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
}

export function meshStandardMaterial() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(10, 10, 10);

	const axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
	const gridHelper = new THREE.GridHelper(20, 20);
	scene.add(gridHelper);

	//***************************************************
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const textureLoader = new THREE.TextureLoader();
	const doorTexture = textureLoader.load(getAssetsFile("textures/door.png"));
	const alphaTexture = textureLoader.load(getAssetsFile("textures/door_transparent.png"));
	// 标准物理材质PBR，需要有光，否则是黑的
	const standardMaterial = new THREE.MeshStandardMaterial({
		color: "#ff0",
		map: doorTexture,
		alphaMap: alphaTexture,
		transparent: true,
		side: THREE.DoubleSide,
		// displacementMap: ... // 置换函数
		// displacementScale: 0.1 // 置换强度
		// roughness: 0, // 粗糙度 0--完全光滑(如果需要使部分地方光滑,配合roughnessMap使用灰度贴图, 黑的地方粗糙,白的地方光滑)
		// roughnessMap: ... // 粗糙度贴图
		// metalness: 0, // 金属度 0--完全金属(如果需要使部分地方光滑,配合metalnessMap使用金属贴图, 黑的地方非金属,白的地方金属)
		// metalnessMap: ... // 金属度贴图
		// normalMap: ... // 法线贴图
	});
	const mesh = new THREE.Mesh(boxGeometry, standardMaterial);
	scene.add(mesh);
	// 添加环境光
	const light = new THREE.AmbientLight("#FFFFFF", 0.3);
	// scene.add(light);
	// 添加直线光
	const directionaltLight = new THREE.DirectionalLight("#FFFFFF", 1);
	directionaltLight.position.set(3, 3, 3);
	// directionaltLight.target.position.set(0, 0, 0);
	scene.add(directionaltLight);
	// 设置第二平面
	const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
	const plane = new THREE.Mesh(planeGeometry, standardMaterial);
	plane.position.set(3, 0, 0);
	scene.add(plane);

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
}

export function textureLoading() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(5, 5, 5);

	const axesHelper = new THREE.AxesHelper(100);
	scene.add(axesHelper);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
	const gridHelper = new THREE.GridHelper(20, 20);
	scene.add(gridHelper);

	// ************************************************************************
	const cubeGeometry = new THREE.BoxGeometry(1, 1, 1); // three.module.js:50808 THREE.BoxBufferGeometry has been renamed to THREE.BoxGeometry.
	// 纹理
	const onLoad = () => {
		// console.log("纹理加载完成");
	};
	const onProgress = (progress: any) => {
		// console.log("加载进度：", progress);
	};
	// 设置加载管理器
	const loadingManager = new THREE.LoadingManager(onLoad, (url: string, num: number, total: number) => {
		// console.log("当前加载纹理：", url);
		// console.log("总体加载进度：", Number(((num / total) as number).toFixed(2)) * 100 + "%");
	});
	const textureLoader = new THREE.TextureLoader(loadingManager);
	const texture = textureLoader.load(getAssetsFile("textures/door.png"), onLoad, onProgress);
	const alphaTexture = textureLoader.load(getAssetsFile("textures/door_transparent.png"));
	const basicMaterial = new THREE.MeshBasicMaterial({
		color: "#fff",
		map: texture,
		alphaMap: alphaTexture,
		transparent: true,
	});
	const cube = new THREE.Mesh(cubeGeometry, basicMaterial);
	scene.add(cube);

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
}

export function environmentTexture() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(5, 5, 5);

	const axesHelper = new THREE.AxesHelper(100);
	scene.add(axesHelper);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
	const gridHelper = new THREE.GridHelper(20, 20);
	scene.add(gridHelper);

	// ************************************************************************
	// 纹理
	const onLoad = () => {
		// console.log("纹理加载完成");
	};
	const onProgress = (progress: any) => {
		// console.log("加载进度：", progress);
	};
	// 设置加载管理器
	const cubeTextureLoader = new THREE.CubeTextureLoader();
	const px = getAssetsFile("textures/pos-x.jpg");
	const py = getAssetsFile("textures/pos-y.jpg");
	const pz = getAssetsFile("textures/pos-z.jpg");
	const nx = getAssetsFile("textures/neg-x.jpg");
	const ny = getAssetsFile("textures/neg-y.jpg");
	const nz = getAssetsFile("textures/neg-z.jpg");
	// const envPng = getAssetsFile("textures/envTexture.jpeg");
	const envMapTexture = cubeTextureLoader.load([px, nx, py, ny, pz, nz]);
	const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
	const material = new THREE.MeshStandardMaterial({
		metalness: 0.7,
		roughness: 0.1,
		envMap: envMapTexture,
	});
	const sphere = new THREE.Mesh(sphereGeometry, material);
	scene.add(sphere);
	scene.background = envMapTexture;
	// scene.environment = envMapTexture;

	// 环境光
	const light = new THREE.AmbientLight("#FFFFFF", 0.8);
	scene.add(light);

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
}

export function hdrPic() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(5, 5, 5);

	const axesHelper = new THREE.AxesHelper(100);
	scene.add(axesHelper);
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
	// 加载hdr环境图
	const rgbeLoader = new RGBELoader();
	rgbeLoader
		.loadAsync(getAssetsFile("textures/HdrOutdoorResidentialRiverwalkAfternoonClear001/HdrOutdoorResidentialRiverwalkAfternoonClear001_HDR_2K.hdr"))
		.then((texture: any) => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			scene.background = texture;
		});

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
}

export function lightShadow() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(-5, 5, 5);

	const axesHelper = new THREE.AxesHelper(100);
	scene.add(axesHelper);
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);

	const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		// color: "Grey",
	});
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphere);

	// 创建平面
	const planeGeometry = new THREE.PlaneGeometry(10, 10);
	const planeMaterial = new THREE.MeshStandardMaterial({
		color: "Grey",
	});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.position.y = -1;
	plane.rotation.x = -Math.PI / 2;
	scene.add(plane);

	const light = new THREE.AmbientLight("#FFFFFF", 0.6);
	scene.add(light);
	const dLight = new THREE.DirectionalLight("#FFFFFF", 1);
	dLight.position.set(3, 3, 3);
	scene.add(dLight);

	// 开启渲染器阴影计算
	renderer.shadowMap.enabled = true;
	// 设置光照投射阴影
	dLight.castShadow = true;
	// 设置物体投射阴影
	sphere.castShadow = true;
	// 设置物体接收阴影
	plane.receiveShadow = true;

	// 投影的模糊度
	dLight.shadow.radius = 20;
	// 阴影贴图的分辨率
	dLight.shadow.mapSize.set(1080, 1080);

	// 设置平行光投射相机的属性
	dLight.shadow.camera.near = 0.5;
	dLight.shadow.camera.far = 500;
	dLight.shadow.camera.top = 5;
	dLight.shadow.camera.bottom = -5;
	dLight.shadow.camera.left = -5;
	dLight.shadow.camera.right = 5;

	const gui = new dat.GUI();
	gui
		.add(dLight.shadow.camera, "near")
		.min(0)
		.max(10)
		.step(0.3)
		.onChange(() => {
			dLight.shadow.camera.updateProjectionMatrix();
		});

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
}

export function spotLight() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(-5, 5, 5);
	const axesHelper = new THREE.AxesHelper(100);
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
	scene.add(camera);
	scene.add(axesHelper);

	const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		// color: "Grey",
	});
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphere);

	// 创建平面
	const planeGeometry = new THREE.PlaneGeometry(50, 50);
	const planeMaterial = new THREE.MeshStandardMaterial({
		color: "Grey",
	});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.position.y = -1;
	plane.rotation.x = -Math.PI / 2;
	scene.add(plane);

	const light = new THREE.AmbientLight("#FFFFFF", 0.3);
	scene.add(light);

	// 点光源
	// const pointLight = new THREE.PointLight();
	// scene.add(pointLight);
	// 聚光灯
	const spotLight = new THREE.SpotLight("#FFFFFF", 0.7, 100, Math.PI / 6);
	spotLight.position.set(5, 5, 5);
	spotLight.shadow.radius = 1;
	spotLight.intensity = 1;
	spotLight.shadow.mapSize.set(2048, 2048);
	spotLight.castShadow = true;
	spotLight.penumbra = 0;
	spotLight.decay = 0;
	sphere.castShadow = true;
	plane.receiveShadow = true;
	renderer.shadowMap.enabled = true;
	scene.add(spotLight);

	const spotLightHelper = new THREE.SpotLightHelper(spotLight);
	scene.add(spotLightHelper);

	// 聚光灯始终聚焦到球
	spotLight.target = sphere;

	const gui = new dat.GUI();
	gui
		.add(sphere.position, "x")
		.max(10)
		.min(-10)
		.step(0.1)
		.onChange(() => {
			spotLight.shadow.camera.updateProjectionMatrix();
			spotLightHelper.update();
		});
	gui
		.add(spotLight.shadow, "radius")
		.max(30)
		.min(5)
		.step(0.1)
		.onChange(() => {
			spotLight.shadow.camera.updateProjectionMatrix();
			spotLightHelper.update();
		});
	gui
		.add(spotLight, "penumbra")
		.max(1)
		.min(0)
		.step(0.1)
		.onChange(() => {
			spotLight.shadow.camera.updateProjectionMatrix();
			spotLightHelper.update();
		});
	gui
		.add(spotLight, "decay")
		.max(5)
		.min(0)
		.step(0.1)
		.onChange(() => {
			spotLight.shadow.camera.updateProjectionMatrix();
			spotLightHelper.update();
		});
	gui
		.add(spotLight, "intensity")
		.max(1)
		.min(0)
		.step(0.05)
		.onChange(() => {
			spotLight.shadow.camera.updateProjectionMatrix();
			spotLightHelper.update();
		});
	// 场景中的阴影贴图
	renderer.useLegacyLights = true;

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
}

export function pointLight() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(-5, 5, 5);
	const axesHelper = new THREE.AxesHelper(100);
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
	scene.add(camera);
	scene.add(axesHelper);

	const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		// color: "Grey",
	});
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphere);

	// 创建平面
	const planeGeometry = new THREE.PlaneGeometry(50, 50);
	const planeMaterial = new THREE.MeshStandardMaterial({
		color: "Grey",
	});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.position.y = -1;
	plane.rotation.x = -Math.PI / 2;
	scene.add(plane);

	const light = new THREE.AmbientLight("#FFFFFF", 0.3);
	scene.add(light);

	// 点光源
	const smallBall = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshBasicMaterial({ color: "#FF0000" }));
	smallBall.position.set(6, 3, 3);
	const pointLight = new THREE.PointLight("#FF0000", 1);
	// pointLight.position.set(6, 3, 3);
	smallBall.add(pointLight);
	pointLight.castShadow = true;
	const pointLightHelper = new THREE.PointLightHelper(pointLight);
	scene.add(pointLightHelper);

	sphere.castShadow = true;
	plane.receiveShadow = true;
	renderer.shadowMap.enabled = true;

	pointLight.shadow.radius = 20;
	scene.add(smallBall);
	// scene.add(pointLight);
	// pointLight.decay = 1;
	const gui = new dat.GUI();
	gui
		.add(smallBall.position, "x")
		.max(10)
		.min(-10)
		.step(0.1)
		.onChange(() => {
			pointLight.shadow.camera.updateProjectionMatrix();
			pointLightHelper.update();
		});
	gui
		.add(smallBall.position, "y")
		.max(10)
		.min(-10)
		.step(0.1)
		.onChange(() => {
			pointLight.shadow.camera.updateProjectionMatrix();
			pointLightHelper.update();
		});
	gui
		.add(smallBall.position, "z")
		.max(10)
		.min(0)
		.step(0.1)
		.onChange(() => {
			pointLight.shadow.camera.updateProjectionMatrix();
			pointLightHelper.update();
		});

	const clock = new THREE.Clock();
	function render() {
		smallBall.position.x = Math.sin(clock.getElapsedTime()) * 2;
		smallBall.position.z = Math.cos(clock.getElapsedTime()) * 2;
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
}

export function vrRoom() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 5;
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
	scene.add(camera);

	// 添加立方体(采用分别拍照的方式)
	// const geometry = new THREE.BoxGeometry(10, 10, 10);
	// const arr = ["4_l", "4_r", "4_u", "4_d", "4_b", "4_f"];
	// const boxMaterials: Array<THREE.MeshBasicMaterial> = [];
	// arr.forEach((item) => {
	// 	const texture = new THREE.TextureLoader().load(getAssetsFile("vrRoomImgs/living/" + item + ".jpg"));
	// 	if (item === "4_u" || item === "4_d") {
	// 		texture.rotation = Math.PI;
	// 		texture.center = new THREE.Vector2(0.5, 0.5);
	// 	}

	// 	boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }));
	// });
	// const cube = new THREE.Mesh(geometry, boxMaterials);
	// cube.geometry.scale(1, 1, -1);
	// scene.add(cube);

	// 添加球(采用一张展开图的方式)
	const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
	const rgbeLoader = new RGBELoader();
	rgbeLoader.load(getAssetsFile("vrRoomImgs/hdr/living.hdr"), (texture) => {
		const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.geometry.scale(1, 1, -1);
		scene.add(sphere);
	});

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();
}

export function isLand() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
	camera.position.set(-50, 50, 130);
	// 更新摄像头宽高比例
	camera.aspect = window.innerWidth / window.innerHeight;
	// 更新摄像头的矩阵
	camera.updateProjectionMatrix();
	scene.add(camera);
	const renderer = new THREE.WebGLRenderer({
		antialias: true, // 抗锯齿
		logarithmicDepthBuffer: true, // 对数深度缓冲区
	});
	// renderer.outputColorSpace = THREE.output;
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	window.addEventListener("resize", () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);

	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();

	const sphereGeometry = new THREE.SphereGeometry(1000, 60, 60);
	const sphereMaterial = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load(getAssetsFile("islandResources/sky.jpg")),
	});

	const sky = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sky.geometry.scale(1, 1, -1);
	scene.add(sky);

	// 创建视频纹理
	const video = document.createElement("video");
	video.src = getAssetsFile("islandResources/sky.mp4");
	video.muted = true;
	video.loop = true;
	window.addEventListener("click", (e) => {
		if (video.paused) {
			video.play();
			sky.material.map = new THREE.VideoTexture(video);
			sky.material.map.needsUpdate = true;
			scene.background = sphereMaterial.map;
			scene.environment = sphereMaterial.map;
		}
	});

	// 载入环境纹理
	const hdrLoader = new RGBELoader();
	hdrLoader.loadAsync(getAssetsFile("islandResources/050.hdr")).then((texture) => {
		texture.mapping = THREE.EquirectangularReflectionMapping;
		scene.environment = texture;
	});

	// 创建水面
	const waterGeometry = new THREE.CircleGeometry(300, 64);
	const water = new Water(waterGeometry, {
		textureWidth: 1024,
		textureHeight: 1024,
		color: 0xeeeeff,
		flowDirection: new THREE.Vector2(1, 1),
		scale: 1,
	});
	// 旋转水面至水平
	water.rotation.x = -Math.PI / 2;
	scene.add(water);
	// 调整水面高度
	water.position.y = 3;

	// 添加小岛模型
	// 实例化gltf
	const gltfLoader = new GLTFLoader();
	const dracoLoader = new DRACOLoader();
	// 添加draco载入库
	dracoLoader.setDecoderPath(getUtilFile("draco/"));
	gltfLoader.setDRACOLoader(dracoLoader);
	gltfLoader.load(getAssetsFile("islandResources/model/island2.glb"), (gltf) => {
		// const island = gltf.scene;
		// island.position.y = -50;
		scene.add(gltf.scene);
	});
}

export function car() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color("#ccc");
	// scene.environment = new THREE.Color("#ccc");
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 5, 5);
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	const dom = document.getElementById("mapContainer");
	dom!.innerHTML = "";
	dom?.appendChild(renderer.domElement);
	scene.add(camera);
	function render() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	render();

	// 添加网格地面
	const gridHelper = new THREE.GridHelper(20, 20);
	scene.add(gridHelper);

	const ambientLight = new THREE.AmbientLight("#ffffff", 1);
	scene.add(ambientLight);
	const dLight1 = new THREE.DirectionalLight("#ffffff", 1);
	dLight1.position.z = 20;
	// const dLight2 = new THREE.DirectionalLight("#ffffff", 1);
	// dLight2.position.z = -20;
	const dLight3 = new THREE.DirectionalLight("#ffffff", 1);
	dLight3.position.y = 20;
	const dLight4 = new THREE.DirectionalLight("#ffffff", 1);
	dLight4.position.y = -20;
	const dLight5 = new THREE.DirectionalLight("#ffffff", 1);
	dLight5.position.x = 20;
	const dLight6 = new THREE.DirectionalLight("#ffffff", 1);
	dLight6.position.x = -20;
	scene.add(...[dLight1, dLight3, dLight4, dLight5, dLight6]);

	const wheels = [];
	let carBody, frontCar, hoodCar, glassCar;
	const bodyMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xff0000,
		metalness: 1,
		roughness: 0.4,
		clearcoat: 1,
		clearcoatRoughness: 0,
	});
	const frontMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xff0000,
		metalness: 1,
		roughness: 0.4,
		clearcoat: 1,
		clearcoatRoughness: 0,
	});
	const hoodMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xff0000,
		metalness: 1,
		roughness: 0.4,
		clearcoat: 1,
		clearcoatRoughness: 0,
	});
	const wheelMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xff0000,
		metalness: 1,
		roughness: 0.1,
	});
	const glassMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		transmission: 1,
		metalness: 0,
		roughness: 0.1,
		transparent: true,
	});

	const gltfLoader = new GLTFLoader();
	const dracoLoader = new DRACOLoader();
	// console.log(getUtilFile("draco/").replace("@fs/", "") + "/");
	// console.log();
	dracoLoader.setDecoderPath(getUtilFile("draco/"));
	gltfLoader.setDRACOLoader(dracoLoader);
	gltfLoader.load(getAssetsFile("models/bmw01.glb"), (gltf) => {
		gltf.scene.traverse((child: any) => {
			if (child.isMesh) {
				// console.log(child.name);
			}
			if (child.isMesh && child.name.includes("轮毂")) {
				child.material = wheelMaterial;
				wheels.push(child);
			}
			if (child.isMesh && child.name.includes("Mesh002")) {
				child.material = bodyMaterial;
				carBody = child;
			}
			if (child.isMesh && child.name.includes("前脸")) {
				child.material = frontMaterial;
				frontCar = child;
			}
			if (child.isMesh && child.name.includes("引擎盖_1")) {
				child.material = hoodMaterial;
				hoodCar = child;
			}
			if (child.isMesh && child.name.includes("挡风玻璃")) {
				child.material = glassMaterial;
				glassCar = child;
			}
		});

		scene.add(gltf.scene);
	});

	setTimeout(() => {
		bodyMaterial.color.set("#44ffaa");
	}, 5000);
}
