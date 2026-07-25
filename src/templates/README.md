# 简历模板

每套模板使用与注册表 ID 相同的 CSS 类，例如 `classic.css` 对应 `template-classic`。

新增模板时：

1. 在 `styles/` 下创建模板样式文件并由 `styles/index.css` 引入。
2. 在 `templateRegistry.js` 中注册唯一的 `id`、名称和说明。
3. 模板仅定义视觉布局；简历数据和内容组件保持复用。
