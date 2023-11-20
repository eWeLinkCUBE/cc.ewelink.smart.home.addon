import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import SecureLS from 'secure-ls';

const pinia = createPinia();
export const secureLS = new SecureLS();

// 数据持久化 (Data persistence)
pinia.use(
    createPersistedState({
        storage: {
            getItem: (key) => secureLS.get(key),
            setItem: (key, value) => secureLS.set(key, value)
        },
        // base64加密解密内容 (Base64 encryption and decryption content)
        serializer: {
            serialize: JSON.stringify,
            deserialize: JSON.parse,
        },
    })
);

export default pinia;
