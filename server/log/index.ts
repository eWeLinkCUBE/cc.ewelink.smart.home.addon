import config from '../config';
import { configure, getLogger } from 'log4js';

const logConfig = {
    appenders: {
        out: { type: 'stdout', layout: {} },
    },
    categories: {
        default: {
            appenders: ['out'],
            level: 'info',
        },
    },
};

let layout = {};

if (config.nodeApp.env === 'dev') {
    layout = {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} [%p] %m',
        // Disable colorization
        colorize: false,
    };
} else {
    layout = {
        type: 'colored',
    };
}

logConfig.appenders.out.layout = layout;
configure(logConfig);

/*
 * Instructions:
 *      log.info('info message');
 *      log.error('error message');
 */
const logger = getLogger('out');
export default logger;
