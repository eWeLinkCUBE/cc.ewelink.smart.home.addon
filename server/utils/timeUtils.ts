export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1);
        }, ms);
    });
}
