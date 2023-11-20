
/**
 * 根据路径获取assets文件夹内的文件（主要用于图片）
 * Get the files in the assets folder according to the path (mainly used for pictures)
 * @date 22/11/2022
 * @export
 * @param {string} url
 * @returns {*}
 */
 export function getAssetsFile(url: string) {
    return new URL(`../assets/${url}`, import.meta.url).href
};
