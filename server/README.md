## PostMan使用脚本计算出sign和取得at (Post man uses script to calculate sign and obtain at)
正式环境命令(formal environment command)：APP_ENV=prod npm run serve
### 1、点击collect，切换到 Pre-request Script (Click collect to switch to Pre-request Script)

```js
const cryptoJS = require('crypto-js');

const ts = `${Date.now()}`
const appId = pm.collectionVariables.get("appId");
logger.error("appid => ", appId);
const secret = pm.collectionVariables.get("secret");
logger.error("secret => ", secret);



let params = {};
if (pm.request.method === 'GET') {
    pm.request.addQueryParams(`appid=${appId}`);
    pm.request.addQueryParams(`ts=${ts}`);
    params = pm.request.url.query.toObject();
} else {
    const body = JSON.parse(pm.request.body);
    const newBody = Object.assign(body, { ts, appid:appId });
    pm.request.body = {
        mode: "raw",
        raw: JSON.stringify(newBody),
        options: {
            raw: {
                language: "json"
            }
        }
    }

    logger.error("pm.request.body.urlencoded => ", pm.request.body.urlencoded)
    logger.error("pm.request.body => ", pm.request.body)
    params = JSON.parse(pm.request.body.raw)
}

const sign = getSign(params);

logger.error("sign => ", sign);

pm.collectionVariables.set("paramsSign", sign);
    pm.request.headers.add({
        key: "sign",
        value: `Sign ${sign}`
    })


/** 在非登录/注册请求中加上at (Add at to non-login/registration requests)*/
const isUerRelateReq = pm.request.url.path.includes("device/lan") && pm.request.url.path.includes("account");
if (!isUerRelateReq) {
    const at = pm.collectionVariables.get("at");
    pm.request.headers.add({
        key: "authorization",
        value: `Bearer ${at}`
    })
}





function getSign(params) {
    let sign = '';
    let str = '';

    try {

        Object.keys(params)
            .sort()
            .forEach((key) => {
                const value = _.get(params, key);
                str += `${key}${typeof value === 'object' ? JSON.stringify(value) : value}`;
            });
        sign = cryptoJS.MD5(`${secret}${encodeURIComponent(str)}${secret}`)
            .toString()
            .toUpperCase();
    } catch (err) {
        logger.error('got error here', err);
    }

    return sign;
}
```

### 2、点击登录接口进入，切换到 Tests (Click the login interface to enter and switch to Tests)

```js
const res = JSON.parse(pm.response.text());
if(res.error !== 0) return;

const { at } = res.data;
pm.collectionVariables.set("at", at);
console.info(`登录成功，at ${at} 已填充到环境变量`);
```
