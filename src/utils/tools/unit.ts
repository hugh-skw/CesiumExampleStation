export const getAssetsFile = (url: string) => {
	return new URL(`../../assets/${url}`, import.meta.url).href;
};

export const getGltfDracoDir = () => {
	let resUrl = new URL("../../utils/draco/", import.meta.url).href + "/";
	if (resUrl[resUrl.length - 1] !== "/") {
		resUrl += "/";
	}
	return resUrl;
};
