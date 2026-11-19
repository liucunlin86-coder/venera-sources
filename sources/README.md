# VeneraX Sources

适用于 VeneraX 3.0.0 的漫画源目录。

## 目录结构

- `_template.js`：通用漫画源模板
- `_parser.js`：通用数据处理工具
- `demo_test.js`：功能演示源

## 已有源

| 名称 | Key | 版本 | 状态 |
|---|---|---|---|
| VeneraX 测试源 | demo_test_source | 1.1.0 | Stable |

## 统一接口

每个漫画源应实现：

- `search.load(keyword, options, page)`
- `comic.loadInfo(id)`
- `comic.loadEp(comicId, epId)`

## 数据规范

搜索结果：

- id
- title
- cover
- subtitle

漫画详情：

- title
- subtitle
- cover
- description
- tags
- chapters

章节内容：

- images

## 开发规范

1. 每个源独立使用一个 JavaScript 文件。
2. `key` 必须唯一。
3. 版本号必须与实际修改同步。
4. 使用 VeneraX 支持的接口。
5. 不要将账号、密码、Cookie 或令牌写入公开仓库。
6. `index.json` 只登记准备公开使用的源。

## 兼容版本

VeneraX 3.0.0