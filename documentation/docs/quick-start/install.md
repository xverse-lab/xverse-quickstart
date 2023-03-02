---
sidebar_position: 1
---

# 安装

## 机型要求

只支持 Chrome 56+ 和 Safari 11+

## 安装 Xverse

我们提供了 [NPM](#NPM) 和 [CDN](#CDN) 2 种安装方式

### NPM

```shell
npm install @xverse/core@latest
```

完成安装后，在可以支持 ES 模块导入的工程中就可以引入 Xverse SDK 提供的模块，参考如下示例

```ts
import { World, Room, Avatar, RichSurface, SubSequence, IWorldOptions } from '@xverse/core'
```

另外 NPM 包中也提供了完整的 TypeScript 声明定义。

### CDN

我们也提供了 CDN 获取的方式
[https://download.xverse.cn/js/xverse/2.0.0/bundle.umd.js](https://download.xverse.cn/js/xverse/2.0.0/bundle.umd.js)

更换不同版本只需要更换上述链接中的版本地址，如 https://download.xverse.cn/js/xverse/2.0.1/bundle.umd.js 就能获取到 2.0.1 版本的 SDK。

加载 CDN 方式引入的 SDK 后，在 Window 下的 `XverseJS` 可以访问到 SDK 导出的所有模块。参考如下示例

```ts
const { World, Room, Avatar, RichSurface, SubSequence, IWorldOptions } = window.XverseJS
```
