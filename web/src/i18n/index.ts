import { createI18n } from "vue-i18n";
import _ from "lodash";
import en from "./en-us";
import cn from "./zh-cn";
import ELanguage from "@/ts/enum/ELanguage";
import { secureLS } from "@/store";

const messages = {
    "en-us": en,
    "zh-cn": cn,
};

function getLocale() {
    const etc = secureLS.get("etc");
    if (etc) {
        const etcStore = JSON.parse(etc);
        if (!_.isEmpty(etcStore)) {
            return etcStore.language;
        }
    }
    return navigator.language.toLowerCase() === ELanguage.CHINA ? ELanguage.CHINA : ELanguage.ENGLISH;
}
const i18n = createI18n({
    locale: getLocale(),
    messages: messages,
});

export default i18n;
