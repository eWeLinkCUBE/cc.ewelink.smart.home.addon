import { devConf } from './dev';
import { prodConf } from './prod';

function config(env: string) {
    return env === 'prod' ? prodConf : devConf;
}

export default config(process.env.APP_ENV as string);
