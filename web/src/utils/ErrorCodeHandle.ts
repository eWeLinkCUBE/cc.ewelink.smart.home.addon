import { message } from "ant-design-vue";
import i18n from "@/i18n/index";
import errorI18n from '@/i18n/en-us';
const NO_MESSAGE_ERROR = [110001]

function ErrorCodeHandle(error: number) {

    // 如果不存在错误码的翻译，不弹出错误消息
    // If there is no translation of the error code, no error message will pop up.
    if (!errorI18n.ERROR.hasOwnProperty(error)) {
        return
    }

    // 不用提示的错误码
    // silent error code
    if(NO_MESSAGE_ERROR.includes(error))return

    message.error(i18n.global.t(`ERROR.${error}`));
}

export default ErrorCodeHandle;
