import * as Cesium from "cesium";
export class canvasBillboard {
	viewer: any;
	constructor(viewer: any) {
		this.viewer = viewer;
	}

	start(imgSrc: string, labelText: string, radio: number, lonlathPos: any) {
		return this.drawCanvas(imgSrc, labelText, radio, (canvasRes: any) => {
			return this.viewer.entities.add({
				id: labelText,
				position: Cesium.Cartesian3.fromDegrees(lonlathPos.x, lonlathPos.y, lonlathPos.z),
				billboard: {
					image: canvasRes,
					sizeInMeters: true,
					scale: 1,
				},
			});
		});
	}

	//根据图片和文字绘制canvas  ratio参数 是放大倍数
	drawCanvas(img: string, text: string, ratio: number, cb: any) {
		// width height
		const canvas: any = document.createElement("canvas"); //创建canvas标签
		const ctx: any = canvas.getContext("2d");

		// eslint-disable-next-line prefer-const
		const width = ctx.measureText(text).width + 8,
			height = 20; //高度我这里是定死的，可以作为参数参入

		canvas.style.opacity = 1;
		canvas.width = width * ratio;
		canvas.height = height * ratio;

		//然后将画布缩放，将图像放大ratio倍画到画布上 目的 使图片文字更加清晰
		ctx.scale(ratio, ratio);
		const image = new Image();
		image.src = img;
		// 图片创建是异步操作，需要在图片完成之后，再写入文字，能保证文字在图片上方。
		// 如果不在里面，会出现图片覆盖文字
		image.onload = function () {
			ctx.drawImage(image, 0, 0, width, height);
			// 名称文字
			ctx.font = "8px 宋体";
			const gradient = ctx.createLinearGradient(0, 5, 0, canvas.height - 45);
			gradient.addColorStop(0, "#FFFFFF");
			gradient.addColorStop(1, "#da9531");
			ctx.fillStyle = gradient;
			ctx.fillText(text, width / 7.5, height / 2 + 2);
			// ctx.textAlign = "center";
			if (cb) {
				cb(canvas);
			}
		};
	}
}
