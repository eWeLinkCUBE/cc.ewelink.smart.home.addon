import { ILanState173And137 } from "../../../../ts/interface/ILanState";
import _ from "lodash";

export default function lanStateToIHostStateBy173And137(lanState: ILanState173And137) {
    const iHostState = {};

    const brightness = _.get(lanState, 'bright', null);

    if (brightness !== null) {
        _.merge(iHostState, {
            brightness: {
                brightness,
            },
        });
    }

    const colorTemp = _.get(lanState, 'colorTemp', null);

    if (colorTemp !== null) {
        _.merge(iHostState, {
            'color-temperature': {
                colorTemperature: 100 - colorTemp,
            },
        });
    }

    const redValue = _.get(lanState, 'colorR', null);
    const greenValue = _.get(lanState, 'colorG', null);
    const blueValue = _.get(lanState, 'colorB', null);

    if (redValue !== null && greenValue !== null && blueValue !== null) {
        _.merge(iHostState, {
            'color-rgb': {
                red: redValue,
                green: greenValue,
                blue: blueValue,
            },
        });
    }


    const mode = _.get(lanState, 'mode', null);
    if (mode !== null) {
        let modeValue = 'whiteLight';
        if (mode === 0 || mode === 1) {
            modeValue = 'color';
        } else if (mode === 2) {
            modeValue = 'colorTemperature';
        } else if (mode === 3) {
            modeValue = 'whiteLight';
        }
        _.merge(iHostState, {
            mode: {
                lightMode: {
                    modeValue,
                },
            },
        });
    }


    return iHostState;
}