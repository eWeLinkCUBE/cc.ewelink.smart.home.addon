import { NextFunction, Request, Response } from 'express';
import logger from '../log';
enum EType {
    COME_TIME = 'comeTime',
    OUT_TIME = 'outTime',
}
let startTime = 0;
// 自定义中间件方法来拦截响应 (Custom middleware method to intercept response)
export default function responseInterceptor(req: Request, res: Response, next: NextFunction) {
    toLog(req.body, EType.COME_TIME);

    // 重写res.json方法 (Override res.json method)
    const originalJson = res.json;

    res.json = function (this: Response, data: any) {
        toLog(req.body, EType.OUT_TIME);

        originalJson.call(this, data); // 调用原始的 res.json 方法 (Call the original res.json method)
    } as any;

    next(); // 继续处理请求 (Continue processing the request)
}
// 打印出请求来时时间和出去时间
// Print out the request incoming time and outgoing time
function toLog(reqBody: any, type: EType) {
    const { directive = null } = reqBody;
    if (directive) {
        const { header = null, endpoint = null } = directive;
        const nowTime = Date.now();
        if (type === EType.COME_TIME) {
            startTime = nowTime;
            logger.info(`${type} -------------------------------------`, endpoint.third_serial_number, startTime, header.message_id);
        } else if (type === EType.OUT_TIME) {
            logger.info(`${type} -------------------------------------`, endpoint.third_serial_number, nowTime, nowTime - startTime + 'ms', header.message_id);
        }
    }
}
