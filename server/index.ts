import fs from 'fs';
import path from 'path';
import express from 'express';
import logger from './log';
import info from './middleware/info';
import router from './routes';
import { internalError, notFound } from './middleware/error';
import config from './config';
import { dbDataTmp } from './utils/db';
import oauth from './middleware/oauth';
import gapTimeRun from './utils/gapTimeRun';
import responseInterceptor from './middleware/responseInterceptor';
import { initCoolkitApi, initCoolkitWs } from './utils/initApi';
import { encode } from 'js-base64';
import os from 'os';

const app = express();
const port = config.nodeApp.port;

// 获取当前版本号 (Get the current version number)
const versionPath = path.join(__dirname, 'version');
config.nodeApp.version = fs.existsSync(versionPath) ? fs.readFileSync(versionPath).toString() : '0.0.1';

// 配置持久化所需文件 (Configure files required for persistence)
const dataPath = path.join(__dirname, 'data');
const dbPath = path.join(__dirname, 'data', 'db.json');

config.nodeApp.dataPath = dataPath;
config.nodeApp.dbPath = dbPath;

if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
}

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, encode(JSON.stringify(dbDataTmp)), 'utf-8');
}

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

app.listen(port, '0.0.0.0', async () => {
    logger.info(`Server is running at http://localhost:${port}, env: ${config.nodeApp.env}, version: v${config.nodeApp.version}, platform: ${os.hostname()}`);
    initCoolkitApi();
    initCoolkitWs();
    gapTimeRun();
});
