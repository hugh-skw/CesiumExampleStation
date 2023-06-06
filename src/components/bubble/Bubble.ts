/**
 * @descripion:
 * @param {Viewer} viewer
 * @param {Cartesian2} position
 * @param {String} title
 * @param {String} id
 * @return {*}
 */
import * as Cesium from "cesium";
import { createVNode, render } from "vue";
import Label from "./bubbleIndex.vue";

export default class Bubble {
	viewer: Cesium.Viewer;
	position: any;
	vmInstance: any;

	constructor(val: any) {
		// console.log(val.monitoItems.data.name);
		this.viewer = val.viewer;
		//  this.height = val.height;
		this.position = val.position._value;
		const title = "固定枪机";
		const state = "在线";
		const id = val.id;
		// console.log(id);
		this.vmInstance = createVNode(Label, {
			title,
			state,
			id,
		}); //根据模板创建一个面板

		// console.log(this.vmInstance);
		render(this.vmInstance, val.viewer.cesiumWidget.container);
		this.vmInstance.el.closeEvent = (e: any) => {
			this.windowClose();
		};
		val.viewer.cesiumWidget.container.appendChild(this.vmInstance.el); //将字符串模板生成的内容添加到DOM上
		//
		this.addPostRender();
	}

	//添加场景事件
	addPostRender() {
		this.viewer.scene.postRender.addEventListener(this.postRender, this);
	}

	//场景渲染事件 实时更新窗口的位置 使其与笛卡尔坐标一致
	postRender() {
		if (!this.vmInstance.el || !this.vmInstance.el.style) return;
		const canvasHeight = this.viewer.scene.canvas.height;
		const windowPosition = new Cesium.Cartesian2();
		Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, windowPosition);
		this.vmInstance.el.style.bottom = canvasHeight - windowPosition.y + 260 + "px";
		const elWidth = this.vmInstance.el.offsetWidth;
		this.vmInstance.el.style.left = windowPosition.x - elWidth / 2 + 110 + "px";

		const camerPosition = this.viewer.camera.position;
		let height = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(camerPosition).height;
		height += this.viewer.scene.globe.ellipsoid.maximumRadius;
		if (!(Cesium.Cartesian3.distance(camerPosition, this.position) > height) && this.viewer.camera.positionCartographic.height < 50000000) {
			this.vmInstance.el.style.display = "block";
		} else {
			this.vmInstance.el.style.display = "none";
		}
	}

	//关闭
	windowClose() {
		// debugger;
		if (this.vmInstance) {
			this.vmInstance.el.style.display = "none"; //删除dom
			this.vmInstance.el.remove();
			// this.vmInstance.$destroy();
		}
		this.vmInstance = null;
		this.viewer.scene.postRender.removeEventListener(this.postRender, this); //移除事件监听
	}
}
