/*
 * @Author: hugh-skw 43328844+hugh-skw@users.noreply.github.com
 * @Date: 2023-03-06 11:13:53
 * @LastEditors: hugh-skw 43328844+hugh-skw@users.noreply.github.com
 * @LastEditTime: 2023-03-06 11:17:51
 * @FilePath: /CesiumExampleStation/src/utils/shaders/frogEffect.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @description:雾效果，参考简书代码
 * @date：2022-01-20
 */
import * as Cesium from "cesium";
class FogEffect {
	visibility: any;
	color: any;
	viewer: any;
	_show: any;
	fogStage: any;
	constructor(viewer: Cesium.Viewer, options: any) {
		if (!viewer) throw new Error("no viewer object!");
		options = options || {};
		this.visibility = Cesium.defaultValue(options.visibility, 0.1);
		this.color = Cesium.defaultValue(options.color, new Cesium.Color(0.8, 0.8, 0.8, 0.5));
		this._show = Cesium.defaultValue(options.show, !0);
		this.viewer = viewer;
		// this.init();
	}

	init() {
		this.fogStage = new Cesium.PostProcessStage({
			name: "czm_fog",
			fragmentShader: this.fog(),
			uniforms: {
				visibility: () => {
					return this.visibility;
				},
				fogColor: () => {
					return this.color;
				},
			},
		});
		this.viewer.scene.postProcessStages.add(this.fogStage);
	}

	destroy() {
		if (!this.viewer || !this.fogStage) return;
		this.viewer.scene.postProcessStages.remove(this.fogStage);
		this.fogStage.destroy();
		delete this.visibility;
		delete this.color;
	}

	show(visible: boolean) {
		this._show = visible;
		this.fogStage.enabled = this._show;
	}

	fog() {
		return "uniform sampler2D colorTexture;\n\
         uniform sampler2D depthTexture;\n\
         uniform float visibility;\n\
         uniform vec4 fogColor;\n\
         varying vec2 v_textureCoordinates; \n\
         void main(void) \n\
         { \n\
            vec4 origcolor = texture2D(colorTexture, v_textureCoordinates); \n\
            float depth = czm_readDepth(depthTexture, v_textureCoordinates); \n\
            vec4 depthcolor = texture2D(depthTexture, v_textureCoordinates); \n\
            float f = visibility * (depthcolor.r - 0.3) / 0.2; \n\
            if (f < 0.0) f = 0.0; \n\
            else if (f > 1.0) f = 1.0; \n\
            gl_FragColor = mix(origcolor, fogColor, f); \n\
         }\n";
	}
}
export function startFog(viewer: Cesium.Viewer, options: any): FogEffect {
	const fog = new FogEffect(viewer, options);
	fog.init();
	return fog;
}
// Cesium.FogEffect = FogEffect;
