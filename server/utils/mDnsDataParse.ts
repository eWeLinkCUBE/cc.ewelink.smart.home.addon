import CryptoJS from 'crypto-js';
import logger from '../log';

const encryptionData = ({ iv, key, data }: { iv: string; key: string; data: string }) => {
    //加密 (encryption)
    try {
        //加密 (encryption)
        const cipher = CryptoJS.AES.encrypt(data, CryptoJS.MD5(key), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        const base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64);
        return base64Cipher;
    } catch (e) {
        logger.error(`encryptionData error: ${e}`);
    }
};

const decryptionData = ({ iv, key, data }: { iv: string; key: string; data: string }) => {
    //解密 Decrypt
    const bytes = CryptoJS.AES.decrypt(data, CryptoJS.MD5(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
};

const decryptionDataZigbeeP = ({ iv, key, data }: { iv: string; key: string; data: string }) => {
    //解密 Decrypt
    const bytes = CryptoJS.AES.decrypt(data, CryptoJS.MD5(key), {
        iv: CryptoJS.enc.Base64.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
};

const encryptionBase64 = (str: string) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
};

const decryptionBase64 = (base64Str: string) => {
    return CryptoJS.enc.Base64.parse(base64Str).toString(CryptoJS.enc.Utf8);
};

export default {
    encryptionData,
    decryptionData,
    decryptionDataZigbeeP,
    encryptionBase64,
    decryptionBase64,
};
