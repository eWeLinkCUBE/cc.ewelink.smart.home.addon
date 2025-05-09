// 将字符串变成整数类型,num代表小数点几位
// Convert the string into an integer type, num represents the number of decimal points
export function toIntNumber(value: string | number, num = 0) {
    return Number(Number(value).toFixed(num));
}


/**
 * 检查一个对象是否包含另一个对象(Check if an object contains another object)
 * @param obj - 被检查的对象 (the object being inspected)
 * @param partial - 要检查的部分对象(Some objects to check)
 * @returns boolean - 是否包含(Does it contain)
 */
export function isObjectSubset(obj: any, partial: any): boolean {
    if (typeof obj !== "object" || typeof partial !== "object" || obj === null || partial === null) {
        return false;
    }

    return Object.keys(partial).every((key) => {
        if (typeof partial[key] === "object" && partial[key] !== null) {
            // 如果 partial[key] 是对象，则递归检查
            return isObjectSubset(obj[key], partial[key]);
        }
        // 否则直接比较值
        return obj[key] === partial[key];
    });
}