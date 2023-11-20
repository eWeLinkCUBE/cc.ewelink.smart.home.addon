import EEnv from '../src/ts/enum/EEnv';

const isTestEnv = () => import.meta.env.DEV;
/** 环境 (environment)*/
const env = isTestEnv() ? EEnv.TEST : EEnv.PROD;

/** 调试用ip (Debugging IP)*/
const smartHomeIp = isTestEnv() ? 'localhost' : 'localhost';
/** 版本(从.env文件获取)  (version (obtained from .env file))*/
const version = import.meta.env.VITE_VERSION;

/** request baseURL */
const apiUrl = `http://${smartHomeIp}:8321/api/v1`;

// 请求用ak/sk (Request ak/sk)
const TEST_APPID = 'HyeXzioQe4gpfvTS';
const TEST_SECRET = 'KCLh*HfIik$CWf1M@^%TFit45eq9Ha@w';
const PROD_APPID = 'a1MUtJLPDaIfZfe9';
const PROD_SECRET = '&!imrc%uk47plfI^^sldiQ0^nNWWf9L6';
const appId = isTestEnv() ? TEST_APPID : PROD_APPID;
const appSecret = isTestEnv() ? TEST_SECRET : PROD_SECRET;

console.log(`当前版本为 ${version}`); // The current version is ${version}

export { apiUrl, appSecret, appId, env };
