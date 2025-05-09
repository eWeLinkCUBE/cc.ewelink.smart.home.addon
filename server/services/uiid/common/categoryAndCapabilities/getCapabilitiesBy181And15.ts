import IEWeLinkDevice from "../../../../ts/interface/IEWeLinkDevice";
import ICapability from "../../../../ts/interface/ICapability";
import { sensorTypeObj } from "../../../../constants/sensor";
import ECapability from "../../../../ts/enum/ECapability";
import _ from "lodash";

/** 181 和 15 通过易位联数据和默认能力协议配置获取设备的能力协议配置和设备类别 */
export default function getCapabilitiesBy181And15(capabilities: ICapability[], eWeLinkDeviceData: IEWeLinkDevice) {
    const sensorType = eWeLinkDeviceData.itemData.params?.sensorType as string;

    return capabilities.map((item) => {
        if (item.capability === ECapability.HUMIDITY) {
            const range = _.get(sensorTypeObj, [sensorType, 'humRange'], null);
            if (range) {
                const humidityRange = {
                    type: "numeric",
                    permission: "01",
                }
                const { min, max } = range;
                _.set(humidityRange, ['min'], min);
                _.set(humidityRange, ['max'], max);

                _.set(item, ['settings', 'humidityRange'], humidityRange)
            }
        }

        if (item.capability === ECapability.TEMPERATURE) {
            const range = _.get(sensorTypeObj, [sensorType, 'temRange'], null);
            if (range) {
                const temperatureRange = {
                    type: "numeric",
                    permission: "01",
                };
                const { min, max } = range;
                _.set(temperatureRange, ['min'], min);
                _.set(temperatureRange, ['max'], max);

                _.set(item, ['settings', 'temperatureRange'], temperatureRange)
            }
        }
        return item;
    });
}