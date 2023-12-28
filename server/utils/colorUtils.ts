import convert from 'color-convert'
import type { RGB, HSV } from 'color-convert/conversions'

/**
 * 输入的h范围为[0, 360], s, l 为百分比形式的数值,范围是[0,100]
 * 输出 r, g, b 范围为[0, 255]
 * @param h
 * @param s
 * @param v
 * @returns [r, g, b]
 */
export function hsvToRgb(h: number, s = 100, v = 100) {
    const hsv: HSV = [h, s, v]
    return convert.hsv.rgb(hsv)
}

/**
 * r,g,b范围为[0,255],转换成h范围为[0,360]
 * s,v为百分比形式，范围是[0,100],可根据需求做相应调整
 * @param r 0 ~ 255
 * @param g 0 ~ 255
 * @param b 0 ~ 255
 * @returns [h, s, v]
 */
export function rgbToHsv(r: number, g: number, b: number) {
    const rgb: RGB = [r, g, b]
    return convert.rgb.hsv(rgb)
}
