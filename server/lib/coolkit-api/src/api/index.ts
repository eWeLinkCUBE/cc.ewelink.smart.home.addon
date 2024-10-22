export type ReqMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type MsgLang = 'en' | 'cn';

export interface ApiResponse {
    error: number;
    msg: string;
    data: any;
}

export { user } from './user';
export { home } from './home';
export { device } from './device';
export { family } from './family';
export { message } from './message';
export { scene } from './scene';
export { other } from './other';
export { openPlatform } from './open-platform';
export { energy, type CoolkitEnergy } from './energy';
