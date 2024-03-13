// commitlint.config.js

/** 包含中文的正则 */
const withChinese = /\p{sc=Han}/gu;
/** 包含中文标点符号的正则 */
const withChinesePunctuation = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]+/;

/** 检测文本中是否包含中文或中文标点符号 */
function withChineseOrChinesePunctuation(str) {
    if (!str) return false;
    return withChinese.test(str) || withChinesePunctuation.test(str);
}

/**
 * @type {import('cz-git').UserConfig}
 * 可参考：https://commitlint.js.org/#/reference-configuration?id=configuration-object-example
 *  */
module.exports = {
    /*
     * 方法返回值为 true 时，无视该提交
     */
    ignores: [(commit) => commit.includes('init')],
    /*
     * 继承该规范
     */
    extends: ['@commitlint/config-conventional'],
    plugins: [
        {
            rules: {
                /** 自定义规则配置，检测subject、body及scope中是否存在中文及中文标点符号 */
                'can-not-be-chinese': (parsed) => {
                    const { subject, body, scope } = parsed;
                    if (withChineseOrChinesePunctuation(subject) || withChineseOrChinesePunctuation(body) || withChineseOrChinesePunctuation(scope)) {
                        return [false, 'subject/body/scope must not contain Chinese or Chinese punctuation'];
                    }

                    return [true, ''];
                },
            },
        },
    ],
    /**
     * 输入commit信息规范
     * 可参考：https://commitlint.js.org/#/reference-rules?id=rules
     * 数组规则如下：
     * 第1个元素为报警等级，范围 [0..2]： 0 代表禁用该规则；1 代表不满足该规则则报警；2 代表不满足该规则则报错
     * 第2个元素为是否应用该规则，范围 always|never。always 表示始终适用，never 代表始终不适用
     * 第3个元素为值，视乎规则使用
     *
     * 对于 header 限制为 50 字符，可参考：https://stackoverflow.com/questions/30414091/keep-commit-message-subject-under-50-characters-in-sourcetree/50397345#50397345
     *
     */
    rules: {
        /** 自定义规则——不允许存在中文及中文标点符号 */
        // 'can-not-be-chinese': [2, 'never'],
        'body-leading-blank': [2, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 50],
        'subject-empty': [2, 'never'],
        'type-empty': [2, 'never'],
        'subject-case': [0],
        'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'revert', 'chore']],
    },
    /** 本配置仅涉及交互工具，及cz-git的配置，纯 git commit 提交无法使用本配置 */
    prompt: {
        /**
         * 部分经常使用到的commit信息可以使用alias来做快速提交
         * 使用方式: npx czg :f
         *
         * 参考：https://cz-git.qbb.sh/recipes/alias#alias
         */
        alias: {
            f: 'docs: fix typos',
            r: 'docs: update README',
            s: 'style: update code format',
            b: 'build: bump dependencies',
            c: 'chore: update config',
        },
        /** 设置空选项(empty)和自定义选项(custom)在选择范围中的位置 */
        customScopesAlign: 'top',
        defaultScope: [],
        scopes: [],
        customScopesAlias: '自定义',
        emptyScopesAlias: '无',
        allowCustomScopes: true,
        allowEmptyScopes: true,
        allowEmptyIssuePrefixs: true,
        allowCustomIssuePrefixs: true,
        messages: {
            type: '选择你要提交的类型 :',
            scope: '选择一个提交范围（可选）:',
            customScope: '请输入自定义的提交范围 :',
            subject: '填写简短精炼的变更描述 :\n',
            body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
            confirmCommit: '是否提交或修改commit ?',
        },
        types: [
            { value: 'feat', name: 'feat:      ✨ 新增功能 | A new feature', emoji: '✨' },
            { value: 'fix', name: 'fix:       🐞 修复缺陷 | A bug fix', emoji: '🐞' },
            {
                value: 'docs',
                name: 'docs:      📝 文档更新 | Documentation only changes',
                emoji: '📝',
            },
            {
                value: 'style',
                name: 'style:     💄 代码格式 | Changes that do not affect the meaning of the code',
                emoji: '💄',
            },
            {
                value: 'refactor',
                name: 'refactor:  ♻️  代码重构 | A code change that neither fixes a bug nor adds a feature',
                emoji: '♻️',
            },
            {
                value: 'perf',
                name: 'perf:      ⚡️ 性能提升 | A code change that improves performance',
                emoji: '⚡️',
            },
            {
                value: 'test',
                name: 'test:      ✅ 测试相关 | Adding missing tests or correcting existing tests',
                emoji: '✅',
            },
            {
                value: 'build',
                name: 'build:     📦️ 构建相关 | Changes that affect the build system or external dependencies',
                emoji: '📦️',
            },
            {
                value: 'ci',
                name: 'ci:        🎡 持续集成 | Changes to our CI configuration files and scripts',
                emoji: '🎡',
            },
            { value: 'revert', name: 'revert:    🔨 回退代码 | Revert to a commit', emoji: '🔨' },
            {
                value: 'chore',
                name: 'chore:     ⏪️ 其他修改 | Other changes that do not modify src or test files',
                emoji: '⏪️',
            },
        ],
        useEmoji: true,
        emojiAlign: 'center',
        themeColorCode: '',
        upperCaseSubject: false,
        /** 跳过对 breaking change、issues 的相关提问 */
        skipQuestions: ['breaking', 'footer', 'footerPrefix'],
        breaklineNumber: 100,
        breaklineChar: '|',
        confirmColorize: true,
        minSubjectLength: 0,
        scopeOverrides: undefined,
        defaultBody: '',
        defaultIssues: '',
        defaultSubject: '',
    },
};
