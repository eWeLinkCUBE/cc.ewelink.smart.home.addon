import fs from 'fs';
import path from 'path';
import express from 'express';
import logger from './log';
import info from './middleware/info';
import router from './routes';
import { internalError, notFound } from './middleware/error';
import config from './config';
import { encode } from 'js-base64';
import { dbDataTmp } from './utils/db';
import oauth from './middleware/oauth';
import CkApi from './lib/coolkit-api';
import db from './utils/db';
import _ from 'lodash';
import gapTimeRun from './utils/gapTimeRun';
import responseInterceptor from './middleware/responseInterceptor';

const app = express();
const port = config.nodeApp.port;

// 配置持久化所需文件 (Configure files required for persistence)
const dataPath = path.join(__dirname, 'data');
const dbPath = path.join(__dirname, 'data', 'db.json');
const versionPath = path.join(__dirname, 'version');

config.nodeApp.dataPath = dataPath;
config.nodeApp.dbPath = dbPath;

if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
}

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, encode(JSON.stringify(dbDataTmp)), 'utf-8');
}

// 获取当前版本号 (Get the current version number)
config.nodeApp.version = fs.existsSync(versionPath) ? fs.readFileSync(versionPath).toString() : '0.0.1';

// 将body解析为json格式 (Parse body into json format)
app.use(express.json());

// 加载静态文件 (Load static files)
app.use(express.static(path.join(__dirname, 'public')));

// 记录传入参数 (Record the incoming parameters)
app.use(info);

// 鉴权校验 (Authentication verification)
app.use(oauth);

// 记录请求时间 (Log request time)
app.use(responseInterceptor);

// 路由处理 (routing processing)
app.use('/api/v1', router);

// 错误处理 (Error handling)
app.use(notFound);
app.use(internalError);

app.listen(port, '0.0.0.0', () => {
    logger.info(`Server is running at http://localhost:${port}----env: ${config.nodeApp.env}----version: v${config.nodeApp.version}`);

    // 初始化 coolkit api (Initialize coolkit api)
    //记住登录状态，防止重启后端服务后得重新登录 (Remember the login status to prevent having to log in again after restarting the backend service)
    const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');

    const initParams = {
        appId: config.coolKit.appId,
        appSecret: config.coolKit.appSecret,
        useTestEnv: config.nodeApp.env === 'dev',
        timeout: 30000,
    };

    if (eWeLinkApiInfo) {
        _.merge(initParams, eWeLinkApiInfo);
    }

    CkApi.init(initParams);
    gapTimeRun();
});
