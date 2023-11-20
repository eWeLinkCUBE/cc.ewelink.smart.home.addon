module.exports = {
    globals: {
        module: 'writable', // 忽略未声明的变量 (Ignore undeclared variables)
    },
    //解析器，解析ts语法
    //Parser, parsing ts grammar
    parser: '@typescript-eslint/parser',
    //第三方插件（规则的集合）
    //Third-party plug-ins (collections of rules)
    plugins: ['@typescript-eslint'],
    //插件包的规则配置一起配置
    //The rule configuration of the plug-in package is configured together.
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    //规则单独选择是否开启
    //Rules can be turned on individually.
    rules: {
        // 禁止使用 var
        // Use of var is prohibited
        'no-var': 'error',
        // 优先使用 interface 而不是 type
        // Prefer interface over type
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    },
};
