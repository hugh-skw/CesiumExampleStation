/// <reference types="vite/client" />

import { Viewer } from "cesium";
import * as Cesium from "cesium";

declare global {
	interface Window {
		viewer: Viewer;
		Cesium: Cesium;
	}
}

declare module "cesium";
