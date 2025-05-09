/** 等待时间 单位 ms (Waiting time unit ms) */
export default function sleepMs(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('');
        }, ms);
    });
}