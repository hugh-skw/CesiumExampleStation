import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";
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
	function render(time: number) {
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
