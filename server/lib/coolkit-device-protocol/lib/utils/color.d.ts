import type { RGB } from 'color-convert/conversions';
export declare function hueToRgb(hue: number, saturation?: number): RGB;
export declare function rgbToHue(r: number, g: number, b: number): import("color-convert/conversions").HSV;
export declare function rgbToHex(r: number, g: number, b: number): string;
export declare function hexToRgb(hex: string): RGB;
export declare function rgbToDec(r: number, g: number, b: number): number;
export declare function decToRgb(dec: number): RGB;
export declare function brightTranslate(originBright: number, source: [number, number]): number;
export declare function getValueByScope(beforeNum: number, beforeRange: {
    min: number;
    max: number;
}, afterRange: {
    min: number;
    max: number;
}): number;
