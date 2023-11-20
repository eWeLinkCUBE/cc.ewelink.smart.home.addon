import {
    configure,
    getLogger
} from 'log4js';
// import config from '../config/index';


configure({
    appenders: {
        out: { type: "stdout" },
    },
    categories: {
        default: {
            appenders: ['out'],
            level: 'info'
        }
    }
});


/*
 * Instructions:
 *      log.info('info message');
 *      log.error('error message');
 */
const logger = getLogger('out');
export default logger;
