/**
 * 范围转换 (range conversion)
 * @param originValue 要转换的设备值 (device value to convert)
 * @param source 设备范围 (Device value range)
 * @returns 转换后的 1-100 (Converted  1-100)
 */
export default function percentTranslateToHundred(originValue: number, source: [number, number], isBrightness = true) {
    //亮度条最小是1，色温条最小是0（The minimum brightness bar is 1, and the minimum color temperature bar is 0）
    if (originValue === source[0]) {
        return isBrightness ? 1 : 0;
    }
    if (originValue === source[1]) return 100;
    const sourceRange = source[1] - source[0] + 1;
    let value = parseInt(((originValue - source[0] + 1) / sourceRange) * 100 + '');
    value < 0 && (value = 1);
    value > 100 && (value = 100);
    return value;
}