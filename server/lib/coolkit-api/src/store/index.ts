const store: any = {
    appId: '',
    appSecret: '',
    domain: '',
    at: '',
    rt: '',
    debug: false,
    useTestEnv: false,
    timeout: 15000,
    blockList: []
};

export type BlockListItem = {
    method: string
    url: string
}

// showStore - debug only
export function showStore() {
    console.log(store);
}

export function setAppId(v: string) {
    store.appId = v;
}

export function getAppId() {
    return store.appId;
}

export function setAppSecret(v: string) {
    store.appSecret = v;
}

export function getAppSecret() {
    return store.appSecret;
}

export function setDomain(v: string) {
    store.domain = v;
}

export function getDomain() {
    return store.domain;
}

export function setAt(v: string) {
    store.at = v;
}

export function getAt() {
    return store.at;
}

export function setRt(v: string) {
    store.rt = v;
}

export function getRt() {
    return store.rt;
}

export function setDebug(v: boolean) {
    store.debug = v;
}

export function getDebug() {
    return store.debug;
}

export function setUseTestEnv(v: boolean) {
    store.useTestEnv = v;
}

export function getUseTestEnv() {
    return store.useTestEnv;
}

export function setTimeout(v: number) {
    store.timeout = v;
}

export function getTimeout() {
    return store.timeout;
}

export function setBlockList(v: BlockListItem[]) {
    store.blockList = v;
}

export function getBlockList(): BlockListItem[] {
    return store.blockList;
}
