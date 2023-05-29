import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"?;
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
export default class ZThree {
	id: string;
	element: HTMLElement | null;
	scene: any;
	camera: any;
	renderer: any;
	controls: any;
	clock: any;
	mixer: any;
	stats: any;
	constructor(id: string, element: HTMLElement | null) {
		this.id = id;
		this.element = element;
		this.scene = null;
		this.camera = null;
		this.renderer = null;
		this.controls = null;
		this.clock = null;
		this.mixer = null;
		this.stats = null;
	}

	init() {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xbfe3dd);
		// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.clock = new THREE.Clock();
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		const pmremGenerator = new THREE.PMREMGenerator(renderer);
		scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
		this.renderer = renderer;
		this.element!.innerHTML = "";
		this.element!.appendChild(renderer.domElement);

		this.stats = new Stats();
		this.element!.appendChild(this.stats.dom);
		const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera = camera;
		camera.position.set(0, 0, 400); //设置相机位置
		this.controls = new OrbitControls(camera, renderer.domElement);
		this.controls.target.set(0, 0.5, 0);
		this.controls.update();
		this.controls.enablePan = false;
		this.controls.enableDamping = true;
		this.controls.mouseButtons = {
			LEFT: THREE.MOUSE.PAN,
			MIDDLE: THREE.MOUSE.DOLLY,
			RIGHT: THREE.MOUSE.ROTATE,
		};
		// const geometry = new THREE.BoxGeometry(100, 100, 100);
		// //创建一个材质对象Material
		// const material = new THREE.MeshBasicMaterial({
		// 	color: 0xff0000, //0xff0000设置材质颜色为红色
		// });
		// const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
		// mesh.position.set(0, 10, 0);
		// scene.add(mesh);
		// 设置光照
		// 半球光
		// const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
		// hemisphereLight.position.set(0, 200, 0);
		// scene.add(hemisphereLight);
		// 点光源
		// const light = new THREE.PointLight(0xffff00, 2, 100);
		// light.position.set(0, 0, 0);
		// scene.add(light);
		// const geometry = new THREE.BoxGeometry(1, 1, 1);
		// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		// const cube = new THREE.Mesh(geometry, material);
		// scene.add(cube);

		// camera.position.z = 52;

		// function animate() {
		// 	requestAnimationFrame(animate);

		// 	mesh.rotation.x += 0.01;
		// 	mesh.rotation.y += 0.01;

		// 	renderer.render(scene, camera);
		// }

		// animate();
		// console.log("init", this.element);
		// const width = (this.element as HTMLElement).offsetWidth;
		// const height = (this.element as HTMLElement).offsetHeight;
		// this.scene = new THREE.Scene();
		// this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
		// this.renderer = new THREE.WebGLRenderer({
		// 	antialias: true,
		// 	alpha: true,
		// });
		// this.renderer.setPixelRatio(window.devicePixelRatio);
		// this.renderer.setSize(width, height);
		// this.element!.append(this.renderer.domElement);
		// this.renderer.setClearColor("#FFF");
		this.renderer.render(scene, camera);
		this.scene = scene;

		// window.addEventListener(
		// 	"resize",
		// 	() => {
		// 		this.camera.aspect = this.element!.offsetWidth / this.element!.offsetWidth;
		// 		this.camera.updateProjectionMatrix();
		// 		this.renderer.setSize(this.element!.offsetWidth, this.element!.offsetWidth);
		// 	},
		// 	false
		// );
	}
	// 初始化helper
	initHelper() {
		this.scene.add(new THREE.AxesHelper(100));
	}

	// 初始化控制器
	initOrbitControls() {
		const controls = new OrbitControls(this.camera, this.renderer.domElement);
		controls.enableDamping = true;
		controls.enableZoom = true;
		controls.autoRotate = false;
		controls.autoRotateSpeed = 0.3;
		controls.enablePan = true;
		controls.mouseButtons = {
			LEFT: THREE.MOUSE.PAN,
			MIDDLE: THREE.MOUSE.DOLLY,
			RIGHT: THREE.MOUSE.ROTATE,
		};
		this.controls = controls;
	}

	initLight() {
		const directionalLight = new THREE.DirectionalLight("#fff");
		directionalLight.position.set(30, 30, 30).normalize();
		this.scene.add(directionalLight);
		const ambientLight = new THREE.AmbientLight("#fff", 0.3);
		this.scene.add(ambientLight);
		return {
			directionalLight,
			ambientLight,
		};
	}

	loadFbx(url: string) {
		// const geometry = new THREE.BoxGeometry(1, 1, 1);
		// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		// const cube = new THREE.Mesh(geometry, material);
		// this.scene.add(cube);
		// this.renderer.render(this.scene, this.camera);
		// const loader = new FBXLoader();
		const loader = new GLTFLoader();
		loader.load(url, (gltf: any) => {
			const model = gltf.scene;
			model.position.set(1, 1, 0);
			model.scale.set(0.01, 0.01, 0.01);
			this.scene.add(model);
			this.mixer = new THREE.AnimationMixer(model);
			this.mixer.clipAction(gltf.animations[0]).play();
			gltf.animations; // Array<THREE.AnimationClip>
			gltf.scene; // THREE.Group
			gltf.scenes; // Array<THREE.Group>
			gltf.cameras; // Array<THREE.Camera>
			gltf.asset; // Object
			animate();
		});
		const animate = () => {
			requestAnimationFrame(animate);

			const delta = this.clock.getDelta();

			this.mixer.update(delta);

			this.controls.update();

			this.stats.update();

			this.renderer.render(this.scene, this.camera);
		};
	}
}
