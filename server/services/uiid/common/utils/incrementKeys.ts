/** 将toggle里的通道key加一 (Add one to the channel key in the toggle) */
export default function incrementKeys(obj: { [key: number]: string }): { [key: number]: string } {
    const result: { [key: number]: string } = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = parseInt(key) + 1;
            result[newKey] = obj[key];
        }
    }

    return result;
}