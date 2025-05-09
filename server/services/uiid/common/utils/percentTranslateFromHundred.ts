/**
 * 范围转换 (range conversion)
 * @param originValue 要转换的设备值 (device value to convert)
 * @param source 设备范围 (Device brightness range)
 * @returns 转换后的 1-100 (Converted  1-100)
 */
export default function percentTranslateFromHundred(originValue: number, target: [number, number]) {
    const value = (originValue / 100) * (target[1] - target[0]) + target[0];
    if (originValue === 0) return target[0];
    if (originValue === 100) return target[1];
    return Math.round(value);
}