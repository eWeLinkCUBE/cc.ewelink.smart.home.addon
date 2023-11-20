import { Modal, Tabs, Spin, Select, Input, Button, Form, Popover, Tooltip, Switch } from 'ant-design-vue';
import type { App } from '@vue/runtime-core';
//使用moment版本的时间组件 (Use the moment version of the time component)
// import DatePicker from 'ant-design-vue/es/date-picker/moment';
// import TimePicker from 'ant-design-vue/es/time-picker/moment';
const components = [Modal, Tabs, Spin, Select, Input, Button, Form, Popover, Tooltip, Switch];

export default function (app: App<Element>) {
    components.forEach((item) => {
        app.use(item);
    });
}
