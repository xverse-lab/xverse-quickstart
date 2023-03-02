module.exports = {
  // 单行宽度
  printWidth: 120,
  // 缩进宽度
  tabWidth: 2,
  // 使用空格代替 tab, 默认 false
  useTabs: false,
  // 结尾使用分号，默认 true
  semi: false,
  // 使用单引号
  singleQuote: true,
  // 为对象添加引号
  quoteProps: 'as-needed',
  // 多行尽可能打印逗号
  trailingComma: 'all',
  // 对象前后加空格
  bracketSpacing: true,
  // 箭头函数使用括号
  arrowParens: 'always',
  // 解析使用 babel-ts 还是 typescript
  // parser: 'babel-ts'
  //无需顶部注释即可格式化
  requirePragma: false,
  //在已被preitter格式化的文件顶部加上标注
  insertPragma: false,
  // 让文本块换行，可以理解为 text-warp
  proseWrap: 'preserve',
  // ignore html 空白忽略
  htmlWhitespaceSensitivity: 'ignore',
  // 行尾
  endOfLine: 'auto',
  // 引用代码格式化
  embeddedLanguageFormatting: 'auto',
  // 强制执行单个属性
  singleAttributePerLine: false,
}
