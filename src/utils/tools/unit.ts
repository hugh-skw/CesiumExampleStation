export const getAssetsFile = (url: string) => {
	return new URL(`../../assets/${url}`, import.meta.url).href;
};

export const getUtilFile = (url: string) => {
	return new URL("../../utils/draco/", import.meta.url).href;
};
