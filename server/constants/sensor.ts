/** 温湿度传感器探头对应的最大最小值
 * (The maximum and minimum values corresponding to the temperature and humidity sensor probe)
 * */
export const sensorTypeObj = {
    DHT11: {
        humRange: {
            min: 20,
            max: 90,
        },
        temRange: {
            min: 0,
            max: 50,
        },
    },
    DS18B20: {
        humRange: null,
        temRange: {
            min: -55,
            max: 125,
        },
    },
    AM2301: {
        humRange: {
            min: 0,
            max: 100,
        },
        temRange: {
            min: -40,
            max: 80,
        },
    },
    Si702: {
        humRange: {
            min: 0,
            max: 100,
        },
        temRange: {
            min: -40,
            max: 80,
        },
    },
    MS01: {
        humRange: {
            min: 0,
            max: 100,
        },
        temRange: null,
    },
    WTS01: {
        humRange: null,
        temRange: {
            min: -55,
            max: 125,
        },
    },
    errorType: {
        humRange: null,
        temRange: null,
    },
};