---
sidebar_position: 1
---

# 资产预加载

在 World 构造之后，可以通过 World 的 `getPreload` 方法获取到预加载模块，对 World 下所有用到的资产进行预加载。预加载会把资产都存储到浏览器的 IndexedDB 中，在 World 运行使用资产的时候就优先使用 IndexedDB 中的缓存资产，如果 IndexedDB 中未查询到资产会降级到使用网络资源，这会大大降低用户使用体验。所以建议使用预加载功能。

## 开始预加载

```ts
class Preload {
  start(onProgress?: IPreloadProgress, options?: IPreloadStartOptions): Promise<void>
}
```

调用 start 方法就可以进行预加载，preload 异步调用完成，就代表着预加载完成。可以传入 onProgress 方法作为预加载进度的回调，每秒都会回调 1 次。

预加载进度也支持以事件形式通知:

```typescript
world.getPreload().on('progress', ({ current, total }) => {
  const progressText = `(${current}/${total})`
})
```

## 停止预加载

```ts
class Preload {
  /**
   * 停止预加载
   */
  stop(): void
}
```

在某些情况下你可能会想要停止预加载，可以通过调用 `stop` 方法来实现。当然停止之后可以重新调用 `start` 来继续完成未完成的资产加载。这会使得 onProgress 回调的 current total 参数都会重新开始计算。

预加载 `start`、`stop` 都是可重复调用的，在同一个 releaseId 下多次暂停下载再开启下载就能实现分段加载的功能。

## 预加载资产下载超时

预加载在单个资产即将超时时会以事件形式通知，注意在网络情况差的场景下，可能会多次触发事件，业务侧在使用时可以根据使用场景进行节流等处理方式。

```typescript
world.getPreload().on('timeout', ({ url, size }) => {
  // do something
})
```

## 分包加载

一个应用下有多个房间多个 Avatar，开发者如果不想一次性加载全部资源，而是首次加载第一个房间必须的资源，后续切换房间的时候再按需加载对应房间的资源就可以使用分包的功能。

它的实现可以通过在 `start` 方法传入 `filterCallback` 选项来实现，`filterCallback` 的背后是基于 `Array.prototype.filter`，它就是数组 `filter` 方法的参数，用于在一次下载过程中过滤某些不需要的资源。

`filterCallback` 的第一个参数是单个资源的描述信息，它的数据结构如下，一般情况下可以根据 `roomId` 和 `avatarId` 就能实现一次预加载过程只下载某几个房间或者某几个 Avatar。后续分包过程可以按照自己的业务逻辑来过滤不同的资源。

```ts
export interface IPreloadItemConfig {
  assetPath: string
  assetSize: number
  assetType: string
  assetUrl: string
  packName: string
  roomId: string
  avatarId: string
}
```

这里需要注意的是所有 Avatar 的资产的 `roomId` 属性为空字符串。所有房间资产的 `avatarId` 属性都为空字符串

## 在不同 releaseId 之间切换

因为 IndexedDB 的存储容量有限，所以在使用了预加载的不同应用或者不同 releaseId 之间切换时，SDK 内部会根据 IndexedDB 中已下载过的资产和当下需要下载的资产进行对比，并且清除掉不在该 releaseId 中的资产，只下载需要下载的资产。

可以通过 `preload.getPreloadType` 方法获取到预加载类型

```ts
class Preload {
  /**
   * 主动获取预加载更新类型
   * @returns
   */
  getPreloadType(): Promise<IPreloadType>
}

/**
 * 分别对应 全新下载、增量下载、已完整下载过
 */
export declare type IPreloadType = 'fresh' | 'increment' | 'completed'
```
