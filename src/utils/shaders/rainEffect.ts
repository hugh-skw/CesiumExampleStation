/*
 * @Author: hugh-skw 43328844+hugh-skw@users.noreply.github.com
 * @Date: 2023-03-06 09:37:12
 * @LastEditors: hugh-skw 43328844+hugh-skw@users.noreply.github.com
 * @LastEditTime: 2023-03-06 09:52:10
 * @FilePath: /CesiumExampleStation/src/utils/shaders/rainEffect.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @description:下雨效果，参考简书上的代码
 * @date：2022-01-20
 */
import * as Cesium from "cesium";

class RainEffect {
	tiltAngle: any;
	rainSize: any;
	rainSpeed: any;
	viewer: any;
	rainStage: any;
	constructor(viewer: Cesium.Viewer, options: any) {
		if (!viewer) throw new Error("no viewer object!");
		options = options || {};
		//倾斜角度，负数向右，正数向左
		this.tiltAngle = Cesium.defaultValue(options.tiltAngle, -0.6);
		this.rainSize = Cesium.defaultValue(options.rainSize, 0.3);
		this.rainSpeed = Cesium.defaultValue(options.rainSpeed, 60.0);
		this.viewer = viewer;
	}

	init() {
		this.rainStage = new Cesium.PostProcessStage({
			name: "czm_rain",
			fragmentShader: this.rain(),
			uniforms: {
				tiltAngle: () => {
					return this.tiltAngle;
				},
				rainSize: () => {
					return this.rainSize;
				},
				rainSpeed: () => {
					return this.rainSpeed;
				},
			},
		});
		this.viewer.scene.postProcessStages.add(this.rainStage);
	}

	destroy() {
		if (!this.viewer || this.rainStage.isDestroyed()) return;
		this.viewer.scene.postProcessStages.remove(this.rainStage);
		this.rainStage.destroy();
		delete this.tiltAngle;
		delete this.rainSize;
		delete this.rainSpeed;
	}

	show(visible: any) {
		this.rainStage.enabled = visible;
	}

	rain() {
		return "precision mediump float; \n\
				uniform sampler2D colorTexture;\n\
                varying vec2 v_textureCoordinates;\n\
                uniform float tiltAngle;\n\
                uniform float rainSize;\n\
                uniform float rainSpeed;\n\
                float hash(float x) {\n\
                    return fract(sin(x * 133.3) * 13.13);\n\
                }\n\
                void main(void) {\n\
                    float time = czm_frameNumber / rainSpeed;\n\
                    vec2 resolution = czm_viewport.zw;\n\
                    vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);\n\
                    vec3 c = vec3(.6, .7, .8);\n\
                    float a = tiltAngle;\n\
                    float si = sin(a), co = cos(a);\n\
                    uv *= mat2(co, -si, si, co);\n\
                    uv *= length(uv + vec2(0, 4.9)) * rainSize + 1.;\n\
                    float v = 1. - sin(hash(floor(uv.x * 100.)) * 2.);\n\
                    float b = clamp(abs(sin(20. * time * v + uv.y * (5. / (2. + v)))) - .95, 0., 1.) * 20.;\n\
                    c *= v * b;\n\
                    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c, 1), .5);\n\
                }\n\
                ";
	}
}

export function startRain(viewer: Cesium.Viewer, options: any): RainEffect {
	const rain = new RainEffect(viewer, options);
	rain.init();
	return rain;
}
// Cesium.RainEffect = RainEffect;
