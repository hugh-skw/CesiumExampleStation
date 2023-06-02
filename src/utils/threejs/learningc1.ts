import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

import * as dat from "dat.gui";
import { getAssetsFile } from "../tools/unit";
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
			console.log("当前x值:", val);
		})
		.onFinishChange((val) => {
			console.log("完全停下x值:", val);
		});
	const params = {
		color: "#ff0000",
		fn: () => {
			// 让 cube 运动
			gsap.to(cube.position, { x: 45, duration: 3, yoyo: true, repeat: -1 });
		},
	};
	gui.addColor(params, "color").onChange((val) => {
		console.log("颜色修改:", val);
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
