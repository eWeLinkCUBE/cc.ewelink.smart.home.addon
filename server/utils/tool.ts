// 将字符串变成整数类型,num代表小数点几位
// Convert the string into an integer type, num represents the number of decimal points
export function toIntNumber(value: string | number, num = 0) {
    return Number(Number(value).toFixed(num));
}
