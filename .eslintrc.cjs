module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'standard',
    // npm i eslint-plugin-prettier eslint-config-prettier -D
    // 将 Prettier 的规则设置到 ESLint 的规则中，关闭 ESLint 中与 Prettier 中会发生冲突的规则。
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['vue', '@typescript-eslint'],
  globals: {
    AMap: true,
    AMapUI: true
  },
  rules: {
    // "off" 或 0：关闭规则
    // "warn" 或 1：开启规则，黄色警告 (不会导致程序退出)
    // "error" 或 2：开启规则，红色错误 (程序执行结果为0表示检测通过；执行结果为1表示有错误待修复)
    'vue/script-setup-uses-vars': 'error',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multi-word-component-names': 'off',
    'no-undef': 'off',
    'no-useless-escape': 'off',
    // 'vue/max-attributes-per-line': [
    //   'error',
    //   {
    //     singleline: {
    //       max: 5
    //     },
    //     multiline: {
    //       max: 1
    //     }
    //   }
    // ],
    'space-before-function-paren': ['error', 'never'],
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    'vue/no-mutating-props': 'off'
  }
}
