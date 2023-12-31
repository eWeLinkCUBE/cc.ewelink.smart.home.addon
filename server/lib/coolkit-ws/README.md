# 使用

## 初始化

使用该插件**必须先初始化**，否则报错。

### 参数

**config 对象**

| 名称             | 类型    | 允许空 | 说明                                                                           |
| ---------------- | ------- | ------ | ------------------------------------------------------------------------------ |
| appid            | string  | N      | appid                                                                          |
| at               | string  | N      | 用户 at                                                                        |
| apikey           | string  | N      | 用户 apiKey                                                                    |
| region           | string  | N      | cn / us / eu / as                                                              |
| userAgent        | string  | N      | app / device / pc_ewelink                                                      |
| chipid           | string  | N      | 设备芯片 id                                                                    |
| deviceid         | string  | N      | 设备 id                                                                        |
| useTestEnv       | boolean | Y      | 是否使用测试环境，默认为 false                                                 |
| reqTimeout       | number  | Y      | 请求超时时间，单位为毫秒，默认为 15000                                         |
| heartBeatRatio   | number  | Y      | 心跳间隔的百分比，默认为 90。真实心跳时间 = 心跳时间 \* (heartBeatRatio / 100) |
| retryInterval    | number  | Y      | 重试间隔 = retryCount \* retryInterval                                         |
| maxRetry         | number  | Y      | 最大重试次数，默认为 5 秒，最低为 5 秒，最高为 2 小时                          |
| maxRetryInterval | number  | Y      | 最大重试总时间，以秒为单位，默认为 2 小时                                      |

### 返回值

| 名称  | 类型   | 说明                                                                                                               |
| ----- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| error | string | 错误码 0:无错误 601:连接错误 602: 重连失败 603: 重连结束 604: 请求错误或超时 605: 网络连接有误，无法获取长连接地址 |
| msg   | string | 错误或成功信息                                                                                                     |

### 示例

```js
import coolKitWs from 'coolkit-ws';
// app 端连接
const config = {
    userAgent:"app" | "pc_ewelink"
    appid: 'your-app-id',
    at: 'your-at',
    apikey: 'your-apiKey',
    region: 'your-country',
};

// 设备端连接
const config = {
    userAgent:"device",
    apikey: 'your-apiKey',
    region: 'your-country',
    appid: 'your-app-id',
    chipid: 'your-chip-id',
    deviceid: 'your-device-id'
};


const result = await coolKitWs.init(config);
console.log('连接的结果: ', result);
```

## 更新设备状态

### 参数

**config 对象**

| 名称         | 类型   | 允许空 | 说明        |
| ------------ | ------ | ------ | ----------- |
| deviceid     | string | N      | 设备 id     |
| deviceApikey | string | N      | 设备 apiKey |
| params       | object | N      | 更新参数    |

### 返回值

| 名称     | 类型   | 说明               |
| -------- | ------ | ------------------ |
| error    | string | 错误码             |
| deviceid | string | 设备 id            |
| apikey   | string | 设备 apiKey        |
| sequence | string | 用于标识消息的序列 |

### 示例

```js
import coolKitWs from 'coolkit-ws';
const updateResult = await coolKitWs.updateThing({
    deviceid: 'your-device-id',
    deviceApikey: 'your-device-apiKey',
    params: {
        // your params
    },
});

console.log('更新结果: ', updateResult);
```

## 查询设备状态

### 参数

**config 对象**

| 名称         | 类型                    | 允许空 | 说明        |
| ------------ | ----------------------- | ------ | ----------- |
| deviceid     | string                  | N      | 设备 id     |
| deviceApikey | string                  | N      | 设备 apiKey |
| params       | array[string] or string | N      | 查询选项    |

### 返回值

| 名称     | 类型   | 说明               |
| -------- | ------ | ------------------ |
| error    | string | 错误码             |
| deviceid | string | 设备 id            |
| apikey   | string | 设备 apiKey        |
| sequence | string | 用于标识消息的序列 |
| params   | string | 查询结果           |

### 示例

```js
import coolKitWs from 'coolkit-ws';
const queryResult = await coolKitWs.queryThing({
    deviceid: 'your-device-id',
    deviceApikey: 'your-device-apiKey',
    params: ['your-query-item1', 'your-query-item2'] | 'your-query-item',
});

console.log('查询结果', queryResult);
```

## 设置回调函数监听长连接

### 参数

**config 对象**

| 名称     | 类型     | 允许空 | 说明                                                      |
| -------- | -------- | ------ | --------------------------------------------------------- |
| method   | string   | N      | 监听事件名称 "message" "open" "close" "error" "reconnect" |
| callback | function | N      | 回调函数                                                  |

### 示例

```js
import coolKitWs from 'coolkit-ws';
coolKitWs.on('message', (ev) => {
    console.log('我接收到消息了', ev.data);
});
```

## 升级设备固件

### 参数

**config 对象**

| 名称         | 类型         | 允许空 | 说明         |
| ------------ | ------------ | ------ | ------------ |
| deviceid     | string       | N      | 设备 id      |
| deviceApikey | string       | N      | 设备 apiKey  |
| params       | upgrade 对象 | N      | 升级固件参数 |

**upgrade 对象**

| 名称    | 类型             | 允许空 | 说明                |
| ------- | ---------------- | ------ | ------------------- |
| model   | string           | N      | 设备的模块型号      |
| version | string           | N      | 预升级版本          |
| binList | binList 对象数组 | N      | 不同分区的 bin 列表 |

**binList 对象**

| 名称        | 类型   | 允许空 | 说明                     |
| ----------- | ------ | ------ | ------------------------ |
| downloadUrl | string | N      | 设备的模块型号           |
| name        | string | N      | 下载文件名称             |
| digest      | string | Y      | 文件 HASH 摘要（SHA256） |

### 返回值

| 名称      | 类型   | 说明               |
| --------- | ------ | ------------------ |
| error     | string | 错误码             |
| deviceid  | string | 设备 id            |
| apikey    | string | 设备 apiKey        |
| sequence  | string | 用于标识消息的序列 |
| userAgent | string | 发起设备           |

### 示例

```js
import coolKitWs from 'coolkit-ws';
const upgradeResult = await coolKitWs.upgradeThing({
    deviceid: '10004fd8ac',
    deviceApikey: 'efe86fc8-bf2f-40ec-8286-49f4012cef52',
    params: {
        model: '设备Model',
        version: '预升级版本',
        binList: [
            {
                downloadUrl: 'bin文件1下载地址',
                digest: '文件 HASH 摘要（SHA256）',
                name: 'user1.bin',
            },
        ],
    },
});

console.log('升级结果', upgradeResult);
```

## 关闭长连接

### 参数

无

### 返回值

true/false

### 示例

```js
import coolKitWs from 'coolkit-ws';
coolKitWs.close();
```

## 判断长连接是否存在

### 参数

无

### 返回值

true/false

### 示例

```js
import coolKitWs from 'coolkit-ws';
coolKitWs.isWsExist();
```

## 发送数据

### 参数

| 名称   | 类型          | 允许空 | 说明     |
| ------ | ------------- | ------ | -------- |
| params | string/object | N      | 传送数据 |

### 返回值

无

### 示例

```js
import coolKitWs from 'coolkit-ws';
coolKitWs.sendMessage();
```

## 查看长连接状态

### 参数

无

### 返回值

| 名称 | 类型   | 允许空 | 说明                        |
| ---- | ------ | ------ | --------------------------- |
| data | string | N      | INIT ERROR CLOSED CONNECTED |

### 示例

```js
import coolKitWs from 'coolkit-ws';
coolKitWs.wsState();
```
