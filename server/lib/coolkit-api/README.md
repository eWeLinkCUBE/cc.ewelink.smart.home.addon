# coolkit-api

酷宅 APIv2 接口库。

## 安装

> `coolkit-api` 库目前只在内网可用。

使用 npm 安装：

```
npm install coolkit-api --registry=http://172.20.1.22:4873/
```

## 示例

先调用用户登录接口，再调用获取设备接口。

```js
import process from 'node:process';
// 引入 coolkit-api 包
import CkApi from 'coolkit-api';

// 从环境变量里读取酷宅 APIv2 的 appid 和 appsecret
const {
    CK_APP_ID,
    CK_APP_SECRET
} = process.env;

const test = async () => {
    // 初始化 coolkit-api 库
    CkApi.init({
        appId: CK_APP_ID,
        appSecret: CK_APP_SECRET
    });

    // 调用用户登录接口
    await CkApi.user.login({ ... });

    // 调用获取设备列表接口
    await CkApi.device.getThingList({ ... });
};

test();
```

## API

### `CkApi.init(params)`

* `params` `<Object>`

    - `appId` `<string>` 酷宅 APIv2 的 appid

    - `appSecret` `<string>` 酷宅 APIv2 的 appsecret

    - `debug` `<boolean>` 是否开启 Debug 模式，默认为 `false`

    - `useTestEnv` `<boolean>` 是否使用测试环境的酷宅 APIv2，默认为 `false`

    - `at` `<string>` 酷宅 APIv2 的 access token

    - `rt` `<string>` 酷宅 APIv2 的 refresh token

    - `countryCode` `<string>` 用户所在地区的国家码

    - `timeout` `<number>` 每次请求的超时时长，单位为毫秒，默认为 `15000`

    - `region` `<string>` 用户帐号所在大区

## 错误码列表

| 错误码 | 错误消息 |
| - | - |
| `91001` | 无效的国家码 |
